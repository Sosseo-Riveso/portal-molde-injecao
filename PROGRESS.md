# PROGRESS.md — Portal Molde Injeção (PMI)

> Registro cronológico de marcos, decisões editoriais e pendências.
> Atualizado em: **02/11/2026**
> Documentos de referência: `.clinerules` (regras), `PROJECT_CONTEXT.md` (negócio/ICP).

---

## 0. Auditoria geral de SEO, GEO e Schema.org — 06/11/2026

Auditoria de diagnóstico (sem alteração de páginas publicadas). Scripts executados:

```powershell
py scripts/seo_checker.py .   # 23 páginas | 2 erros | 54 avisos | score 90% | exit 1
py scripts/geo_checker.py .   # 23 páginas | 2 críticos | 124 avisos | score 69% | exit 1
```

Auditor auxiliar (temporário, não versionado) validou JSON-LD com `json.loads`, campos obrigatórios por tipo,
URLs absolutas, breadcrumb, FAQ visível × schema, ativos referenciados e sitemap × disco.

### Resultado

| Pilar | Situação | Bloqueante de indexação |
|---|---|---|
| JSON-LD / Schema.org | 0 erro de parsing, 0 URL relativa, 0 campo vazio; 2 páginas legais sem JSON-LD (**sanado no Lote 1**) | Não |
| Canonical / robots / sitemap | 23/23 canônicos corretos em rota limpa; sitemap = disco; nenhum `noindex` em página pública | Não |
| H1 / headings | 1 H1 por página em 23/23 | Não |
| BreadcrumbList | ausente em 9 páginas (4 pilares + index + contato + sobre + 2 legais) | Não |
| GEO local (address/geo/areaServed) | apenas `areaServed: "BR"`; sem coordenadas; NAP incompleto | Não (gap de citação local) |
| Títulos / descriptions | 21/23 títulos fora de 50–60; 20/23 descriptions fora de 130–155 | Não |

### Correções aplicadas em `.assetsignore`

| Data | Arquivo | Motivo | Escopo |
|---|---|---|---|
| 06/11/2026 | `.assetsignore` | `assets.directory: "."` publicava `*.md` (8 artigos duplicados + dossiê interno), `*.docx` e `GOOGLE-APPS-SCRIPT-CRM.js` no CDN | Adição de `*.md`, `*.docx` e 4 arquivos nomeados. Nenhuma página HTML alterada. |
| 06/11/2026 | `.assetsignore` + `.gitignore` | Deploy do Lote 1 revelou `/.wrangler/cache/wrangler-account.json` público (HTTP 200) — expunha **account id** e nome da conta Cloudflare — além do sourcemap do Worker em `/.wrangler/tmp/` | Adição de `.wrangler` ao `.assetsignore` e de `.wrangler/` ao `.gitignore`. Zero impacto em conteúdo. |

Pendências P0/P1/P2 e arquivos a intervir: ver relatório de auditoria entregue em 06/11/2026 (seção 3 deste documento, atualizada).

### Lote 1 — P0 concluído (06/11/2026): páginas legais

| Arquivo | Intervenção | SEO antes → depois | GEO antes → depois |
|---|---|---|---|
| `politica-de-privacidade.html` | OG completo (`og:type`, `locale`, `site_name`, `title`, `description`, `url`, `image` + dims, Twitter Card); JSON-LD `WebPage` (`name`, `description`, `inLanguage`, `url`, `dateModified`, `isPartOf` → `#website`, `publisher`/`about` → `#organization`) + `BreadcrumbList`; `<title>` 77 → 57 chars; description 164 → 158 (removeu "total") para atingir a faixa ≤160 | 76% → **96%** | 35% → **50%** |
| `termos-de-uso.html` | OG completo (idem, com `og:title`/`og:description` = `<title>`/description); JSON-LD `WebPage` + `BreadcrumbList`; `<meta robots>` já existia | 84% → **96%** | 29% → **44%** |

Reauditoria completa após o lote:

| Auditor | Antes | Depois |
|---|---|---|
| SEO técnico | 2 erros / 54 avisos / 90% | **0 erros** / 52 avisos / **91%** |
| GEO/AEO | 2 críticos / 124 avisos / 69% | **0 críticos** / score reauditado |

### Lote 2 — Infra + metadados P1 (06/11/2026)

**a) Infraestrutura (`wrangler.json`)** — adicionado `"binding": "ASSETS"` no bloco `assets`. Causa raiz do HTTP 500 (Cloudflare 1101) em qualquer rota inexistente: o Worker rodava para caminhos sem asset e chamava `env.ASSETS.fetch` com binding não declarado. O fallback de clean URL do `worker.js` volta a funcionar.

**b) Entidade canônica (`index.html`)** — `Organization` com `@id` `#organization`, `name`, `url`, `logo`, `description`, `sameAs`, e `contactPoint` completo (`contactType: "customer service"`, `telephone: "+55-11-99999-9999"`, `email`, `url`, `availableLanguage: ["Portuguese"]`, `areaServed` estruturado com Brasil/São Paulo/Campinas/Região Sul) + `areaServed` no nível da organização.

**c) Referência única de entidade** — os 4 pilares deixaram de redeclarar a Organization em `provider` e agora usam `{"@type": "Organization", "@id": ".../#organization"}`. `contato.html` e `sobre.html` já referenciavam o mesmo `@id` (mantidos).

**d) Metadados P1** (título 50–60 / description 130–155 / OG espelhado / robots):

| Página | `<title>` | chars | description | chars |
|---|---|---:|---|---:|
| `index.html` | Moldes de Injeção Plástica B2B \| Portal Molde Injeção | 53 | Hub B2B de fabricação de moldes... ISO 9001. | 149 |
| `fabricacao-de-moldes-de-injecao.html` | Fabricação de Moldes de Injeção Plástica \| Portal Molde | 55 | Usinagem CNC 5 eixos e eletroerosão... try-out. | 145 |
| `servicos-de-injecao-plastica.html` | Serviços de Injeção Plástica Seriada \| Portal Molde | 51 | Injeção termoplástica técnica terceirizada... Just-in-Time. | 143 |
| `engenharia-e-desenvolvimento-de-moldes.html` | Engenharia e Projeto de Moldes de Injeção \| Portal Molde | 56 | Projeto CAD 3D, análise DFM... empenamento. | 133 |
| `manutencao-e-modificacao-de-moldes.html` | Manutenção e Modificação de Moldes \| Portal Molde Injeção | 57 | Recuperação de moldes por solda a laser... em dias. | 139 |
| `contato.html` | Contato e Cotação de Moldes RFQ \| Portal Molde Injeção | 54 | Envie o arquivo 3D (STEP/IGES)... até 48h. | 141 |
| `sobre.html` | Sobre o Portal Molde Injeção \| Ferramentaria CNC B2B | 52 | Central de engenharia, ferramentaria CNC... Região Sul. | 133 |

