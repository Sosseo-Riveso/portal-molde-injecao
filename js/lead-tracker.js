/**
 * Portal Molde Injeção - Lead Tracker & CRM Engine
 * Captura automática de oportunidades (WhatsApp, Formulários Hero e RFQ)
 * Política de Retenção Ativa: Armazena leads por 1 ano (365 dias) com expurgo contínuo mês a mês.
 */

(function () {
  'use strict';

  // Configurações Padrão
  const STORAGE_KEY = 'pmi_leads';
  const CONFIG_PHONE_KEY = 'pmi_dest_phone';
  const CONFIG_WEBHOOK_KEY = 'pmi_webhook_url';
  const DEFAULT_PHONE = '5511999999999'; // Pode ser atualizado no Painel de Leads
  const RETENTION_DAYS = 365; // Retenção máxima de 1 ano

  // Obter número de destino atual
  function getDestPhone() {
    return localStorage.getItem(CONFIG_PHONE_KEY) || DEFAULT_PHONE;
  }

  // Política de Retenção: Expurga registros com mais de 365 dias
  function pruneExpiredLeads(leads) {
    if (!Array.isArray(leads)) return [];
    const oneYearAgo = Date.now() - (RETENTION_DAYS * 24 * 60 * 60 * 1000);
    
    // Filtra mantendo apenas registros dos últimos 365 dias
    return leads.filter(item => {
      const ts = item.timestamp || parseDateToTimestamp(item.data, item.hora);
      return ts >= oneYearAgo;
    });
  }

  function parseDateToTimestamp(dateStr, timeStr) {
    if (!dateStr) return Date.now();
    try {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        let hour = 12, min = 0;
        if (timeStr && timeStr.includes(':')) {
          const tParts = timeStr.split(':');
          hour = parseInt(tParts[0], 10) || 12;
          min = parseInt(tParts[1], 10) || 0;
        }
        return new Date(year, month, day, hour, min).getTime();
      }
    } catch (e) {}
    return Date.now();
  }

  // Obter lista tratada de leads
  function getLeads() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      const cleaned = pruneExpiredLeads(parsed);
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    } catch (e) {
      console.error('Erro ao ler leads:', e);
      return [];
    }
  }

  // Função Global para Gravação de Leads
  window.pmiTrackLead = function (data) {
    const now = new Date();
    const lead = {
      id: 'pmi_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      timestamp: Date.now(),
      data: now.toLocaleDateString('pt-BR'),
      hora: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      nome: (data.nome || 'Visitante B2B').trim(),
      empresa: (data.empresa || '-').trim(),
      telefone: (data.telefone || '').trim(),
      email: (data.email || '-').trim(),
      cidade: (data.cidade || '-').trim(),
      servico: (data.servico || 'Consulta Geral').trim(),
      tiragem: (data.tiragem || '-').trim(),
      detalhes: (data.detalhes || '-').trim(),
      pagina: data.pagina || window.location.pathname || '/',
      origem: data.origem || document.title || 'Portal Molde Injeção',
      tipo: data.tipo || 'Contato'
    };

    // 1. Grava no LocalStorage com retenção de 1 ano
    try {
      let leads = getLeads();
      leads.unshift(lead);
      leads = pruneExpiredLeads(leads);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (err) {
      console.error('Falha ao salvar lead localmente:', err);
    }

    // 2. Disparo para Webhook (se configurado)
    const webhook = localStorage.getItem(CONFIG_WEBHOOK_KEY);
    if (webhook) {
      try {
        fetch(webhook, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead)
        }).catch(() => {});
      } catch (e) {}
    }

    return lead;
  };

  // Inicialização no DOM
  document.addEventListener('DOMContentLoaded', () => {
    initLeadGateModal();
    initHeroForm();
    initContactForm();
  });

  // Modal de WhatsApp (Lead Gate B2B)
  function initLeadGateModal() {
    if (document.getElementById('pmiLeadModal')) return;

    const modalHtml = `
      <div id="pmiLeadModal" style="position:fixed;inset:0;width:100vw;height:100vh;background:rgba(7,11,20,0.88);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:9999999;display:none;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;">
        <div style="position:relative;background:#0f172a;border:1px solid rgba(56,189,248,0.4);box-shadow:0 25px 60px rgba(0,0,0,0.9),0 0 40px rgba(2,132,199,0.25);border-radius:20px;width:100%;max-width:440px;padding:32px 28px;color:#ffffff;box-sizing:border-box;font-family:system-ui,-apple-system,sans-serif;">
          
          <button type="button" id="pmiCloseModal" style="position:absolute;top:16px;right:18px;background:none;border:none;color:#94a3b8;font-size:24px;cursor:pointer;line-height:1;" aria-label="Fechar">&times;</button>
          
          <div style="margin-bottom:20px;text-align:center;">
            <span style="display:inline-block;padding:4px 10px;background:rgba(56,189,248,0.15);border:1px solid rgba(56,189,248,0.3);color:#38bdf8;font-size:11px;font-weight:700;border-radius:999px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Atendimento Técnico B2B</span>
            <h3 style="margin:0 0 6px;font-size:20px;font-weight:800;color:#ffffff;">Fale com a Engenharia & Comercial</h3>
            <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.4;">Preencha para direcionarmos seu contato com prioridade para um especialista em moldes e injeção.</p>
          </div>

          <form id="pmiLeadGateForm" style="display:flex;flex-direction:column;gap:14px;">
            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:#cbd5e1;margin-bottom:4px;">Seu Nome / Cargo:</label>
              <input type="text" id="pmiGateNome" placeholder="Ex: Eng. Marcelo - Compras Técnicas" required style="width:100%;box-sizing:border-box;background:#070b14;border:1px solid #334155;color:#ffffff;padding:11px 14px;border-radius:8px;font-size:14px;outline:none;">
            </div>

            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:#cbd5e1;margin-bottom:4px;">Empresa / Indústria:</label>
              <input type="text" id="pmiGateEmpresa" placeholder="Razão Social ou Nome Fantasia" style="width:100%;box-sizing:border-box;background:#070b14;border:1px solid #334155;color:#ffffff;padding:11px 14px;border-radius:8px;font-size:14px;outline:none;">
            </div>

            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:#cbd5e1;margin-bottom:4px;">WhatsApp com DDD:</label>
              <input type="tel" id="pmiGateTelefone" placeholder="(11) 99999-9999" required maxlength="15" style="width:100%;box-sizing:border-box;background:#070b14;border:1px solid #334155;color:#ffffff;padding:11px 14px;border-radius:8px;font-size:14px;outline:none;">
            </div>

            <button type="submit" style="margin-top:6px;background:linear-gradient(135deg,#0284c7 0%,#0369a1 100%);color:#ffffff;border:none;padding:13px;border-radius:10px;font-size:15px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity 0.2s;">
              <span>💬 Iniciar Conversa no WhatsApp ➔</span>
            </button>
            
            <span style="font-size:11px;color:#64748b;text-align:center;display:block;">🔒 Dados protegidos. Confidencialidade industrial garantida.</span>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('pmiLeadModal');
    const closeBtn = document.getElementById('pmiCloseModal');
    const form = document.getElementById('pmiLeadGateForm');
    const telInput = document.getElementById('pmiGateTelefone');

    // Máscara de telefone
    if (telInput) {
      telInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.substring(0, 11);
        if (v.length > 6) {
          e.target.value = `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
        } else if (v.length > 2) {
          e.target.value = `(${v.substring(0, 2)}) ${v.substring(2)}`;
        } else if (v.length > 0) {
          e.target.value = `(${v}`;
        } else {
          e.target.value = '';
        }
      });
    }

    let defaultMsg = 'Olá! Acessei o Portal Molde Injeção e gostaria de solicitar um orçamento técnico.';

    function openModal(customText) {
      if (customText) defaultMsg = customText;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const input = document.getElementById('pmiGateNome');
        if (input) input.focus();
      }, 100);
    }

    function closeModal() {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Interceptar cliques em links de WhatsApp
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"]');
      if (link && !link.hasAttribute('data-no-modal')) {
        e.preventDefault();
        const href = link.getAttribute('href') || '';
        let extractedText = '';
        if (href.includes('text=')) {
          try {
            extractedText = decodeURIComponent(href.split('text=')[1]);
          } catch (err) {}
        }
        openModal(extractedText);
      }
    });

    // Submissão do Modal
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('pmiGateNome').value.trim();
        const empresa = document.getElementById('pmiGateEmpresa').value.trim();
        const telefone = document.getElementById('pmiGateTelefone').value.trim();

        if (!nome || !telefone) return;

        window.pmiTrackLead({
          nome: nome,
          empresa: empresa,
          telefone: telefone,
          servico: 'Contato WhatsApp',
          tipo: 'WhatsApp Popup'
        });

        const targetPhone = getDestPhone();
        const finalMsg = `Olá! Meu nome é ${nome}${empresa ? ' da empresa ' + empresa : ''}. Vim através do Portal Molde Injeção para solicitar um orçamento.`;
        const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(finalMsg)}`;

        closeModal();
        form.reset();
        window.open(waUrl, '_blank');
      });
    }
  }

  // Interceptador do Formulário Hero (Topo da Home)
  function initHeroForm() {
    const heroForm = document.querySelector('form[action="#contato"]');
    if (!heroForm) return;

    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputs = heroForm.querySelectorAll('input, select');
      let nome = '', empresa = '', telefone = '', demanda = '', polimero = '';

      inputs.forEach(input => {
        const ph = (input.getAttribute('placeholder') || '').toLowerCase();
        const label = input.previousElementSibling ? input.previousElementSibling.innerText.toLowerCase() : '';
        const val = input.value;

        if (label.includes('nome') || ph.includes('compras técnicas')) nome = val;
        else if (label.includes('empresa') || ph.includes('nome da empresa')) empresa = val;
        else if (label.includes('whatsapp') || ph.includes('99999-9999')) telefone = val;
        else if (input.tagName === 'SELECT') demanda = val;
        else if (label.includes('polímero') || ph.includes('polipropileno')) polimero = val;
      });

      if (!nome || !telefone) {
        alert('Por favor, informe seu Nome e WhatsApp comercial.');
        return;
      }

      window.pmiTrackLead({
        nome: nome,
        empresa: empresa,
        telefone: telefone,
        servico: demanda || 'Estudo de Viabilidade Hero',
        detalhes: polimero ? `Polímero pretendido: ${polimero}` : '',
        tipo: 'Formulário Hero B2B'
      });

      showFormSuccessFeedback(heroForm, 'Solicitação Enviada com Sucesso!', 'Nossa engenharia comercial entrará em contato em até 24h para apresentar a análise de viabilidade.');
    });
  }

  // Interceptador do Formulário Principal da Seção #contato
  function initContactForm() {
    const contactSection = document.getElementById('contato');
    if (!contactSection) return;
    const form = contactSection.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nomeInput = form.querySelector('input[placeholder="Seu nome"]');
      const emailInput = form.querySelector('input[type="email"]');
      const telInput = form.querySelector('input[type="tel"]');
      const empresaInput = form.querySelector('input[placeholder="Razão Social"]');
      const cidadeInput = form.querySelector('input[placeholder*="São Paulo"]');
      const servicoSelect = form.querySelector('select');
      const tiragemInput = form.querySelector('input[placeholder*="peças/mês"]');
      const detalhesText = form.querySelector('textarea');

      const nome = nomeInput ? nomeInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const telefone = telInput ? telInput.value.trim() : '';
      const empresa = empresaInput ? empresaInput.value.trim() : '';
      const cidade = cidadeInput ? cidadeInput.value.trim() : '';
      const servico = servicoSelect ? servicoSelect.value : 'Cotação Geral';
      const tiragem = tiragemInput ? tiragemInput.value.trim() : '';
      const detalhes = detalhesText ? detalhesText.value.trim() : '';

      if (!nome || !telefone) {
        alert('Por favor, preencha os campos obrigatórios (Nome e Telefone/WhatsApp).');
        return;
      }

      window.pmiTrackLead({
        nome: nome,
        email: email,
        telefone: telefone,
        empresa: empresa,
        cidade: cidade,
        servico: servico,
        tiragem: tiragem,
        detalhes: detalhes,
        tipo: 'RFQ Cotação Formal'
      });

      showFormSuccessFeedback(form, 'Cotação Recebida com Sucesso!', 'Recebemos os detalhes técnicos do seu projeto. Nossa equipe de engenharia e ferramentaria retornará com o orçamento detalhado.');
    });
  }

  // Feedback Visual Suave no Formulário
  function showFormSuccessFeedback(formElement, title, desc) {
    const originalContent = formElement.innerHTML;
    formElement.innerHTML = `
      <div style="text-align:center;padding:30px 20px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:14px;color:#ffffff;">
        <span style="display:inline-block;font-size:36px;margin-bottom:8px;">✅</span>
        <h4 style="margin:0 0 8px;font-size:18px;font-weight:800;color:#34d399;">${title}</h4>
        <p style="margin:0 0 16px;font-size:13px;color:#cbd5e1;line-height:1.5;">${desc}</p>
        <button type="button" id="pmiResetFormBtn" style="background:#0284c7;color:#ffffff;border:none;padding:9px 18px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">
          Enviar Outra Solicitação
        </button>
      </div>
    `;

    const resetBtn = formElement.querySelector('#pmiResetFormBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        formElement.innerHTML = originalContent;
        initHeroForm();
        initContactForm();
      });
    }
  }

})();
