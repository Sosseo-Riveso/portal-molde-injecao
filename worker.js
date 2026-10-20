import { EmailMessage } from "cloudflare:email";

const KV_KEY = 'leads_portal_molde';
const KV_META_KEY = 'leads_portal_molde_meta';

function getLeadSig(l) {
  if (!l) return '';
  const tel = String(l.telefone || l.whatsapp || '').replace(/\D/g, '');
  const d = String(l.data || '').trim();
  const h = String(l.hora || '').trim();
  return `${tel}_${d}_${h}`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Redirecionamento 301 de domínios secundários para o canônico
    if (
      url.hostname === 'www.portalmoldeinjecao.com.br' ||
      url.hostname.endsWith('.workers.dev') ||
      url.hostname.endsWith('.pages.dev')
    ) {
      url.hostname = 'portalmoldeinjecao.com.br';
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json; charset=utf-8'
    };

    if (url.pathname === '/api/triagem') {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
      }

      if (request.method === 'GET') {
        try {
          let list = [];
          let meta = { clearedAt: 0, deletedSignatures: [] };
          if (env.LEADS_KV) {
            list = await env.LEADS_KV.get(KV_KEY, { type: 'json' }) || [];
            meta = await env.LEADS_KV.get(KV_META_KEY, { type: 'json' }) || { clearedAt: 0, deletedSignatures: [] };
          }
          return new Response(JSON.stringify({ ok: true, leads: list, meta }), { status: 200, headers: corsHeaders });
        } catch (err) {
          return new Response(JSON.stringify({ ok: false, leads: [], error: err.message }), { status: 500, headers: corsHeaders });
        }
      }

      if (request.method === 'POST' || request.method === 'DELETE' || request.method === 'PUT') {
        try {
          const dados = await request.json();

          // Ações de gerenciamento / exclusão / expurgo no Mini CRM
          if (dados && dados.action) {
            let list = [];
            let meta = { clearedAt: 0, deletedSignatures: [] };
            if (env.LEADS_KV) {
              list = await env.LEADS_KV.get(KV_KEY, { type: 'json' }) || [];
              meta = await env.LEADS_KV.get(KV_META_KEY, { type: 'json' }) || { clearedAt: 0, deletedSignatures: [] };
            }
            const delSet = new Set(Array.isArray(meta.deletedSignatures) ? meta.deletedSignatures : []);
            if (Array.isArray(dados.signatures)) {
              dados.signatures.forEach(s => { if (s) delSet.add(String(s)); });
            }

            if (dados.action === 'clear') {
              list.forEach(l => {
                if (l && l.id) delSet.add(String(l.id));
                const sig = getLeadSig(l);
                if (sig) delSet.add(sig);
              });
              list = [];
              meta.clearedAt = Number(dados.clearedAt) || Date.now();
            } else if (dados.action === 'delete') {
              const targetId = dados.id ? String(dados.id) : '';
              const targetSig = dados.signature || getLeadSig(dados);
              if (targetId) delSet.add(targetId);
              if (targetSig) delSet.add(targetSig);
              list = list.filter(l => {
                if (targetId && String(l.id) === targetId) return false;
                if (targetSig && getLeadSig(l) === targetSig) return false;
                return true;
              });
            } else if (dados.action === 'delete_month' && dados.month) {
              const targetMonth = String(dados.month);
              list = list.filter(l => {
                const d = String(l.data || '');
                const match = d.includes('/' + targetMonth) || d.includes(targetMonth);
                if (match) {
                  if (l.id) delSet.add(String(l.id));
                  const sig = getLeadSig(l);
                  if (sig) delSet.add(sig);
                  return false;
                }
                return true;
              });
            } else if (dados.action === 'prune_year') {
              const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
              list = list.filter(l => {
                const ts = Number(l.timestamp) || Date.now();
                if (ts < oneYearAgo) {
                  if (l.id) delSet.add(String(l.id));
                  const sig = getLeadSig(l);
                  if (sig) delSet.add(sig);
                  return false;
                }
                return true;
              });
            } else if (dados.action === 'sync_replace' && Array.isArray(dados.leads)) {
              list = dados.leads;
            }

            meta.deletedSignatures = Array.from(delSet).slice(-2000);
            if (env.LEADS_KV) {
              await env.LEADS_KV.put(KV_KEY, JSON.stringify(list));
              await env.LEADS_KV.put(KV_META_KEY, JSON.stringify(meta));
            }
            return new Response(JSON.stringify({ ok: true, action: dados.action, leads: list, meta }), { status: 200, headers: corsHeaders });
          }

          // Cadastro normal de novo Lead
          const nome = dados.nome || 'Não informado';
          const whatsapp = dados.whatsapp || dados.telefone || 'Não informado';
          const empresa = dados.empresa || dados.veiculo || 'Não informada';
          const servico = dados.servico || dados.problema || dados.tipo || 'Cotação B2B / Molde / Injeção';
          const pagina = dados.pagina || '/';
          const dataHora = dados.data ? `${dados.data} às ${dados.hora || ''}` : new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

          if (env.LEADS_KV) {
            try {
              const leadId = dados.id || ('pmi_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7));
              const leadObj = { ...dados, id: leadId, timestamp: dados.timestamp || Date.now() };
              let list = await env.LEADS_KV.get(KV_KEY, { type: 'json' }) || [];
              list.unshift(leadObj);
              if (list.length > 500) list = list.slice(0, 500);
              await env.LEADS_KV.put(KV_KEY, JSON.stringify(list));
            } catch (kvErr) {
              console.error('Erro ao salvar no KV:', kvErr);
            }
          }

          const rawEmail = [
            `From: "Portal Molde Injecao" <contato@portalmoldeinjecao.com.br>`,
            `To: riveso@gmail.com`,
            `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(`🏭 Novo Lead Industrial (Portal Molde Injeção): ${nome}`)))}?=`,
            `MIME-Version: 1.0`,
            `Content-Type: text/plain; charset=UTF-8`,
            `Content-Transfer-Encoding: 8bit`,
            ``,
            `NOVO LEAD / RFQ CAPTADO NO SITE - PORTAL MOLDE INJEÇÃO`,
            `======================================================`,
            ``,
            `👤 Nome: ${nome}`,
            `📱 WhatsApp / Telefone: ${whatsapp}`,
            `🏢 Empresa / Info: ${empresa}`,
            `⚙️ Demanda / Serviço: ${servico}`,
            `📄 Página de Origem: ${pagina}`,
            `🕒 Data/Hora: ${dataHora}`,
            ``,
            `------------------------------------------------------`,
            `Ação rápida no WhatsApp:`,
            `https://wa.me/55${whatsapp.replace(/\D/g, '')}`,
          ].join('\r\n');

          if (env.SEND_EMAIL) {
            const msg = new EmailMessage(
              'contato@portalmoldeinjecao.com.br',
              'riveso@gmail.com',
              rawEmail
            );
            await env.SEND_EMAIL.send(msg);
          }

          return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
        } catch (err) {
          return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: corsHeaders });
        }
      }
    }

    // 3. Servir arquivos estáticos com suporte a clean URLs (.html)
    let response = await env.ASSETS.fetch(request);
    if (response.status === 404 && !url.pathname.includes('.')) {
      const htmlUrl = new URL(url.pathname.replace(/\/$/, '') + '.html', url.origin);
      const htmlResponse = await env.ASSETS.fetch(new Request(htmlUrl, request));
      if (htmlResponse.status === 200) {
        return htmlResponse;
      }
    }
    return response;
  }
};