Também: `og:title`/`og:description` idênticos a `<title>`/description em 7/7; `og:type` corrigido de `article` para `website` nos pilares; `og:image` adicionado em `fabricacao` e `servicos`; `og:image` de `contato` trocado do logo para `imagens/og-portal-molde-injecao.jpg` (1024×631); `meta robots` adicionado onde faltava (index + 4 pilares); `name` adicionado ao `Service` de `servicos-de-injecao-plastica`.

**e) BreadcrumbList 2 níveis** — inserido em 4 pilares, `contato.html` e `sobre.html`.

**f) Correção de defeito introduzido no Lote 1 (crítico)** — ao inserir o JSON-LD antes de `</head>`, o `</script>` do bloco Tailwind (Lote 1) e o último `</script>` de cada página (Lote 2) foram consumidos pelo replace. Resultado: o `<script type="application/ld+json">` ficava **aninhado dentro do script anterior**, ou seja, o JSON-LD não era lido como dado estruturado pelo parser HTML (os auditores, que usam regex, não detectavam). Corrigido nos 8 arquivos e revalidado com parser HTML real (`html.parser`): todos os blocos agora são scripts de topo e parseiam em JSON.

**Reauditoria após o lote**

| Auditor | Baseline (06/11) | Lote 2 |
|---|---|---|
| SEO técnico | 0 erros / 54 avisos / 90% (após Lote 1: 52 avisos / 91%) | **0 erros / 39 avisos / 93%** |
| GEO/AEO | 2 críticos / 124 avisos / 69% | **0 críticos / 122 avisos / 70%** |

Todas as 7 páginas do lote em **96% de SEO**. O único aviso restante em cada uma é `JSON-LD sem tipo Article/TechArticle` (limitação do auditor: pilares usam `Service`, home usa `Organization`+`WebSite`).

### Lote 3 — GEO/AEO nos 4 hubs + calibragem final (06/11/2026)

**a) Hubs de categoria (4)** — cada um recebeu:

| Item | Implementação |
|---|---|
| Metadados | `<title>` 50–53 chars com `\| Portal Molde`; description 137–141; `og:title`/`og:description` espelhados; `og:image` adicionado (inexistia); `robots` já presente |
| Autoria | Barra `Por Equipe Técnica Portal Molde Injeção • Engenharia B2B` com `rel="author"`, `Publicado em 20/05/2026` e `Atualizado em 06/11/2026` em `<time datetime>` |
| Tabela | Comparativo técnico distinto por tema: impacto de decisões de projeto no custo (projeto); aços P20/1.2738/H13/Inox 420 com dureza e vida útil (ferramentaria); câmara quente × canal frio com payback (processos); plano preventivo por intervalo de ciclos (manutenção). Todas com `thead`/`th scope="col"` e wrapper `overflow-x-auto` |
| FAQ | 4 perguntas visíveis (H3 + resposta direta de 50–70 palavras) mapeadas 1:1 no schema `FAQPage` |
| Schema | `CollectionPage` + `inLanguage` + `datePublished`/`dateModified` + `publisher` por `@id`; `BreadcrumbList` em 3 níveis (Início > Categorias > Hub) com `#categorias` no index como âncora real; `FAQPage` com 4 Q&A idênticas ao texto visível |
| Conclusão Estratégica | Bloco de takeaway com dado de custo em todos os 4 hubs |

**b) `areaServed` estruturado nos 4 pilares** — string `"BR"` substituída por `Country: Brasil`, `State: São Paulo`, `City: Campinas`, `AdministrativeArea: Região Sul do Brasil`, idêntico ao index.

**c) 8 artigos** — 8 títulos encurtados para 53–60 chars (antes 62–77) e 3 descriptions acima de 160 reduzidas (161→152, 161→153, 165→136), sempre espelhando `og:title`/`og:description`. Corpo editorial intocado.

**d) `sitemap.xml`** — `lastmod` atualizado para 2026-11-06 nas 21 URLs alteradas; as 2 calculadoras (não alteradas) mantêm 2026-10-16.

**Reauditoria**

| Auditor | Antes do lote | Depois |
|---|---|---|
| SEO técnico | 0 erros / 39 avisos / 93% | **0 erros / 17 avisos / 97%** |
| GEO/AEO | 0 críticos / 122 avisos / 70% | **0 críticos / 82 avisos / 80%** |

Hubs de categoria: **39% → 94%** (1.168–1.200 palavras, 16–26 entidades). Oito artigos em 100% de SEO; nenhuma página abaixo de 92%.

Validação estrutural adicional com `html.parser` (não regex) nas 23 páginas: 0 blocos JSON-LD inválidos, 0 `</script>` desbalanceado, tipos declarados = tipos parseados.

**Gap declarado para a meta de 85–90% de GEO**: a média fechou em 80%. Os bloqueios restantes não estavam no escopo deste lote:

| Página | GEO | Falta para ~94% |
|---|---:|---|
| 4 pilares | 72% | autoria datada, FAQ visível + `FAQPage`, takeaway (mesmo tratamento dos hubs) |
| `index.html` | 67% | autoria, `datePublished`, FAQ 3→4+ e tabela comparativa |
| `sobre.html` | 56% | FAQ + tabela + takeaway + data |
| `contato.html` | 44% | FAQ + tabela + takeaway + data |
| `politica-de-privacidade` / `termos-de-uso` | 50% / 44% | FAQ curta + `datePublished` + padrões de resposta direta |
| 2 calculadoras | 78% | `dateModified`, autoria e takeaway |

### Lote 4 — Fechamento da meta de GEO/AEO (06/11/2026)

**a) 4 pilares de serviço (72% → 94%)** — o diagnóstico mostrou que tabela comparativa, FAQ visível (4–5 perguntas), `FAQPage` e takeaway **já existiam**; faltavam apenas autoria e datas. Aplicado:
- Barra `Por Equipe Técnica Portal Molde Injeção • Engenharia B2B` com `rel="author"` + `Publicado em` e `Atualizado em` em `<time datetime>` sob o H1.
- Nó `WebPage` em JSON-LD com `inLanguage`, `datePublished`, `dateModified`, `author`/`publisher` por `@id`, `isPartOf` → `#website`.
- Uma frase com padrão de resposta direta ("consiste em") no bloco Takeaway existente — sem duplicar tabela nem FAQ.

**b) `index.html` (67% → 94%)** — barra de autoria editorial com data de revisão sob o H1; nó `WebPage` (`#webpage`) no `@graph` com datas e `author` por `@id`; 4ª pergunta adicionada ao `FAQPage` (antes 3 no schema × 4 visíveis — agora sincronizados); novo bloco "Conclusão Estratégica" com padrão de resposta direta. Tabelas SPI/VDI existentes foram mantidas.

