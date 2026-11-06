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

Pendências: `politica-de-privacidade` (158) e `termos-de-uso` (157) ficaram na faixa ≤160 do projeto, acima dos 155 do novo padrão; títulos/descriptions dos 8 artigos e dos 4 hubs de categoria ainda fora da faixa; `areaServed` dos pilares ainda como string `"BR"`; `og:image` 1200×630 `.webp` pendente.





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
