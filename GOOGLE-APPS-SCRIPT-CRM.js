/**
 * @OnlyCurrentDoc
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

    // 0. Comandos de Limpeza e Exclusão vindos do Mini CRM
    if (data && data.action) {
      var lastRow = sheet.getLastRow();
      var deletedCount = 0;

      if (data.action === 'clear') {
        if (lastRow > 1) {
          sheet.deleteRows(2, lastRow - 1);
          deletedCount = lastRow - 1;
        }
        return ContentService.createTextOutput(JSON.stringify({ status: "success", action: "clear", deleted: deletedCount }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      if (lastRow > 1) {
        var numCols = Math.max(sheet.getLastColumn(), 14);
        var rows = sheet.getRange(2, 1, lastRow - 1, numCols).getValues();
        var targetId = data.id ? String(data.id).trim() : '';
        var targetTel = data.telefone ? String(data.telefone).replace(/\D/g, '') : '';
        var targetData = data.data ? String(data.data).trim() : '';
        var targetMonth = data.month ? String(data.month).trim() : '';
        var cutoffTime = new Date().getTime() - (365 * 24 * 60 * 60 * 1000);

        for (var i = rows.length - 1; i >= 0; i--) {
          var r = rows[i];
          var rowId = String(r[0] || '').trim();
          var rowDateVal = r[1];
          var rowDateStr = (rowDateVal instanceof Date)
            ? Utilities.formatDate(rowDateVal, "America/Sao_Paulo", "dd/MM/yyyy")
            : String(rowDateVal || '').trim();
          var rowTel = String(r[5] || r[4] || '').replace(/\D/g, '');

          var shouldDelete = false;

          if (data.action === 'delete') {
            if (targetId && rowId === targetId) {
              shouldDelete = true;
            } else if (targetTel && rowTel === targetTel && (!targetData || rowDateStr === targetData)) {
              shouldDelete = true;
            }
          } else if (data.action === 'delete_month' && targetMonth) {
            if (rowDateStr.indexOf('/' + targetMonth) !== -1 || rowDateStr.indexOf(targetMonth) !== -1) {
              shouldDelete = true;
            }
          } else if (data.action === 'prune_year') {
            var parts = rowDateStr.split('/');
            if (parts.length === 3) {
              var rowDt = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10)).getTime();
              if (rowDt < cutoffTime) shouldDelete = true;
            }
          }

          if (shouldDelete) {
            sheet.deleteRow(i + 2);
            deletedCount++;
          }
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", action: data.action, deleted: deletedCount }))
        .setMimeType(ContentService.MimeType.JSON);
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
