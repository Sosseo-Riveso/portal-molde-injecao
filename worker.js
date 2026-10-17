import { EmailMessage } from "cloudflare:email";

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(String(str || ''));
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/worker.js' || url.pathname === '/wrangler.json') {
      return new Response('Not Found', { status: 404 });
    }

    if (url.pathname === '/api/triagem' && request.method === 'POST') {
      try {
        const data = await request.json();
        const siteName = "Portal Molde Injeção";
        const nome = data.nome || data.contact || 'Cliente via Site';
        const telefone = data.telefone || data.whatsapp || data.phone || 'Não informado';
        const veiculo = data.veiculo || data.empresa || data.company || 'Consultoria Técnica';
        const servico = data.servico || data.cambio || data.sistema || data.escopo || data.tipoCambio || 'Triagem Técnica';
        const regiao = data.bairro || data.regiao || data.cidade || '';
        const relato = data.sintoma || data.relato || data.detalhes || data.mensagem || '';
        const origem = data.paginaOrigem || data.origem || data.pagina || '/';

        if (env.LEADS_KV) {
          try {
            const stored = (await env.LEADS_KV.get('leads_list', 'json')) || [];
            stored.unshift({
              id: 'lead-' + Date.now(),
              siteName: siteName,
              company: veiculo + (regiao ? ' (' + regiao + ')' : ''),
              contact: nome,
              phone: telefone,
              email: data.email || '',
              service: servico,
              value: 2500,
              status: 'novo',
              source: "portalmoldeinjecao.com.br" + ' (' + origem + ')',
              notes: 'Veículo/Empresa: ' + veiculo + ' | Região: ' + regiao + ' | Relato: ' + relato,
              createdAt: new Date().toISOString()
            });
            await env.LEADS_KV.put('leads_list', JSON.stringify(stored.slice(0, 500)));
          } catch (kvErr) {}
        }

        if (env.SEND_EMAIL) {
          const fromEmail = 'contato@sosseo.com.br';
          const toEmail = 'riveso@gmail.com';
          const fromDisplayHeader = '=?UTF-8?B?' + utf8ToBase64(siteName) + '?= <' + fromEmail + '>';
          const subject = '⭐ ' + siteName + ' — ' + nome + ' (' + veiculo + ' / ' + servico + ')';
          const subjectHeader = '=?UTF-8?B?' + utf8ToBase64(subject) + '?=';
          const msgId = '<lead-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9) + '@sosseo.com.br>';
          const dateStr = new Date().toUTCString();
          const brDate = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

          const htmlBody = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
    <div style="background: linear-gradient(135deg, #0f172a 0%, #0d9488 100%); color: #ffffff; padding: 22px 28px;">
      <h2 style="margin: 0; font-size: 20px;">⭐ Novo Lead — ${escapeHtml(siteName)}</h2>
      <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">Recebido em ${escapeHtml(brDate)} (${escapeHtml(origem)})</p>
    </div>
    <div style="padding: 24px 28px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 160px; color: #475569;">🌐 Portal:</td><td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">⭐ ${escapeHtml(siteName)}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">👤 Cliente:</td><td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${escapeHtml(nome)}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">📱 WhatsApp:</td><td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">${escapeHtml(telefone)}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">🚗 Veículo / Empresa:</td><td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${escapeHtml(veiculo)}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">🔧 Serviço / Sistema:</td><td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0284c7; font-weight: bold;">${escapeHtml(servico)}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">📍 Bairro / Região:</td><td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${escapeHtml(regiao || '-')}</td></tr>
        <tr><td style="padding: 10px 0; font-weight: bold; color: #475569; vertical-align: top;">📝 Sintoma / Relato:</td><td style="padding: 10px 0; line-height: 1.5;">${escapeHtml(relato || '-')}</td></tr>
      </table>
      <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #e2e8f0; text-align: center;">
        <a href="https://api.whatsapp.com/send?phone=55${String(telefone).replace(/\D/g, '')}" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 8px; font-size: 14px;">💬 Chamar Cliente no WhatsApp</a>
      </div>
    </div>
  </div>
</body>
</html>`;

          const bodyB64 = utf8ToBase64(htmlBody).replace(/(.{76})/g, '$1\r\n');
          const rawMime = [
            'From: ' + fromDisplayHeader,
            'To: <' + toEmail + '>',
            'Subject: ' + subjectHeader,
            'Message-ID: ' + msgId,
            'Date: ' + dateStr,
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'Content-Transfer-Encoding: base64'
          ].join('\r\n') + '\r\n\r\n' + bodyB64 + '\r\n';

          await env.SEND_EMAIL.send(new EmailMessage(fromEmail, toEmail, rawMime));
        }

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false }), { status: 200 });
      }
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return new Response('Not Found', { status: 404 });
  }
};
