# Análise Técnica — Portal Molde Injeção (PMI)

> Documento de entendimento do projeto registrado em 26/10/2026.
> Projeto: **Portal Molde Injeção** — hub industrial B2B de fabricação de moldes de injeção plástica, injeção termoplástica e ferramentaria CNC. Modelo Rank & Rent (locação de imóvel digital).

---

## 1. Identificação e Infraestrutura

| Item | Valor |
|---|---|
| **Site** | https://portalmoldeinjecao.com.br/ |
| **Pasta local** | `c:\Users\Reinaldo\Desktop\SOSSEO_sites\portal-molde-injecao` |
| **Repositório Git** | `https://github.com/Sosseo-Riveso/portal-molde-injecao.git` |
| **Branch** | `main` |
| **Hospedagem** | **Cloudflare** (Worker + Assets — tem `wrangler.json` + `worker.js`) |
| **Deploy** | Automático via `git push` (GitHub → Cloudflare) |
| **E-mail de leads** | `riveso@gmail.com` (destinatário — mesmo padrão dos demais projetos) |
| **Remetente e-mail** | `contato@portalmoldeinjecao.com.br` |
| **WhatsApp padrão** | `5511999999999` (configurável no painel — `pmi_dest_phone`) |

### Como funciona o deploy
- **Cloudflare Worker + Assets** (mesmo padrão dos câmbios): `wrangler.json` define o Worker `portal-molde-injecao` com `assets.directory: "."` (serva toda a pasta como estática).
- **KV namespace** `LEADS_KV` (mesmo ID dos demais projetos: `2cbc209828db4822a3f351d9faa92dba`), com chave própria `leads_portal_molde`.
- **Email binding** `SEND_EMAIL` → `riveso@gmail.com`.
- **`.assetsignore`** padrão (`.git`,`.gitignore`,`.assetsignore`,`_redirects`,`_headers`,`worker.js`,`wrangler.json`).
- **`_redirects`** esperto: `/artigos/:slug` → `/:slug` (previne duplicação de URLs de artigos — não tem o problema do FG Car).
- **`.gitignore`**: `~$*`, `*.tmp`, `.DS_Store`, `Thumbs.db`.
- **Observação**: o nome da pasta local é `portal-molde-injecao` (com acento). O `.assetsignore` exclui `_redirects` e `_headers` — mas eles **não existem** (o `_redirects` existe? Sim, existe com a regra de artigos). **Ponto de atenção:** `.assetsignore` exclui `_redirects`, o que pode impedir que a regra `/artigos/:slug /:slug 301` funcione no deploy via Worker Assets. Verificar se o site está realmente aplicando o redirecionamento.

---

## 2. Estrutura de Pastas e Arquivos

```
portal-molde-injecao/
├── .git/                        # Repositório Git (GitHub Sosseo-Riveso)
├── imagens/                     # 35 imagens .webp + 1 .jpg + 1 .png (fotos técnicas de engenharia/fabricação)
├── js/
│   └── lead-tracker.js          # Engine de captura de leads (pmi_leads), endpoint /api/triagem, config phone custom
├── Logos/                       # Logotipos PMI (originais/, favicon, logos .webp/.png para schema e og:image)
├── *.html                       # Home + 4 pilares + 4 categorias + 8 artigos + 2 calculadoras + 4 institucionais + painel
├── *.md                         # 8 artigos fonte + 2 docs de negócio (.md)
├── *.docx                       # 3 documentos de planejamento comercial
├── worker.js                    # Cloudflare Worker (API /api/triagem + e-mail + assets)
├── wrangler.json                # Configuração do Worker (KV + Email binding)
├── GOOGLE-APPS-SCRIPT-CRM.js    # Webhook Google Sheets (Mini CRM PMI)
├── llms.txt / llms-full.txt     # Resumo GEO/AEO + dossiê técnico completo para IAs
├── DOSSIE-COMERCIAL-ARQUITETURA-E-SEO.md  # Documento estratégico de negócio (Rank & Rent)
├── COMO-CONECTAR-GOOGLE-SHEETS.md        # Guia de integração do CRM
├── sitemap.xml                  # 23 URLs
├── robots.txt                   # Permite bots de IA + tradicionais, bloqueia /painel-leads
```

**Arquivos de negócio:** `Dados do Portal Molde Injeção.docx` (estratégia comercial), `Objetivos e Regras do Portal Molde Injeção.docx` (regras), `Atendimento Cliente Comprador de Moldes e Injeção de Plásticos.docx` (processo de atendimento).

**Obs:** `~$dos do Portal Molde Injeção.docx` é temp do Word (ignorado pelo `.gitignore`).
---

## 3. Páginas do Site (24 HTML / 23 URLs no sitemap)