**c) `sobre.html` (56% → 94%) e `contato.html` (44% → 94%)** — barra de autoria com datas; `FAQPage` novo com 4 perguntas visíveis (RFQ, NDA, logística, homologação) mapeadas 1:1; takeaway em cada página. Em `contato` foi somada tabela "Prazo de Resposta por Tipo de Demanda" (5 linhas, `thead` + `scope="col"`), que também elevou o volume de 735 para 1.189 palavras.

**d) Calculadoras (78% → 94%)** — arquivos reais do repositório são `calculadora-tonelagem-injetora.html` e `calculadora-custo-peca-injetada.html` (não "forca-de-fechamento"/"custo-hora"). Tabela normativa (VDI 3400 e pressão específica por família polimérica) e FAQ técnica com 4 perguntas **já existiam**; foram adicionadas barra de autoria com datas e, na calculadora de tonelagem, o padrão de resposta direta do método de cálculo.

**e) `sitemap.xml`** — as 23 URLs ficaram com `lastmod` 2026-11-06 (as 2 calculadoras eram as únicas em 2026-10-16).

**f) Incidente evitado** — o mesmo padrão de replace que consome o `</script>` anterior voltou a ocorrer ao inserir o nó `WebPage` nos 4 pilares. Detectado imediatamente pela queda de 94% para 89% com `[X]` (falha crítica de parse) e corrigido nos 4 arquivos antes do commit. Validação final com `html.parser`: 23/23 páginas com `<script>` balanceados, 0 bloats JSON inválidos.

**Reauditoria**

| Auditor | Lote 3 | Lote 4 |
|---|---|---|
| SEO técnico | 0 erros / 17 avisos / 97% | **0 erros / 17 avisos / 97%** |
| GEO/AEO | 0 críticos / 39 avisos / 80% | **0 críticos / 39 avisos / 90%** |

**Placar GEO:** 20 páginas em 94%, 1 em 100% (`diferenca-entre-aco-...`), `politica-de-privacidade` 50% e `termos-de-uso` 44%. Média global **90%** — meta atingida.

### Refinamento on-page da Home (06/11/2026)

Intervenção restrita a `index.html`, sem tocar em schema, metas ou CLS.

| Item | Implementação |
|---|---|
| Reforço transacional (RFQ + CAD) | Parágrafo sob os CTAs do hero: "Cotação técnica e análise DFM ágil via arquivos CAD 3D (formatos STEP, IGES ou Parasolid) com resposta em até 48 horas úteis e garantia de confidencialidade técnica (NDA)." + pedido do modelo 3D, resina e volume anual |
| Geo-localização industrial | Bloco "Cobertura Técnica Regional" dentro da seção *Parque Fabril Homologado*: Região Metropolitana de Campinas, Grande ABC, Sorocaba, Vale do Paraíba e Polo Industrial de Joinville / Região Sul |
| Destaque das calculadoras | A faixa de botões foi convertida em **grid de 2 cards** (`id="calculadoras"`), cada um com H3, descrição técnica e link limpo: `/calculadora-tonelagem-injetora` (pressão por resina + área projetada) e `/calculadora-custo-peca-injetada` (ciclo, matéria-prima, custo-hora e amortização) |

Reauditoria: `index.html` **SEO 96%** (0 erros) e **GEO 94%** (0 críticas), subindo de 2.908 para 3.047 palavras visíveis. Placar global preservado: SEO **97%**, GEO **90%**. Estrutura validada: 7 `<script>` abertos/fechados, 1 `<h1>`, 1 bloco `ld+json`, 23 `<h3>`.

### Retarget comercial + esteira de 10 artigos (06/11/2026)

**a) Retarget do pilar `servicos-de-injecao-plastica.html`** (rota e canonical preservados):

| Campo | Antes | Depois |
|---|---|---|
| `<title>` + `og:title` | Serviços de Injeção Plástica Seriada (51) | **Terceirização de Injeção Plástica Seriada \| Portal Molde** (56) |
| `<h1>` | Serviços de Injeção Plástica Industrial: Terceirização e Produção Seriada Técnica | **Terceirização de Injeção Plástica Seriada e Produção Técnica** |
| description + `og:description` | 143 | **135** (com "Terceirização" à frente) |
| `Service.name` | Serviços de Injeção Plástica Técnica Seriada | Terceirização de Injeção Plástica Seriada |
| `WebPage.name` + breadcrumb (schema e visível) | Serviços de Injeção Plástica Seriada | Terceirização de Injeção Plástica |

**b) Isolamento dos rascunhos** — `rascunhos` adicionado ao `.assetsignore` (nada é servido no CDN) e já constava em `DIRS_IGNORADOS` dos dois auditores, então não entra nas médias de produção.

**c) Esteira de 10 artigos em `/rascunhos/`** — todos com `datePublished`/`dateModified` na data programada, `TechArticle` + `FAQPage` (4 Q) + `BreadcrumbList`, tabela com `thead`/`scope="col"`, 8 metadados, takeaway e 3 links internos (pilar + hub + calculadora).

| # | Publicação | Arquivo | Hub | Palavras |
|--:|---|---|---|---:|
| 1 | 09/11 (seg) | `lote-minimo-de-injecao-plastica.html` | processos-e-custos | 1.375 |
| 2 | 11/11 (qua) | `injecao-plastica-sob-demanda.html` | processos-e-custos | 1.298 |
| 3 | 16/11 (seg) | `sobreinjecao-de-inserto-metalico.html` | projeto-e-engenharia | 1.210 |
| 4 | 18/11 (qua) | `nacionalizacao-de-molde-importado.html` | ferramentaria-e-acos | 1.240 |
| 5 | 23/11 (seg) | `contrato-de-fornecimento-de-pecas-injetadas.html` | processos-e-custos | 1.190 |
| 6 | 25/11 (qua) | `molde-de-injecao-usado-riscos-e-checklist.html` | ferramentaria-e-acos | 1.276 |
| 7 | 30/11 (seg) | `molde-com-gaveta-slide-e-contra-saida.html` | ferramentaria-e-acos | 1.259 |
| 8 | 02/12 (qua) | `refrigeracao-conformal-em-moldes.html` | projeto-e-engenharia | 1.254 |
| 9 | 07/12 (seg) | `custo-hora-maquina-injetora.html` | processos-e-custos | 1.283 |
| 10 | 09/12 (qua) | `molde-bicomponente-duas-cores-2k.html` | projeto-e-engenharia | 1.237 |

Pré-check próprio dos 10: 0 pendências (JSON-LD válido, title 50-60, description 130-155, OG espelhado, 1 H1, ≥4 H2, tabela com `scope`, ≥900 palavras, padrão de resposta direta).

