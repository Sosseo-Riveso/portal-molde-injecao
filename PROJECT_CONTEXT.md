# PROJECT_CONTEXT.md — Portal Molde Injeção (PMI)

> Última atualização: 02/11/2026
> Site: https://portalmoldeinjecao.com.br/
> Repositório: `Sosseo-Riveso/portal-molde-injecao` (branch `main`)
> Leiame operacional: `.clinerules` · Registro de marcos: `PROGRESS.md`

---

## 1. O que é o projeto

Portal **B2B industrial** de alta intenção comercial que funciona como **ativo digital (Rank & Rent)**: um hub de engenharia e ferramentaria que atrai compradores industriais pelo Google e por motores de IA e encaminha as solicitações de cotação (RFQ) ao parceiro industrial locatário.

Modelo de negócio: o portal entrega demanda qualificada + autoridade técnica; o parceiro entra com a planta fabril, capacidade de usinagem/injeção e o time comercial. Não há e-commerce, não há venda de peça avulsa, não há preço fechado online — há **cotação técnica sob análise de engenharia**.

| Item | Valor |
|---|---|
| Infraestrutura | Cloudflare Worker + Assets (`wrangler.json`, `assets.directory: "."`) |
| Deploy | Automático via `git push` para `main` |
| Captura de leads | `js/lead-tracker.js` → `POST /api/triagem` → KV `LEADS_KV` + e-mail → webhook Google Sheets (`GOOGLE-APPS-SCRIPT-CRM.js`) |
| Painel interno | `/painel-leads` (bloqueado no `robots.txt`) |
| Rastreamento | GA4 `G-76GCJPMSHS` (gtag.js nativo, sem GTM) |
| Localização | Polo operacional São Paulo/SP; atendimento técnico em todo o Brasil; parques fabris em SP e Região Sul |
| Certificações citadas no site | ISO 9001:2015, metrologia CMM, tolerâncias centesimais (±0,02 mm) |
| Contato comercial | WhatsApp `5511999999999` (configurável via `pmi_dest_phone`) e `portalmoldeinjecao@gmail.com` |

---

## 2. Oferta (4 pilares de serviço + 2 calculadoras)

| Pilar | URL canônica | Ticket médio de referência |
|---|---|---|
| Fabricação de moldes de injeção | `/fabricacao-de-moldes-de-injecao` | R$ 35.000 a R$ 380.000 por molde |
| Serviços de injeção plástica seriada (80t a 350t) | `/servicos-de-injecao-plastica` | R$ 15.000 a R$ 150.000+/mês |
| Engenharia, CAD/CAM e simulação reológica (Moldflow/CAE) | `/engenharia-e-desenvolvimento-de-moldes` | Entrada para projetos integrais |
| Manutenção, modificação e recuperação de moldes | `/manutencao-e-modificacao-de-moldes` | R$ 5.000 a R$ 45.000 por intervenção |
| Calculadora de tonelagem/força de fechamento | `/calculadora-tonelagem-injetora` | Isca técnica (lead magnet) |
| Calculadora de custo de peça injetada | `/calculadora-custo-peca-injetada` | Isca técnica (lead magnet) |

Hubs de conteúdo: `/categoria-projeto-e-engenharia-de-moldes`, `/categoria-ferramentaria-e-acos-para-moldes`, `/categoria-processos-e-custos-de-injecao-plastica`, `/categoria-manutencao-e-qualidade-de-matrizes`.

---

## 3. ICP — Perfil de Cliente Ideal (quem lê e quem decide)

### Empresa-alvo
- Indústrias de transformação plástica, ferramentarias, usinagem de precisão, metalmecânica, autopeças, bens de consumo duráveis, eletroeletrônico, médico-hospitalar e embalagem técnica.
- Porte típico: faturamento de R$ 5 milhões a R$ 80 milhões/ano, 15 a 200 funcionários.
- Geografia de compra: São Paulo (ABC paulista, Grande SP, Campinas, Sorocaba, São José dos Campos) com expansão para Sul e Minas.
- Momento de compra: lançamento de produto, troca de fornecedor, molde parado/em manutenção, aumento de lote, nacionalização de componente importado.

### Personas decisoras
1. **Gerente/Diretor Industrial ou de Engenharia** — dono do problema técnico. Quer robustez de projeto, vida útil, ciclo, previsibilidade de prazo e suporte de manutenção. Compara aços, classes SPI e sistema de alimentação.
2. **Comprador técnico / Gerente de Suprimentos (Supply Chain)** — dono do processo de homologação. Quer NDA, orçamento aberto (open-book), prazo, capacidade de lote e risco de fornecedor. Compara 2 a 4 cotações.
3. **Diretor Comercial / CEO da fábrica** — dono do resultado. Quer custo por peça, payback do ferramental, previsibilidade de demanda e diversificação de clientes.
4. **Engenheiro de produto / projetista (P&D)** — entra na fase de prancheta, valida CAD 3D e simulação; decisor técnico informal de alta influência.