### Estrutura de Pilares B2B (hub de alta autoridade)
| Arquivo | Slug / URL | Objetivo |
|---|---|---|
| `index.html` | `/` | Hub Central (maior autoridade) |
| `fabricacao-de-moldes-de-injecao.html` | `/fabricacao-de-moldes-de-injecao` | Pilar — Maior ticket (R$ 35k–380k por molde) |
| `servicos-de-injecao-plastica.html` | `/servicos-de-injecao-plastica` | Pilar — Contratos recorrentes (R$ 15k–150k/mês) |
| `engenharia-e-desenvolvimento-de-moldes.html` | `/engenharia-e-desenvolvimento-de-moldes` | Pilar — Engenharia CAD/CAE (Moldflow) |
| `manutencao-e-modificacao-de-moldes.html` | `/manutencao-e-modificacao-de-moldes` | Pilar — Receita imediata (R$ 5k–45k) |

### Calculadoras (diferencial técnico único)
- `calculadora-tonelagem-injetora.html` → `/calculadora-tonelagem-injetora`
- `calculadora-custo-peca-injetada.html` → `/calculadora-custo-peca-injetada`

*Ferramentas interativas de engenharia — excelente para link building/tráfego técnico.*

### Artigos técnicos (8, com `.md` pareado na raiz)
`quanto-custa-fabricar-um-molde-de-injecao-plastica`, `diferenca-entre-aco-p20-2738-h13-e-inox-420-para-moldes`, `molde-camara-quente-vs-canal-frio-qual-escolher`, `como-calcular-forca-de-fechamento-e-tonelagem-da-injetora`, `simulacao-moldflow-e-analise-reologica-em-moldes-de-injecao`, `principais-defeitos-na-injecao-plastica-rebarbas-chupagem-e-empenamento`, `guia-de-resinas-termoplasticas-abs-pa66-policarbonato-pom-e-pp`, `manutencao-preventiva-e-corretiva-em-moldes-de-injecao`.

### Categorias (4)
`categoria-projeto-e-engenharia-de-moldes`, `categoria-ferramentaria-e-acos-para-moldes`, `categoria-processos-e-custos-de-injecao-plastica`, `categoria-manutencao-e-qualidade-de-matrizes`.

### Institucional + Conversão
`sobre.html`, `contato.html` (Central RFQ com upload de arquivo 3D + NDA), `politica-de-privacidade.html`, `termos-de-uso.html`, `painel-leads.html`.

---

## 4. Sistema de Captura de Leads / CRM

Sistema completo, no padrão dos câmbios, com um **diferencial forte para o modelo Rank & Rent**:

### Camada 1 — Frontend (`js/lead-tracker.js`)
- **Lead Gate** (modal de WhatsApp) + máscara de telefone + captura UTMs/GMN.
- **Storage local:** `pmi_leads` (retenção 365 dias).
- **Telefone de destino configurável:** `pmi_dest_phone` (em `localStorage`) — **permite apontar o WhatsApp para o dono/cliente sem alterar o código** (ideal para o modelo de locação: ao fechar contrato, basta configurar o número no painel).
- **Envio:** `POST /api/triagem` (Worker → KV + e-mail) + Webhook Google Sheets (`pmi_webhook_url` / `DEFAULT_WEBHOOK`).
- **Objeto global:** `window.pmiTrackLead`.

### Camada 2 — Backend Cloudflare Worker (`worker.js`)
- Rota `/api/triagem` (POST/GET/DELETE/PUT), KV key `leads_portal_molde` (+ meta).
- E-mail com **subject `🏭 Novo Lead Industrial (Portal Molde Injeção)`**, remetente `contato@portalmoldeinjecao.com.br`, destinatário `riveso@gmail.com`.
- Formata HTML completo do lead (nome, telefone, empresa, região, serviço, origem) + botão WhatsApp.

### Camada 3 — Google Sheets Webhook (`GOOGLE-APPS-SCRIPT-CRM.js`)
- Mesmo padrão: `doGet` lista / `doPost` inclui e limpa (clear/delete/prune).

### Painel de Gestão (`painel-leads.html`)
- **Senha padrão atual:** `fgcar2026` — ⚠️ **herdada do projeto FG Car** — revisar/alterar (chaves: `pmi_admin_pass`, `pmi_admin_auth`; usa também `ALT_PASS`).
- Lista leads do KV via `/api/triagem`, sincroniza Google Sheets, configura número destino e webhook.
---

## 5. SEO / GEO / AEO