**d) Restrições respeitadas** — nenhuma menção a IATF 16949, PPAP, APQP, FMEA ou MSA em todo o site (verificado: 0 ocorrências). Qualidade tratada como gestão ISO 9001:2015, CEP, CMM e rastreabilidade dimensional. Nenhuma promessa de planta fabril própria: sempre "parques homologados".

### Links externos de autoridade (06/11/2026)

14 outbound links aplicados em 6 artigos publicados e 8 rascunhos — 1 por página, apenas em menção direta a norma/entidade, sempre com `target="_blank" rel="noopener noreferrer external"` e `title` da fonte.

| Página | Âncora | Fonte |
|---|---|---|
| `quanto-custa-fabricar-um-molde...` | SPI A-1/A-2 | Plastics Industry Association (SPI) |
| `diferenca-entre-aco-p20-2738...` | SPI (Society of the Plastics Industry) | Plastics Industry Association (SPI) |
| `guia-de-resinas-termoplasticas...` | resinas termoplásticas | ABIPLAST |
| `como-calcular-forca-de-fechamento...` | índice de fluidez (MFI) | ISO 1133 |
| `simulacao-moldflow-e-analise-reologica...` | simulação Moldflow | Autodesk Moldflow |
| `manutencao-preventiva-e-corretiva...` | inspeção dimensional CMM | IPT |
| `molde-de-injecao-usado...` (rascunho) | durômetro portátil | IPT |
| `nacionalizacao-de-molde-importado` (rascunho) | NPT ou BSP | ISO 228-1 |
| `refrigeracao-conformal-em-moldes` (rascunho) | manufatura aditiva metálica (DMLS) | ASTM (ISO/ASTM 52900) |
| `contrato-de-fornecimento...` (rascunho) | ISO 9001:2015 | ABNT Catálogo |
| `custo-hora-maquina-injetora` (rascunho) | tarifa industrial | ANEEL |
| `lote-minimo-de-injecao-plastica` (rascunho) | classe SPI 104 | Plastics Industry Association (SPI) |
| `sobreinjecao-de-inserto-metalico` (rascunho) | ISO 286 IT7 | ISO 286-1 |
| `molde-bicomponente-duas-cores-2k` (rascunho) | TPE modificado | ABIPLAST |

Sem link externo por decisão editorial: `molde-camara-quente-vs-canal-frio`, `principais-defeitos-na-injecao-plastica`, `injecao-plastica-sob-demanda`, `molde-com-gaveta-slide-e-contra-saida` (não mencionam norma no corpo). Home, pilares, hubs, contato, sobre, calculadoras e legais permaneceram sem outbound no conteúdo.

Validação: 14/14 no `<body>`, atributos completos, 0 `<a>` aninhado, 0 âncora vazia. SEO **97%** (0 erros) e GEO **91%** (0 críticas) preservados.

**Correção aplicada (06/11/2026):** `index.html` linha 1801 tinha `<a>` do botão flutuante do WhatsApp sem `</a>`, o que mantinha todo o restante da home aninhado dentro do link. Tag fechada após o `<svg>`; balanço da página conferido: `<a>` 71/71, `<div>` 276/276, `<script>` 7/7, `<svg>` 30/30, 1 `<h1>` e 1 bloco JSON-LD. SEO 97% e GEO 91% preservados.

### GA4 nativo — reversão do GTM (06/11/2026)

O contêiner GTM foi removido e a medição passou a ser 100% direta via `gtag.js`, reduzindo o overhead de uma biblioteca de 533 KB.

| Item | Antes | Depois |
|---|---|---|
| GTM `GTM-W78SNGQ6` | script no `<head>` + `noscript` no `<body>` em 33 páginas (66 blocos) | **0** — todos removidos |
| GA4 `G-bc0f1329` | 14 páginas com tag direta | **33 páginas**, exatamente 1 bloco cada |
| `<noscript>` de GTM | 33 | 0 |
| Overhead de medição | GTM (~533 KB) + gtag.js | apenas gtag.js assíncrono |

Snippet aplicado (idêntico ao que já existia, com `async` e `gtag('config')`):

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-bc0f1329"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-bc0f1329');
</script>
```

Validação: 33/33 com GA4 único e dentro do `<head>`; 0 ocorrências de `GTM-`; 0 `<noscript>`; 1 `<head>`/`</head>`/`<body>` por página; `<script>`/`<div>`/`<a>` balanceados em todos os arquivos; SEO **97%** e GEO **91%** inalterados. `painel-leads.html` e o template seguem sem tag de medição por decisão de projeto.

#### Atualização do ID de medição (06/11/2026)

Substituído o ID antigo `G-bc0f1329` pelo novo `G-76GCJPMSHS` nas 33 páginas — 66 substituições (URL do `gtag.js` + chamada `gtag('config')` em cada arquivo). O bloco permaneceu idêntico em estrutura, apenas com o novo identificador.

| Verificação | Resultado |
|---|---|
| `G-bc0f1329` restante | **0** |
| `G-76GCJPMSHS` presente | **33/33** páginas, 1 script + 1 config cada |
| GTM / `noscript` | **0** |
| `gtag.js` com `async` no `<head>` | 33/33 |
| Desequilíbrio de tags | 0 |
| SEO / GEO | 97% / 91% (inalterados) |

`PROJECT_CONTEXT.md` atualizado na tabela de infraestrutura.



### Google Tag Manager (06/11/2026) — **revertido na mesma data**

Instalado o contêiner **GTM-W78SNGQ6** nas 33 páginas HTML (23 públicas + 10 rascunhos), com o bootstrap canônico no `<head>` (evento `gtm.start` + carregamento assíncrono) e o `noscript` imediatamente após `<body>`.

| Item | Situação |
|---|---|
| GTM nas 33 páginas | ✅ 2 ocorrências por arquivo (script no head + iframe noscript), posicionamento validado |
| GA4 `G-bc0f1329` (tag direta) | preservada nos 14 arquivos que já a tinham; páginas que não tinham continuam sem gtag direto |
| `painel-leads.html` e `template-post-padrao.html` | fora do escopo (painel interno `noindex` não deve poluir dados; template não é publicado) |
| Auditoria | SEO 97% / GEO 91%, 0 erros, 0 desequilíbrio de `<script>`/`<div>`/`<a>` |

**Ajuste de implementação:** o trecho fornecido misturava as duas APIs (carregava `gtm.js?id=GTM-…` e inicializava `gtag()` sem `gtag('config')`, sem o evento `gtm.start`). Foi aplicado o snippet oficial do GTM apontando para o mesmo contêiner.

**Pendência de medição:** se o contêiner `GTM-W78SNGQ6` também dispara GA4 para a propriedade `G-bc0f1329`, as 14 páginas com tag direta passam a contar page_view em duplicidade. Decisão pendente: (a) remover o gtag direto dessas 14 páginas, deixando tudo pelo GTM; ou (b) não configurar GA4 no contêiner e manter as duas medições separadas.



### Auditoria de assets — duplicatas (06/11/2026)

Auditoria por MD5 + dHash 64 bits sobre os 39 arquivos de `/imagens` (4,69 MB) e as 166 referências de asset nos 33 HTMLs.

| Achado | Situação | Correção |
|---|---|---|
| `orcamento-tecnico-rfq-...webp` havia sido sobrescrita na otimização de 06/11 com a foto do parque (dHash idêntico ao `parque-maquinas-...webp`), perdendo a arte original de composição de custos | Regressão em produção: `og:image` de `quanto-custa` e `calculadora-custo-peca`, card do hub `categoria-processos` e corpo do rascunho `lote-minimo` (que repetia a capa) | Restaurada de `ac25210^` e reencodada a 1200x675 q88: **147,4 KB → 107,5 KB**, dHash `0x2d3d…` (conteúdo original) e 30 bits de distância do `parque` |
| `Injeção-Plástica-Diretor-Comercial-...jpg` com MD5 idêntico ao `og-portal-molde-injecao.jpg` | duplicata byte a byte, órfã | arquivo removido; `og-portal` mantido (usado em index, contato, política e termos) |
| `Diretor-Comercial-Analise-Buscas-...jpg` e `ajuste-bancada-...ferramentaria.jpg` | órfãos (0 referências) | removidos |

Total liberado: **836 KB** de arquivos sem uso. `/imagens` agora tem apenas `og-portal-molde-injecao.jpg` como JPG.

Validação pós-correção: 166 referências de asset conferidas, **0 quebradas**; 33 arquivos sem desequilíbrio de `<a>`/`<div>`/`<script>`; SEO **97%** e GEO **91%** preservados.



### Integração do LinkedIn oficial (06/11/2026)

Substituição da Company Page provisória pela URL oficial `https://www.linkedin.com/company/portal-molde-inje%C3%A7%C3%A3o/` em todo o ecossistema.

