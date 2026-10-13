/**
 * ============================================================================
 * PORTAL MOLDE INJEÇÃO - GOOGLE APPS SCRIPT WEBHOOK (MICRO CRM B2B)
 * ============================================================================
 * 
 * INSTRUÇÕES RÁPIDAS (2 MINUTOS):
 * 1. Abra o Google Sheets (sheets.new) e crie uma planilha com o nome:
 *    "Leads - Portal Molde Injeção"
 * 2. No menu superior, clique em: Extensões > Apps Script
 * 3. Apague qualquer código que estiver lá e cole todo este código abaixo.
 * 4. Clique no botão azul "Implantar" (canto superior direito) > "Nova implantação".
 * 5. Clique no ícone de engrenagem ⚙️ ao lado de "Selecione o tipo" e escolha: "App da Web".
 * 6. Preencha:
 *    - Descrição: Webhook Portal Molde Injeção
 *    - Executar como: Eu (seu e-mail)
 *    - Quem pode acessar: Qualquer pessoa (IMPORTANTE: precisa ser 'Qualquer pessoa')
 * 7. Clique em "Implantar", autorize o acesso da sua conta Google e copie o "URL do app da Web".
 * 8. Cole a URL no botão "⚙️ Configurações" do seu painel-leads.html (ou nos passe aqui).
 * ============================================================================
 */

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    
    // Se só tiver cabeçalho ou estiver vazia
    if (rows.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var headers = rows[0];
    var leads = [];
    
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      var lead = {};
      for (var j = 0; j < headers.length; j++) {
        var key = headers[j].toString().toLowerCase().trim();
        // Mapeamentos amigáveis
        if (key === 'serviço' || key === 'servico') key = 'servico';
        if (key === 'detalhes técnicos' || key === 'detalhestécnicos' || key === 'detalhes') key = 'detalhes';
        if (key === 'página' || key === 'pagina') key = 'pagina';
        lead[key] = row[j];
      }
      leads.push(lead);
    }
    
    // Inverter para mostrar os mais recentes primeiro
    leads.reverse();
    
    return ContentService.createTextOutput(JSON.stringify(leads))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};
    
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    // Se a aba estiver totalmente vazia, cria o cabeçalho técnico B2B
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ID",
        "Data",
        "Hora",
        "Nome",
        "Empresa",
        "Telefone",
        "Email",
        "Cidade",
        "Servico",
        "Tiragem",
        "Detalhes",
        "Pagina",
        "Tipo",
        "Timestamp"
      ]);
      
      // Estiliza a linha de cabeçalho
      var headerRange = sheet.getRange(1, 1, 1, 14);
      headerRange.setBackground("#0f172a");
      headerRange.setFontColor("#38bdf8");
      headerRange.setFontWeight("bold");
    }
    
    var now = new Date();
    var formattedDate = Utilities.formatDate(now, "America/Sao_Paulo", "dd/MM/yyyy");
    var formattedTime = Utilities.formatDate(now, "America/Sao_Paulo", "HH:mm");
    
    sheet.appendRow([
      data.id || ("pmi_" + now.getTime()),
      data.data || formattedDate,
      data.hora || formattedTime,
      data.nome || "Visitante B2B",
      data.empresa || "-",
      data.telefone || "-",
      data.email || "-",
      data.cidade || "-",
      data.servico || "Consulta Geral",
      data.tiragem || "-",
      data.detalhes || "-",
      data.pagina || "/",
      data.tipo || "WhatsApp",
      data.timestamp || now.getTime()
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", received: data.nome }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