### Dores que a página precisa reconhecer
- Orçamento de molde "caixa-preta", sem detalhamento de horas e aço.
- Ferramentaria que atrasa o try-out e atrasa o lançamento do produto.
- Molde com vida útil curta, trinca em aresta de fechamento, refrigeração insuficiente.
- Custo unitário da peça inflado por galho, ciclo longo e cavidades mal dimensionadas.
- Dependência de um único fornecedor e risco de parada de linha.

### Critérios de decisão (usar como argumento de copy)
Prazo de try-out · vida útil em ciclos · classe SPI · aço e tratamento térmico · sistema de alimentação (câmara quente × frio) · refrigeração e ciclo · tolerância dimensional (ISO 286) · homologação ISO 9001 · NDA e sigilo de desenho · suporte pós-entrega/manutenção · TCO e payback.

---

## 4. Jornada de conversão

```
Busca técnica (Google / AI Overview / Perplexity)
   → Artigo ou pilar (prova de competência técnica)
   → Calculadora (engajamento + dado do projeto)
   → /contato (RFQ: STEP/IGES, resina, volume, tolerância)
   → Triagem de engenharia → parceiro industrial
```

Conversão esperada por página: pedido de cotação, uso da calculadora, clique no WhatsApp de engenharia, envio de desenho 3D. "Saiba mais" não é conversão.

---

## 5. Posicionamento e voz

- **Promessa:** decisão técnica segura para quem precisa de molde, peça injetada ou manutenção de matriz — com engenharia na frente da usinagem.
- **Prova:** faixas de custo reais, classes SPI, metalurgia comparada, cálculo de tonelagem, simulação CAE, metrologia CMM.
- **Voz:** engenheiro sênior falando com par. Direta, numérica, sem adjetivo publicitário.
- **Nunca:** prometer preço fechado online, prazo sem análise de desenho, "melhor do Brasil", linguagem de agência de marketing, jargão de IA.

---

## 6. Restrições e regras de negócio

1. **Não alterar páginas já publicadas** sem pedido explícito (ver `.clinerules`, seção 0).
2. Não prometer capacidade fabril específica, tonelagem ou prazo como se fosse produção própria do portal — o portal conecta a parques homologados.
3. Não usar nome, logo ou case de parceiro sem autorização comercial vigente.
4. Dados de custo devem ser apresentados como **faixa de mercado** com a variável explicativa, nunca como tabela de preço oficial.
5. Respeitar LGPD: nenhum dado de lead em página pública; `/painel-leads` fora do índice.
6. Não expor `worker.js`, `wrangler.json`, KV namespace ou `.clinerules` no asset público (controle via `.assetsignore`).

---

## 7. Glossário técnico de referência (usar com precisão)

| Termo | Definição operacional |
|---|---|
| Classe SPI | Classificação de robustez do molde (101/102 alta produção; 103 média; 104 protótipo). |
| Força de fechamento | Tonelagem necessária = área projetada (cm²) × pressão específica da cavidade (kgf/cm²) ÷ 1000 × fator de segurança. |
| Câmara quente | Sistema de alimentação com canal aquecido que elimina o galho; maior custo inicial, menor custo por peça em volumes altos. |
| Contra-saída (undercut) | Geometria que impede extração direta; exige gaveta, lifter ou núcleo hidráulico. |
| Linha de partição | Plano de separação entre cavidade e macho; afeta marca visual e rebarba. |
| Try-out | Ajuste e validação do molde na injetora antes da liberação para produção. |
| DFM | Design for Manufacturing: revisão do desenho para reduzir custo e risco de fabricação. |
| Moldflow / CAE | Simulação de preenchimento, resfriamento e empenamento antes do corte do aço. |
| HRC | Dureza Rockwell C do aço ferramenta. |
| Classe de aço | P20/1.2311 (pré-beneficiado), 1.2738 (alta seção), H13/1.2344 (alta abrasão), Inox 420/S136 (corrosão). |

---

## 8. Arquivos-chave do repositório

| Arquivo | Papel |
|---|---|
| `index.html` | Hub central de decisão industrial |
| `fabricacao-de-moldes-de-injecao.html` e demais pilares | Landing pages de serviço |
| `categoria-*.html` | Hubs de conteúdo por tema |
| `*.html` (8 artigos) | Conteúdo técnico de topo e meio de funil |
| `calculadora-*.html` | Ferramentas interativas (isca técnica) |
| `llms.txt` / `llms-full.txt` | Contexto canônico para LLMs |
| `sitemap.xml` / `robots.txt` / `_redirects` | Indexação e rotas |
| `js/lead-tracker.js`, `worker.js` | Captura e triagem de leads |
| `.clinerules`, `PROJECT_CONTEXT.md`, `PROGRESS.md` | Governança editorial |
| `template-post-padrao.html` | Template de artigo (não publicar) |
| `scripts/seo_checker.py`, `scripts/geo_checker.py` | Auditores locais (não versionar/publicar) |