| Item | Antes | Depois |
|---|---|---|
| Rodapé (link) | `company/145304607/` em 33 arquivos (23 públicas + 10 rascunhos), sem `aria-label` | URL oficial + `aria-label="Siga o Portal Molde de Injeção no LinkedIn"`, mantendo `target="_blank"` e `rel="noopener noreferrer"` |
| `sameAs` | 3 nós (index, contato, sobre) com a URL antiga | 3 nós atualizados + **10 nós `publisher`** (8 artigos e 2 calculadoras) passaram a declarar `sameAs` |
| `llms.txt` / `llms-full.txt` | URL antiga | URL oficial (consistência de entidade para LLMs) |

O nó `author` (que aponta para `/sobre` e representa a autoria editorial, não a empresa) foi mantido sem `sameAs` para não fundir duas entidades distintas.

Reauditoria: SEO **97%** (0 erros) e GEO **91%** (0 críticas, 37 avisos — antes 39). Todos os blocos JSON-LD revalidados por parse: 0 inválidos.

**e) Procedimento de liberação semanal — automatizado** por `scripts/liberar_post.py` (ferramenta local, fora do git e do CDN conforme `.clinerules`):

```powershell
py scripts/liberar_post.py lote-minimo-de-injecao-plastica --dry-run   # previa, nao grava
py scripts/liberar_post.py lote-minimo-de-injecao-plastica             # libera (lastmod = hoje)
```

O script faz, em uma passada:

1. valida rascunho, destino livre e data contra o calendário editorial (avisa se divergir da prevista);
2. executa o **flip dos caminhos relativos**: `../imagens/` → `/imagens/`, `../Logos/` → `Logos/`, `../js/` → `js/`;
3. move o `.html` para a raiz e remove de `/rascunhos/`;
4. insere a URL no `sitemap.xml` com `lastmod` = data real da liberação (nunca futura);
5. insere o card no hub, incrementa o contador "N Artigos Técnicos", acrescenta o item ao `ItemList` do `CollectionPage` e atualiza o `dateModified` do hub;
6. imprime os comandos de auditoria, commit e deploy.

Teste executado em cópias (06/11/2026), sem tocar nos arquivos reais: card inserido, `<article>` 2 → 3, `<div>` 78/78 balanceadas, `ItemList` 2 → 3 itens, `dateModified` atualizado, contador 2 → 3 e sitemap 23 → 24 URLs.

Depois do script: `py scripts/seo_checker.py .`, `py scripts/geo_checker.py .`, commit, push, `npx wrangler deploy` e `npx wrangler versions deploy <ID>@100% --yes`.

**f) Estado do sitemap** — intocado nesta etapa (nenhuma URL nova está pública). As 23 URLs seguem as atuais, todas com `lastmod` 2026-11-06.

**Reauditoria das 23 páginas públicas**

| Auditor | Antes | Depois |
|---|---|---|
| SEO técnico | 0 erros / 17 avisos / 97% | **0 erros / 17 avisos / 97%** |
| GEO/AEO | 0 críticos / 39 avisos / 90% | **0 críticos / 39 avisos / 90%** |









### O que foi entregue

| Entrega | Arquivo | Status |
|---|---|---|
| Regras de governança B2B industrial (tom, 8 metadados com Takeaway bloqueante, SEO, GEO/AEO, escaneabilidade, regra de ouro, deploy) | `.clinerules` | ✅ criado |
| Contexto de negócio, ICP e restrições | `PROJECT_CONTEXT.md` | ✅ criado |
| Template padrão de artigo (8 metadados, JSON-LD, tabela comparativa, FAQ, CTA de cotação) | `template-post-padrao.html` | ✅ criado |
| Auditor de SEO técnico em pt-BR | `scripts/seo_checker.py` | ✅ criado |
| Auditor GEO/AEO em pt-BR com entidades e estatísticas industriais | `scripts/geo_checker.py` | ✅ criado |
| Proteção de deploy (git/CDN/contexto) | `.gitignore`, `.assetsignore`, `.clineignore` | ✅ atualizados |

**Nenhuma página pública existente foi alterada.** O único arquivo de produção já modificado antes deste trabalho (`index.html`) permanece intocado. Todos os itens de diagnóstico abaixo são **backlog**, não correções aplicadas.

### Proteção de deploy confirmada

```text
$ git check-ignore -v scripts/seo_checker.py scripts/geo_checker.py teste.py teste.pyc
.gitignore:9:scripts/     scripts/seo_checker.py
.gitignore:9:scripts/     scripts/geo_checker.py
.gitignore:10:*.py        teste.py
.gitignore:11:*.pyc       teste.pyc
```

Critérios atendidos nos três arquivos:

| Regra | `.gitignore` | `.assetsignore` | `.clineignore` |
|---|---|---|---|
| `scripts/` | ✅ | ✅ | ✅ |
| `*.py` | ✅ | ✅ | ✅ |
| `*.pyc` | ✅ | ✅ | ✅ |
| `__pycache__/` | ✅ | ✅ | ✅ |

