# 📊 Como Conectar o Google Sheets ao Micro CRM do Portal Molde Injeção

Para que os leads preenchidos por visitantes de qualquer lugar do Brasil (no computador ou celular deles) cheguem instantaneamente ao seu painel e fiquem salvos em nuvem com 100% de segurança e gratuidade, basta conectar uma planilha do Google Sheets através do Google Apps Script.

Leva apenas **2 minutos** e não exige conhecimento de programação.

---

## 🛠️ Passo a Passo Rápido

### Passo 1: Criar a Planilha no Google Drive
1. Acesse o seu Google Drive ou digite no navegador: [sheets.new](https://sheets.new)
2. Dê um nome para a planilha no topo esquerdo, por exemplo:
   **`Leads - Portal Molde Injeção`**

---

### Passo 2: Abrir o Editor de Scripts
1. No menu superior da planilha, clique em: **Extensões** > **Apps Script**.
2. Uma nova aba do Google Apps Script será aberta.
3. Apague qualquer linha que estiver escrita na tela (como `function myFunction() { ... }`).

---

### Passo 3: Colar o Código do Webhook
1. Abra o arquivo [`GOOGLE-APPS-SCRIPT-CRM.js`](file:///c:/Users/Reinaldo/Desktop/SOSSEO_sites/portal-molde-injecao/GOOGLE-APPS-SCRIPT-CRM.js) deste projeto.
2. Copie todo o conteúdo do arquivo e cole dentro do editor do Apps Script.
3. Pressione `Ctrl + S` (ou clique no ícone de disquete 💾) para salvar o projeto.

---

### Passo 4: Criar a Implantação Web (Gerar o Link)
1. No canto superior direito da tela do Apps Script, clique no botão azul **Implantar** > **Nova implantação**.
2. Na janela que abrir, clique na engrenagem ⚙️ (ao lado esquerdo de *"Selecione o tipo"*) e escolha **App da Web**.
3. Configure os 3 campos:
   - **Descrição:** `Webhook Portal Molde Injeção`
   - **Executar como:** `Eu (seu e-mail)`
   - **Quem pode acessar:** `Qualquer pessoa` *(⚠️ ATENÇÃO: É fundamental selecionar "Qualquer pessoa" para que os visitantes do site consigam enviar o lead sem precisar fazer login no Google).*
4. Clique em **Implantar**.
5. Se o Google solicitar autorização de segurança:
   - Clique em **Autorizar acesso**;
   - Escolha a sua conta Google;
   - Se aparecer *"O Google não verificou este app"*, clique em **Avançado** (no rodapé) e depois em **Acessar [Nome do Projeto] (não seguro)**;
   - Clique em **Permitir**.
6. Copie a **URL do app da Web** gerada (começa com `https://script.google.com/macros/s/.../exec`).

---

### Passo 5: Ativar no seu Painel de Leads
1. Abra o arquivo [`painel-leads.html`](file:///c:/Users/Reinaldo/Desktop/SOSSEO_sites/portal-molde-injecao/painel-leads.html) no seu navegador.
2. Digite sua senha (`pmi2026`).
3. Clique no botão superior **"⚙️ Configurações & Senha"**.
4. No campo **"URL do Webhook Google Sheets"**, cole a URL copiada no Passo 4.
5. Clique em **"Salvar Alterações"**.

---

## 🎯 Pronto! O que acontece agora?
- A barra superior do painel exibirá o indicador: **🟢 Google Sheets Conectado & Sincronizado**.
- Qualquer pessoa que clicar no WhatsApp ou enviar uma cotação no site terá os dados gravados automaticamente na sua planilha do Google Sheets.
- O seu painel puxará todos os leads da planilha em tempo real sempre que você abrir ou clicar no botão **"🔄 Atualizar / Sincronizar"**.
