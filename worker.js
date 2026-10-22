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
          const email = dados.email || 'Não informado';
          const empresa = dados.empresa || dados.veiculo || 'Não informada';
          const cidade = dados.cidade || 'Não informada';
          const servico = dados.servico || dados.problema || dados.tipo || 'Cotação B2B / Molde / Injeção';
          const tiragem = dados.tiragem || '-';
          const detalhes = dados.detalhes || '-';
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

          const escapeHtml = (str) => String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');

          const utf8ToBase64 = (str) => {
            const bytes = new TextEncoder().encode(String(str || ''));
            let binary = '';
            for (let i = 0; i < bytes.length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
          };

          const cleanTel = String(whatsapp).replace(/\D/g, '');
          const htmlBody = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f9; margin: 0; padding: 8px 6px; color: #1e293b; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <div style="width: 100%; max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; box-sizing: border-box;">
    <div style="background: linear-gradient(135deg, #0f172a 0%, #0284c7 100%); color: #ffffff; padding: 16px 16px; border-radius: 11px 11px 0 0; box-sizing: border-box;">
      <h2 style="margin: 0; font-size: 18px; line-height: 1.35; word-break: break-word;">🏭 Novo Lead B2B — Portal Molde Injeção</h2>
      <p style="margin: 6px 0 0; font-size: 12px; line-height: 1.4; opacity: 0.9; word-break: break-word;">Recebido em ${escapeHtml(dataHora)} • portalmoldeinjecao.com.br</p>
    </div>
    <div style="padding: 14px 16px; box-sizing: border-box;">
      <div style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
        <div style="font-size: 12px; font-weight: bold; color: #475569; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 3px;">👤 Nome / Contato</div>
        <div style="font-size: 15px; font-weight: bold; color: #0f172a; word-break: break-word; overflow-wrap: anywhere; line-height: 1.4;">${escapeHtml(nome)}</div>
      </div>
      <div style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
        <div style="font-size: 12px; font-weight: bold; color: #475569; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 3px;">🏢 Empresa / Indústria</div>
        <div style="font-size: 15px; color: #0f172a; word-break: break-word; overflow-wrap: anywhere; line-height: 1.4;">${escapeHtml(empresa)}</div>
      </div>
      <div style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
        <div style="font-size: 12px; font-weight: bold; color: #475569; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 3px;">📱 WhatsApp / Telefone</div>
        <div style="font-size: 15px; font-weight: bold; color: #0f172a; word-break: break-word; overflow-wrap: anywhere; line-height: 1.4;">${escapeHtml(whatsapp)}</div>
      </div>
      <div style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
        <div style="font-size: 12px; font-weight: bold; color: #475569; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 3px;">📧 E-mail / Cidade</div>
        <div style="font-size: 15px; color: #0f172a; word-break: break-word; overflow-wrap: anywhere; line-height: 1.4;">${escapeHtml(email)} (${escapeHtml(cidade)})</div>
      </div>
      <div style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
        <div style="font-size: 12px; font-weight: bold; color: #475569; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 3px;">⚙️ Demanda / Serviço</div>
        <div style="font-size: 15px; font-weight: bold; color: #0284c7; word-break: break-word; overflow-wrap: anywhere; line-height: 1.4;">${escapeHtml(servico)}</div>
      </div>
      <div style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
        <div style="font-size: 12px; font-weight: bold; color: #475569; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 3px;">📦 Tiragem / Detalhes</div>
        <div style="font-size: 14px; color: #334155; word-break: break-word; overflow-wrap: anywhere; line-height: 1.5;">Tiragem: ${escapeHtml(tiragem)} | Detalhes: ${escapeHtml(detalhes)}</div>
      </div>
      <div style="padding: 10px 0;">
        <div style="font-size: 12px; font-weight: bold; color: #475569; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 3px;">📄 Página de Origem</div>
        <div style="font-size: 14px; color: #334155; word-break: break-word; overflow-wrap: anywhere; line-height: 1.4;">${escapeHtml(pagina)}</div>
      </div>
      <div style="margin-top: 18px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
        <a href="https://wa.me/55${cleanTel}" style="display: block; box-sizing: border-box; width: 100%; max-width: 340px; margin: 0 auto; background-color: #16a34a; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 16px; border-radius: 8px; font-size: 14px; text-align: center; word-break: break-word;">💬 Chamar Cliente no WhatsApp</a>
      </div>
    </div>
  </div>
</body>
</html>`;

          const bodyB64 = utf8ToBase64(htmlBody).replace(/(.{76})/g, '$1\r\n');
          const rawEmail = [
            `From: "Portal Molde Injecao" <contato@portalmoldeinjecao.com.br>`,
            `To: <riveso@gmail.com>`,
            `Subject: =?UTF-8?B?${utf8ToBase64(`🏭 Novo Lead Industrial (Portal Molde Injeção): ${nome}`)}?=`,
            `Message-ID: <pmi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@portalmoldeinjecao.com.br>`,
            `Date: ${new Date().toUTCString()}`,
            `MIME-Version: 1.0`,
            `Content-Type: text/html; charset=UTF-8`,
            `Content-Transfer-Encoding: base64`,
            ``,
            bodyB64,
            ``
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