Itens extras bloqueados no CDN (`.assetsignore`): `.clinerules`, `.clineignore`, `PROJECT_CONTEXT.md`, `PROGRESS.md`, `template-post-padrao.html` — governança e template não ficam públicos.

---

## 2. Baseline de auditoria (executado em 02/11/2026)

Comandos:

```powershell
py scripts/seo_checker.py .
py scripts/geo_checker.py .
```

| Auditor | Páginas | Erros/falhas críticas | Avisos | Score médio | Saída |
|---|---:|---:|---:|---:|---|
| SEO técnico | 23 | 2 | 54 | 90% | `1` (pendências) |
| GEO/AEO | 23 | 2 | 124 | 69% | `1` (pendências) |

Rascunhos, template, `painel-leads.html` e `worker.js` foram ignorados automaticamente. Pixels de rastreio não geraram falso positivo de `alt`.

### 2.1 Placar por página

| Página | Tipo | SEO | GEO | Prioridade |
|---|---|---:|---:|---|
| `index.html` | institucional | 88% | 67% | P1 |
| `fabricacao-de-moldes-de-injecao.html` | pilar | 84% | 72% | P1 |
| `servicos-de-injecao-plastica.html` | pilar | 84% | 72% | P1 |
| `engenharia-e-desenvolvimento-de-moldes.html` | pilar | 88% | 72% | P1 |
| `manutencao-e-modificacao-de-moldes.html` | pilar | 88% | 72% | P1 |
| `categoria-projeto-e-engenharia-de-moldes.html` | hub | 88% | 39% | P2 |
| `categoria-ferramentaria-e-acos-para-moldes.html` | hub | 84% | 39% | P2 |
| `categoria-processos-e-custos-de-injecao-plastica.html` | hub | 84% | 39% | P2 |
| `categoria-manutencao-e-qualidade-de-matrizes.html` | hub | 84% | 39% | P2 |
| `calculadora-tonelagem-injetora.html` | ferramenta | 92% | 78% | P2 |
| `calculadora-custo-peca-injetada.html` | ferramenta | 92% | 78% | P2 |
| `quanto-custa-fabricar-um-molde-de-injecao-plastica.html` | artigo | 96% | 94% | P3 |
| `diferenca-entre-aco-p20-2738-h13-e-inox-420-para-moldes.html` | artigo | 96% | 100% | ✅ referência |
| `molde-camara-quente-vs-canal-frio-qual-escolher.html` | artigo | 96% | 94% | P3 |
| `como-calcular-forca-de-fechamento-e-tonelagem-da-injetora.html` | artigo | 96% | 94% | P3 |
| `simulacao-moldflow-e-analise-reologica-em-moldes-de-injecao.html` | artigo | 92% | 94% | P3 |
| `guia-de-resinas-termoplasticas-abs-pa66-policarbonato-pom-e-pp.html` | artigo | 92% | 94% | P3 |
| `principais-defeitos-na-injecao-plastica-rebarbas-chupagem-e-empenamento.html` | artigo | 96% | 94% | P3 |
| `manutencao-preventiva-e-corretiva-em-moldes-de-injecao.html` | artigo | 92% | 94% | P3 |
| `sobre.html` | institucional | 92% | 56% | P2 |
| `contato.html` | institucional | 96% | 44% | P2 |
| `politica-de-privacidade.html` | legal | 76% | 35% | P1 |
| `termos-de-uso.html` | legal | 84% | 29% | P1 |

### 2.2 Diagnóstico — SEO técnico

**Erros bloqueantes (2, ambos em páginas legais):**
- `politica-de-privacidade.html` e `termos-de-uso.html`: **sem JSON-LD** (`WebPage`/`Organization`/`BreadcrumbList`).

**Avisos (54):**

| Ocorrências | Achado | Ação recomendada (somente com autorização) |
|---:|---|---|
| 17 | `<title>` acima de 65 caracteres | Reescrever para ≤ 60 mantendo a palavra-chave à frente |
| 12 | Meta description acima de 160 caracteres | Encurtar para 120–160 com dado concreto |
| 13 | JSON-LD sem tipo `Article`/`TechArticle` | Aceitável em hub/ferramenta; explicitar `CollectionPage`/`WebApplication` |
| 6 | Open Graph sem `og:image` | Criar imagem 1200×630 `.webp` por hub de categoria |
| 2 | Open Graph incompleto (`og:title/description/image` ausentes) | Completar as tags OG |
| 4 | `<title>` entre 61 e 65 caracteres | Ajuste fino opcional |

**Sem apontamentos:** `alt` de imagens (100% preenchido nas 23 páginas), canonical em rota limpa, H1 único, robots indexável, viewport e `lang="pt-BR"`.

### 2.3 Diagnóstico — GEO/AEO

**Falhas críticas (2):** as mesmas páginas legais sem JSON-LD.

**Avisos estruturais por tipo de página:**

| Tipo | Páginas | Score médio | Lacuna principal |
|---|---:|---:|---|
| Artigo | 8 | 94% | Base forte; ampliar FAQ e padrões de resposta direta |
| Hub de categoria | 4 | 39% | Sem FAQ, sem tabela comparativa, sem `Organization` no schema, ~690 palavras |
| Pilar de serviço | 4 | 72% | Sem autoria/data e sem FAQ estruturado |
| Ferramenta | 2 | 78% | Sem data de publicação/atualização (schema de artigo não se aplica) |
| Institucional | 3 | 56–67% | Sem FAQ, autoria e Takeaway |
| Legal | 2 | 29–35% | Sem JSON-LD e sem dados quantificados |

Leitura estratégica: a base editorial está forte (artigos com 14 a 23 entidades industriais, 1.500–1.700 palavras e dados quantificados). A lacuna de GEO está na **camada de hub e institucional** — justamente as páginas que distribuem autoridade para os artigos e que hoje não oferecem blocos extraíveis (FAQ, tabela, definição).

---

## 3. Backlog priorizado (não executado — exige autorização)

### P0 — Bloqueante de entidade
1. Adicionar JSON-LD mínimo (`WebPage` + `Organization` + `BreadcrumbList`) em `politica-de-privacidade.html` e `termos-de-uso.html`. — ✅ **concluído no Lote 1 (06/11/2026)**

### P1 — Ganho rápido de SEO/GEO
2. Encurtar `<title>` das 17 páginas acima de 65 caracteres e as 12 meta descriptions longas.
3. Completar Open Graph (incluir `og:image`) nas 4 categorias e nas 2 páginas com OG ausente.
4. Adicionar autoria + `datePublished`/`dateModified` nos 4 pilares de serviço e no `index.html`.