- **Já no padrão correto de "hub"**: schema `Organization` + `WebSite` + `FAQPage` na home (NÃO declara negócio físico — coerente com imóvel digital). **Este projeto não tem o problema dos câmbios** (que usavam `AutoRepair`).
- **Páginas de serviço** com schema `Service` + `provider` + FAQ.
- **Conteúdo técnico de engenharia de altíssima densidade**: aços (P20, 2738, H13, Inox 420), tolerâncias (±0,005 mm em fechamento, ±0,02 mm em peças), tonelagem (80t–350t), Moldflow, resinas (ABS, PA66, PC, POM, PP), ISO 9001:2015, CMM, PPAP.
- **GEO:** `llms.txt` + `llms-full.txt` (dossiê com entity facts, serviços, calculadoras, guias, categorias).
- **robots.txt:** permite GPTBot, ChatGPT-User, OAI-SearchBot, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, Applebot-Extended + tradicionais.
- **Diferenciais de conversão:** formulário RFQ na 1ª dobra (upload 2D/3D + NDA), ISO 9001, tabela comparativa de aços, FAQ schema, 2 calculadoras de engenharia.
- **LinkedIn:** `linkedin.com/company/145304607` (empresa).

---

## 6. Skills Encontradas (workspace `.agent`)

Mesmas skills genéricas da agência em `c:\Users\Reinaldo\Desktop\SOSSEO_sites\.agent\skills\`:
`redator_geo_seo`, `geo-fundamentals`, `seo-fundamentals`, `manual_escaneabilidade_copywriting`, `linkedin_artigos_newsletter`, `linkedin_prospeccao_b2b`, `GMB_SRE_SEO.md`, `blog_fgcar_automotivo` (específica do FG Car — **não se aplica** ao PMI).

> O PMI não possui skill própria. Aplicáveis: `redator_geo_seo` (artigos técnicos) e `linkedin_prospeccao_b2b` (prospecção industrial B2B — muito alinhada ao público do portal). A regra de `.agent/rules/metadados_artigos.md` (Conclusão Estratégica) aplica-se aos artigos.

---

## 7. Observações e Pontos de Atenção

### ✅ O que está correto
- Schema de hub (`Organization`/`WebSite`/`FAQPage`) — adequado ao modelo Rank & Rent.
- `_redirects` anti-duplicação `/artigos/:slug` → `/:slug` — **resolve no código** o problema de duplicação que o FG Car tinha (e o FG Car não tem essa regra).
- Configuração de destino de telefone dinâmica (`pmi_dest_phone`) — ótimo para repasse a inquilino.
- Documentação de negócio completa (dossiê, objetivos/regras, atendimento).

### ⚠️ Pontos de atenção a verificar
1. **`_redirects` `/artigos/:slug` → `/:slug`** — verificado ao vivo (26/10/2026): a URL `/artigos/quanto-custa-fabricar-um-molde-de-injecao-plastica` **funciona e serve o artigo** (nem redireciona 404, nem quebra). O Cloudflare está servindo a rota corretamente, então **não é problema ativo**. Ainda assim, o `.assetsignore` exclui `_redirects` do Worker Assets — se um dia o comportamento mudar (ex: servir página duplicada), revisar a regra.
2. **og:image em `.webp`** na home/contato (usam `Logos/logo-pmi-fundo-branco.webp`) e nas demais páginas (`imagens/*.webp`). WebP é **menos recomendado para compartilhamento no WhatsApp/depurador do Facebook** — o padrão dos outros projetos agora é JPG. A logo em .webp pode funcionar, mas se o compartilhamento falhar, converter para JPG.
3. **Senha do painel herdada** (`fgcar2026`) — usar senha própria (`pmi_admin_pass`).
4. **WhatsApp padrão genérico** (`5511999999999`) — é um placeholder; só será real quando um cliente fechar e você configurar (`pmi_dest_phone`).
5. **E-mail de leads** ainda `riveso@gmail.com` (da agência) — quando locar o imóvel, decidir se o destino passa a ser do cliente.
6. **`.md` dos artigos na raiz** (8) — são fontes de edição; não há duplicação de `.html` (o `_redirects` cuida do caminho antigo).

---

## 8. Fluxos de Trabalho

### Nova cotação/lead
Visitante (RFQ ou WhatsApp) → `lead-tracker.js` grava local + `POST /api/triagem` (Worker → KV + e-mail `riveso@gmail.com`) + webhook Google Sheets → painel `painel-leads.html`.

### Locar o imóvel para uma fábrica/ferramentaria
1. Configurar `pmi_dest_phone` (WhatsApp do cliente) no painel;
2. (Opcional) ajustar e-mail de destino no `wrangler.json`/`worker.js`;
3. Personalizar dados comerciais (contato, NDA, e-mail de engenharia) nas páginas;
4. Publicar e manter o portal gerando RFQs — o cliente recebe os leads.