### P2 — Camada de hub
5. Criar FAQ (4–6 perguntas) + `FAQPage` em cada um dos 4 hubs de categoria.
6. Inserir tabela comparativa (aço, resina ou classe SPI) nos hubs.
7. Adicionar `Organization`/`Person` ao schema dos hubs e do `sobre.html`.
8. Publicar `og:image` 1200×630 específica por categoria.

### P3 — Refinamento editorial (artigos)
9. Ampliar FAQ para 4–6 itens onde houver menos.
10. Inserir padrões de resposta direta ("consiste em", "é definido como") no início das seções.

> Toda alteração de página publicada exige pedido explícito, conforme seção 0 do `.clinerules`.

---

## 4. Próximos marcos planejados

| Marco | Descrição | Status |
|---|---|---|
| M1 | Governança + template + auditores | ✅ concluído (02/11/2026) |
| M2 | Correção P0/P1 (metadados e OG) com autorização | ⏳ aguardando aprovação |
| M3 | FAQ + tabelas nos 4 hubs de categoria | ⏳ aguardando aprovação |
| M4 | Primeiro artigo novo usando `template-post-padrao.html` | ⏳ aguardando pauta |
| M5 | Reauditar e registrar novo baseline | ⏳ após M2/M3 |

---

## 5. Histórico

| Data | Evento |
|---|---|
| 02/11/2026 | Criação do framework de governança (`.clinerules`), `PROJECT_CONTEXT.md`, `template-post-padrao.html`, `scripts/seo_checker.py` e `scripts/geo_checker.py`; atualização de `.gitignore`/`.assetsignore`; criação de `.clineignore`; baseline de auditoria das 23 páginas públicas (SEO 90% / GEO 69%). Nenhuma página publicada alterada. |

---

## 6. Inventário visual dos rascunhos — concluído (06/11/2026)

Auditoria de reuso de imagens nas 33 páginas (`<img src>` + `og:image`) concluída e aprovada. **Nenhum HTML foi alterado**: os caminhos `src` e `og:image` dos rascunhos continuam apontando para as imagens atuais, e os artigos publicados seguem intactos.

| Constatação | Número |
|---|---|
| Rascunhos aguardando lançamento | 10 |
| Imagens envolvidas (capa + corpo) | 20 |
| Imagens com arte própria | **0** |
| Imagens que também são capa/OG de artigo publicado | 7 |
| Imagem com maior reuso (`parque-maquinas-injetoras-80t-350t…`) | 5 páginas |
| Arquivo de briefing criado | `IMAGENS-A-CRIAR.md` (raiz, 20 tabelas + 20 briefings) |

**Status editorial:** os 10 rascunhos (09/11 a 09/12) ficam **bloqueados para lançamento** até a confecção das 20 novas artes. Especificação fixada no briefing: capa 1200×675 (≤120 KB) e corpo 800×800 (≤80 KB), WebP q80–85, alt semântico por imagem.

Fluxo aprovado para quando as artes existirem: salvar em `/imagens/` → trocar `src`, `og:image` e `alt` no rascunho → rodar `seo_checker`/`geo_checker` → registrar aqui → liberar pelo `scripts/liberar_post.py`.

> Nota de governança: `IMAGENS-A-CRIAR.md` é arquivo interno (`.assetsignore` cobre `*.md`), portanto não é publicado no CDN.

---

## 7. Artes dos rascunhos — entregues e integradas (07/11/2026)

As 20 artes chegaram no formato bruto (WebP 2752×1536 para capas e 2048×2048 para corpos, 60,67 MB no total) e foram otimizadas para a spec antes da integração.

| Item | Resultado |
|---|---|
| Otimização | 60,67 MB → **1,79 MB** (−97%), WebP q66–85 adaptativo, EXIF mínimo sem GPS |
| Capas | 10 arquivos em 1200×675, de 60,2 KB a 119,0 KB (todas ≤120 KB) |
| Corpos | 10 arquivos em 800×800, de 74,0 KB a 79,9 KB (todos ≤80 KB) |
| Destino | `imagens/` (pasta pública), reutilizando os nomes definidos na produção |
| `refrigeracao1-…` | renomeado para `refrigeracao-conformal-inserto-dmls-canais-detalhe.webp` (sufixo de versão) |
| Rascunhos atualizados | 10 — `src` (`../imagens/…`), `og:image` (URL absoluta) e `alt` em pt-BR |
| Referências quebradas | **0** |
| Artigos publicados / pilares / hubs / home | **intactos** |
| SEO / GEO | 97% / 91% (inalterados) |

Dez nomes finais diferem do briefing original (prevaleceu o nome de produção) e o mapeamento completo está em `IMAGENS-A-CRIAR.md`, seção “Status da produção”.

Os 20 arquivos-fonte em `rascunhos/*.webp` ficaram no `.gitignore` (60 MB de trabalho); apenas as versões otimizadas de `imagens/` são versionadas e publicadas.

---

## 8. Primeira liberação do calendário — post 1 (07/11/2026)

Post liberado com `py scripts/liberar_post.py lote-minimo-de-injecao-plastica`, **antecipado de 09/11 para 07/11** por decisão do responsável.

| Item | Resultado |
|---|---|
| Arquivo | `lote-minimo-de-injecao-plastica.html` na raiz (removido de `rascunhos/`) |
| Caminhos | 5 `src` convertidos de `../` para raiz; 0 resíduos |
| Sitemap | URL adicionada com `lastmod 2026-11-07` |
| Hub `categoria-processos-e-custos…` | card inserido, contador 2 → **3 Artigos Técnicos**, `ItemList` 2 → **3 itens**, `dateModified 2026-11-07` |
| Datas do artigo | `datePublished`/`dateModified` e texto visível ajustados de 09/11 para **07/11/2026** (coerência com sitemap e card do hub) |
| Auditoria | artigo em **100% SEO / 100% GEO**; global 97% / 91%, 0 erros e 0 falhas críticas |
| Analytics | GA4 `G-76GCJPMSHS` presente, GTM ausente |

Posts restantes seguem no calendário original (11/11 em diante).

---

## 9. Limpeza de assets sem uso (07/11/2026)

Auditoria de referências reais (resolvendo `src`, `og:image` e `<link href>`, com URL decodificada) antes de remover qualquer arquivo.

| Ação | Volume |
|---|---|
| `rascunhos/Imagens/` (duplicata byte a byte dos `.webp` brutos) | 20 arquivos · 60,67 MB — removido pelo responsável |
| `rascunhos/*.webp` e `rascunhos/*.jpg` (fontes em alta resolução) | 40 arquivos · 127,80 MB — **movidos para backup fora do repositório** (`..\_backup-imagens-pmi`) |
| `Logos/originais/` (2 JPG 2400×1792) + 7 variantes de logo sem uso | 9 arquivos · ~3,2 MB — removidos e versionados no commit `a176415` |

Mantidos: as 56 imagens de `/imagens/` (todas referenciadas), os 3 logos em uso (`logo-pmi-fundo-branco.webp`, `logo-pmi-fundo-preto.webp`, `manutencao-moldes-ferramentaria-propria.jpg`), `imagens/selo-iso-9001-anel.png`, `imagens/og-portal-molde-injecao.jpg` e `favicon.png` da raiz.

Validação: **200 referências de asset conferidas, 0 quebradas**; SEO 97% e GEO 91% inalterados; em produção os logos mantidos respondem 200 e os removidos 404 (CDN limpo).

> Nenhum HTML apontava para `rascunhos/`: as páginas consomem apenas os WebP otimizados de `/imagens/`.

---

## 10. Liberação do calendário — post 2 (11/11/2026)

Post liberado com `py scripts/liberar_post.py injecao-plastica-sob-demanda`, na data prevista do calendário editorial (11/11/2026).

| Item | Resultado |
|---|---|
| Arquivo | `injecao-plastica-sob-demanda.html` na raiz (removido de `rascunhos/`) |
| Palavra-chave | `injecao plastica sob demanda` |
| Caminhos | 5 `src` convertidos de `../` para raiz; 0 resíduo de `../` |
| Sitemap | URL adicionada com `lastmod 2026-11-11` (24 → **25 URLs**) |
| Hub `categoria-processos-e-custos…` | card inserido, contador 3 → **4 Artigos Técnicos**, `ItemList` 3 → **4 itens**, `dateModified 2026-11-11` |
| Estrutura | 1 H1, 6 H2, **1.298 palavras**, 1 tabela com 4 `th scope="col"`, FAQ de 4 perguntas + `FAQPage`, 18 links internos, 1 bloco JSON-LD |
| Metadados | `<title>` 52 chars = `og:title`; description 138 = `og:description`; excerpt, subtítulo-banner e Takeaway preenchidos |
| Balanço de tags | `<div>` 70/70, `<a>` 61/61, `<script>` 6/6, `<svg>` 4/4 |
| Assets | capa e imagem de corpo servidas de `/imagens/*.webp`; 0 referência quebrada |
| Auditoria | artigo em **100% SEO / 100% GEO** (1.298 palavras, 15 entidades); global **97% / 91%**, 0 erros e 0 críticos |

> Nota de governança: a cópia de trabalho do `PROGRESS.md` estava com as seções 8 e 9 removidas e um `CLOUDFLARE_API_TOKEN` colado ao final do arquivo. A versão do último commit foi restaurada antes deste registro — o token não chegou a ser versionado. Recomenda-se **revogar/rotacionar** esse token no painel da Cloudflare, pois ele ficou exposto em disco.

---

## 11. Busca interna instantânea — topbar e gaveta mobile (11/11/2026)

Campo de busca com lupa na topbar (desktop) e no topo da gaveta mobile, com índice client-side e resultados instantâneos.

### Arquitetura

| Item | Decisão |
|---|---|
| Índice | `js/indice_busca.json` — **19,0 KB**, 25 páginas (título, URL, categoria, tipo, resumo e tags) |
| Gerador | `scripts/gerar_indice_busca.py` (local, fora do git/CDN) — lê `sitemap.xml`, abre o HTML de cada URL e extrai H1, description, chip de categoria, H2 e keywords |
| Por que não `scripts/indice_busca.json` | `scripts/` está no `.gitignore` e no `.assetsignore` (seção 7 do `.clinerules`). Um JSON ali não seria versionado nem servido pelo CDN. O gerador fica em `scripts/`, o asset em `js/` |
| Cliente | `js/busca.js` + `js/busca.css`, sem biblioteca nova (fetch + DOM nativos) |
| Injeção | `scripts/injetar_busca.py`, idempotente, aplicado em **33 arquivos**: 25 páginas públicas + 8 rascunhos. `painel-leads.html` e `template-post-padrao.html` ficaram fora (não têm topbar) |

### Comportamento

- Busca a partir de **2 caracteres**, debounce de 90 ms, normalização NFD (ignora acento e caixa) e empate desfeito pelo título mais curto.
- Ranking: título (8), tags/H2 (4), resumo e categoria (2) + bônus de frase exata (10 no título, 3 no conjunto). Limite de **8 resultados**.
- Teclado: ↓/↑ percorrem, Enter abre o item ativo (ou o primeiro), Esc fecha; anel de foco visível no campo e nos itens.
- ARIA: `role="combobox"` com `aria-expanded`/`aria-controls`/`aria-autocomplete`, `role="listbox"`/`option`, `aria-label="Buscar no site"`, label `sr-only` e região `role="status"` anunciando a contagem.
- Índice carregado só no primeiro foco (`fetch` same-origin); falha de rede exibe mensagem no dropdown.

### Posicionamento

- **Desktop:** entre "ISO 9001:2015 | Tolerâncias Centesimais (±0,02 mm)" e a borda direita da topbar; fundo escuro translúcido, borda fina, cantos arredondados e placeholder "Buscar artigo ou termo técnico...".
- **Mobile:** primeiro elemento de `#pmiMobileMenu`, antes de "Início"; lupa à esquerda e campo em largura total com `font-size: 16px` (evita zoom automático no iOS).
- **Responsivo:** a mensagem institucional da topbar passou a `md:hidden xl:flex`, para a linha ISO + busca caber entre 768 e 1279 px sem quebrar a barra.

### Validação

| Teste | Resultado |
|---|---|
| Estrutura dos 33 arquivos | 2 componentes por página, 0 ID duplicado, 0 tag desbalanceada, 0 asset ausente |
| Sintaxe | `node --check js/busca.js` OK |
| Algoritmo real (Node sobre o índice publicado) | "aco h13" 4 · "camara quente" 5 · "tonelagem" 4 · "kanban" 3 · "injecao sob demanda" 3 · "inox 420" 3 · "xyzabc" 0 |
| Render headless (Chrome) | Topbar 1440 px OK; tablet 800 px OK; gaveta mobile com dropdown inline OK; `scrollWidth 485 < innerWidth 500` (sem overflow horizontal) |
| `py scripts/seo_checker.py .` | **0 erros**, 17 avisos, **97%**, exit 0 |
| `py scripts/geo_checker.py .` | **0 falhas críticas**, 37 avisos, **91%**, exit 0 |

`scripts/liberar_post.py` passou a regenerar o índice ao final de cada liberação, para o JSON não ficar desatualizado quando um post novo entra no ar.

> Escopo e governança: intervenção pedida explicitamente pelo responsável e restrita ao componente de busca (topbar, gaveta e duas tags no `<head>`). Nenhum texto editorial foi reescrito. A home (`index.html`), que estava em edição por terceiros, recebeu apenas essas inserções.

