# IMAGENS A CRIAR — 20 artes para os 10 rascunhos pendentes

> Documento técnico de produção visual. **Nenhum `src` ou `og:image` deve ser alterado antes dos arquivos existirem em `/imagens`.**
> Inventário gerado em 06/11/2026 por auditoria de `<img src>`, `og:image` e dHash nas 33 páginas.
> Registro de alt texts atuais: `rascunhos/IMAGENS-A-CRIAR.md`.

## Situação

Os 10 rascunhos do calendário editorial (09/11 a 09/12) estão com **20 imagens 100% reutilizadas** de páginas já publicadas. Publicar assim faria dois posts diferentes compartilharem a mesma capa e o mesmo card social.

| Verificação | Resultado |
|---|---|
| Rascunhos pendentes | 10 |
| Imagens envolvidas | 20 (10 capas + 10 corpos) |
| Imagens com arte própria | **0** |
| Imagens que também são capa/OG de artigo publicado | 7 (risco de card social duplicado) |

## Especificação de saída

| Posição | Dimensão | Formato | Peso-alvo | Carregamento no HTML |
|---|---|---|---|---|
| Capa / Hero (também `og:image`) | **1200 × 675** (16:9) | WebP q80–85 | ≤ 120 KB | `loading="eager" fetchpriority="high"` |
| Corpo / bloco 2 colunas | **800 × 800** (1:1) | WebP q80–85 | ≤ 80 KB | `loading="lazy" decoding="async"` |

Nomenclatura: `tema-subtema-contexto.webp`, minúsculas, sem acento, hífens. Sem EXIF com GPS; no máximo `ImageDescription`, `Artist` e `Copyright`.

## Inventário (20 imagens)

| # | Rascunho | Posição | Imagem atual reutilizada — e onde mais aparece | Novo arquivo |
|--:|---|---|---|---|
| 1 | `lote-minimo-de-injecao-plastica` | Capa/OG | `parque-maquinas-injetoras-80t-350t-injecao-plastica.webp` — **5 páginas**: hub processos (OG), `como-calcular` (corpo), `index` (corpo), `servicos` (OG) | `lote-minimo-moq-curva-amortizacao-molde.webp` |
| 2 | `lote-minimo-de-injecao-plastica` | Corpo | `orcamento-tecnico-rfq-fabricacao-molde-injecao.webp` — **4 páginas**: capa+OG de `quanto-custa`, corpo do hub processos, OG da calculadora de custo | `lote-minimo-setup-corrida-curta-bancada.webp` |
| 3 | `injecao-plastica-sob-demanda` | Capa/OG | `injetora-2-hibrida-medio-porte-160t-250t-ciclo-rapido.webp` — corpo de `servicos` | `injecao-sob-demanda-kanban-cartoes-producao.webp` |
| 4 | `injecao-plastica-sob-demanda` | Corpo | `controle-processo-recalque-injecao-plastica-sem-defeitos.webp` — corpo de `principais-defeitos` | `injecao-sob-demanda-estoque-enxuto-contentores.webp` |
| 5 | `sobreinjecao-de-inserto-metalico` | Capa/OG | `engenharia-1-ponto-injecao-balanceamento-moldflow.webp` — **3 páginas**: OG do hub projeto, OG+corpo de `engenharia` | `sobreinjecao-inserto-bucha-roscada-corte.webp` |
| 6 | `sobreinjecao-de-inserto-metalico` | Corpo | `gdt-metrologia-tolerancia-mecanica-moldes.webp` — corpo da `index` | `sobreinjecao-ensaio-arrancamento-inserto.webp` |
| 7 | `nacionalizacao-de-molde-importado` | Capa/OG | `manutencao-4-modificacao-geometrica-novos-posticos-cnc.webp` — corpo de `manutencao-e-modificacao` | `nacionalizacao-molde-importado-roscas-npt-bsp.webp` |
| 8 | `nacionalizacao-de-molde-importado` | Corpo | `metrologia-tridimensional-cmm-inspecao-molde-injecao.webp` — corpo de `manutencao-preventiva` | `nacionalizacao-anel-centragem-altura-injetora.webp` |
| 9 | `contrato-de-fornecimento-de-pecas-injetadas` | Capa/OG | `analise-dfm-cotacao-pecas-tecnicas-injetadas.webp` — **3 páginas**: corpo de `engenharia` e de `simulacao` | `contrato-fornecimento-comodato-molde-documento.webp` |
| 10 | `contrato-de-fornecimento-de-pecas-injetadas` | Corpo | `homologacao-fornecedores-moldes-injecao-b2b.webp` — corpo de `quanto-custa` | `contrato-sla-otd-entrega-programada-injetados.webp` |
| 11 | `molde-de-injecao-usado-riscos-e-checklist` | Capa/OG | `manutencao-3-eliminacao-rebarbas-ajuste-particao-spotting.webp` — corpo de `manutencao-e-modificacao` | `molde-usado-inspecao-particao-lampada.webp` |
| 12 | `molde-de-injecao-usado-riscos-e-checklist` | Corpo | `inspecao-defeitos-injecao-plastica-rebarba-chupagem.webp` — **4 páginas**: capa+OG de `principais-defeitos`, corpo do hub manutenção e de `manutencao-e-modificacao` | `molde-usado-durometro-dureza-hrc.webp` |
| 13 | `molde-com-gaveta-slide-e-contra-saida` | Capa/OG | `usinagem-cnc-5-eixos-cavidade-molde-aco-h13.webp` — **3 páginas**: capa+OG de `diferenca-entre-aco`, corpo do hub ferramentaria | `molde-gaveta-slide-cinematica-cunha.webp` |
| 14 | `molde-com-gaveta-slide-e-contra-saida` | Corpo | `fase-3-eletroerosao-penetracao-edm-moldes.webp` — corpo de `fabricacao` | `molde-gaveta-lifter-desmoldagem-detalhe.webp` |
| 15 | `refrigeracao-conformal-em-moldes` | Capa/OG | `fresamento-alta-velocidade-camara-quente-manifold.webp` — **3 páginas**: capa+OG de `molde-camara-quente`, corpo do hub ferramentaria | `refrigeracao-conformal-inserto-dmls-canais.webp` |
| 16 | `refrigeracao-conformal-em-moldes` | Corpo | `simulacao-reologica-moldflow-projeto-cad-molde.webp` — **4 páginas**: capa+OG do artigo de simulação, corpo do hub projeto e de `engenharia` | `refrigeracao-conformal-mapa-termico-ciclo.webp` |
| 17 | `custo-hora-maquina-injetora` | Capa/OG | `injetora-1-servo-hidraulica-80t-150t-precisao.webp` — corpo de `servicos` | `custo-hora-maquina-planilha-operador-painel.webp` |
| 18 | `custo-hora-maquina-injetora` | Corpo | `calculo-forca-fechamento-tonelagem-injetora-industrial.webp` — **4 páginas**: capa+OG de `como-calcular`, OG da calculadora de tonelagem, corpo do hub projeto | `custo-hora-maquina-composicao-custo-grafico.webp` |
| 19 | `molde-bicomponente-duas-cores-2k` | Capa/OG | `engenharia-3-bolsoes-ar-saidas-gases-venting.webp` — corpo de `engenharia` | `molde-2k-mesa-giratoria-duas-cavidades.webp` |
| 20 | `molde-bicomponente-duas-cores-2k` | Corpo | `engenharia-4-empenamento-contracao-volumetrica-cnc.webp` — corpo de `engenharia` | `molde-2k-selagem-pp-tpe-interface.webp` |

## Briefings visuais detalhados

Cada arte precisa conversar com o texto do post e **não** repetir composição já usada no site. Paleta da marca: navy `#0b1329`, azul `#1d4ed8`, accent `#0284c7`; fotografia industrial real de ferramentaria/injeção, luz natural.

### 1. `lote-minimo-moq-curva-amortizacao-molde.webp` — Capa 1200×675
- **Rascunho:** `lote-minimo-de-injecao-plastica` · **Substitui:** `parque-maquinas-injetoras-80t-350t-injecao-plastica.webp` (5 páginas)
- **Cenário:** infografia sobre bancada de aço inox, molde fechado ao fundo desfocado.
- **Composição:** barras horizontais em 4 faixas — 500 / 2.000 / 10.000 / 50.000 peças — com a curva do custo fixo por peça caindo de R$ 120,00 para R$ 1,20 e marcação do “ponto de viabilidade” entre 500 e 2.000.
- **Elementos obrigatórios:** eixo em R$/peça, rótulo “amortização do molde”, selo “SPI 104 → 101”.
- **Evitar:** pessoas em close, foto de escritório, números genéricos.
- **Alt sugerido:** Gráfico de amortização do molde mostrando o custo fixo por peça caindo de R$ 120 para R$ 1,20 conforme o lote cresce de 500 a 50 mil peças
- **Legenda:** O lote mínimo é onde o custo fixo da corrida deixa de dominar o preço da peça.

### 2. `lote-minimo-setup-corrida-curta-bancada.webp` — Corpo 800×800
- **Rascunho:** `lote-minimo-de-injecao-plastica` · **Substitui:** `orcamento-tecnico-rfq-fabricacao-molde-injecao.webp` (4 páginas)
- **Cenário:** bancada de injeção com placa de molde aberta e bandeja de purga.
- **Composição:** close na linha de partição, cronômetro industrial em 02:15 de setup, planilha de custo por corrida parcialmente visível e 5 a 8 peças de partida separadas como refugo.
- **Elementos obrigatórios:** refugo visível, etiqueta “purga 1–3 kg”.
- **Alt sugerido:** Bancada de injeção com molde aberto, cronômetro de setup e peças de partida separadas como refugo de uma corrida curta

### 3. `injecao-sob-demanda-kanban-cartoes-producao.webp` — Capa 1200×675
- **Rascunho:** `injecao-plastica-sob-demanda` · **Substitui:** `injetora-2-hibrida-medio-porte-160t-250t-ciclo-rapido.webp` (2 páginas)
- **Cenário:** área de expedição interna, injetora ao fundo em operação.
- **Composição:** quadro kanban físico com cartões verde/amarelo/vermelho, três contentores padronizados e etiqueta de ponto de pedido.
- **Elementos obrigatórios:** cartão “ponto de pedido 6.000 pç” e “lead time 7 dias”.
- **Evitar:** escritório administrativo, planilha em tela.
- **Alt sugerido:** Quadro kanban industrial com cartões de reposição ao lado de contentores de peças injetadas e injetora em operação ao fundo

### 4. `injecao-sob-demanda-estoque-enxuto-contentores.webp` — Corpo 800×800
- **Rascunho:** `injecao-plastica-sob-demanda` · **Substitui:** `controle-processo-recalque-injecao-plastica-sem-defeitos.webp` (2 páginas)
- **Cenário:** estante vertical de expedição com poucos contentores.
- **Composição:** 4 a 6 contentores etiquetados ocupando só a metade inferior da estante, deixando evidente o estoque em dias.
- **Elementos obrigatórios:** etiqueta “7–15 dias”.
- **Alt sugerido:** Estante de expedição com poucos contentores de peças técnicas etiquetados, ilustrando estoque enxuto de 7 a 15 dias

### 5. `sobreinjecao-inserto-bucha-roscada-corte.webp` — Capa 1200×675
- **Rascunho:** `sobreinjecao-de-inserto-metalico` · **Substitui:** `engenharia-1-ponto-injecao-balanceamento-moldflow.webp` (3 páginas)
- **Cenário:** macro de peça técnica seccionada sobre fundo escuro.
- **Composição:** corte transversal com a bucha roscada encapsulada, estria de ancoragem visível e destaque em azul na interface metal-polímero; cota de ±0,05 mm.
- **Elementos obrigatórios:** bucha roscada, estria vertical, camada de resina ao redor.
- **Alt sugerido:** Corte seccional de peça plástica com bucha roscada metálica e estria de ancoragem destacada na interface com a resina

### 6. `sobreinjecao-ensaio-arrancamento-inserto.webp` — Corpo 800×800
- **Rascunho:** `sobreinjecao-de-inserto-metalico` · **Substitui:** `gdt-metrologia-tolerancia-mecanica-moldes.webp` (2 páginas)
- **Cenário:** bancada de ensaio mecânico.
- **Composição:** dispositivo de tração prendendo o inserto, display marcando 640 N e peça reprovada ao lado com o inserto arrancado, indicando o modo de falha.
- **Alt sugerido:** Ensaio de arrancamento em inserto metálico sobreinjetado com leitura de força em newtons e peça reprovada ao lado

### 7. `nacionalizacao-molde-importado-roscas-npt-bsp.webp` — Capa 1200×675
- **Rascunho:** `nacionalizacao-de-molde-importado` · **Substitui:** `manutencao-4-modificacao-geometrica-novos-posticos-cnc.webp` (2 páginas)
- **Cenário:** bancada com placa de molde e conexões hidráulicas.
- **Composição:** dois engates lado a lado — NPT (cônica) e BSP (paralela) — com paquímetro na bitola e seta “polegada vs métrica”; molde importado ao fundo.
- **Elementos obrigatórios:** rótulos “NPT 1/4” e “BSP 1/4”, destaque no perfil da rosca.
- **Alt sugerido:** Comparação entre conexões de refrigeração NPT cônica e BSP paralela em placa de molde importado, com paquímetro medindo a bitola

### 8. `nacionalizacao-anel-centragem-altura-injetora.webp` — Corpo 800×800
- **Rascunho:** `nacionalizacao-de-molde-importado` · **Substitui:** `metrologia-tridimensional-cmm-inspecao-molde-injecao.webp` (2 páginas)
- **Cenário:** molde apoiado na placa da injetora, em ângulo lateral.
- **Composição:** anel de centragem em evidência, calço usinado sob o molde e setas indicando altura de instalação e furação de fixação.
- **Alt sugerido:** Molde importado apoiado na placa da injetora com anel de centragem, calço de altura e furação de fixação destacados

### 9. `contrato-fornecimento-comodato-molde-documento.webp` — Capa 1200×675
- **Rascunho:** `contrato-de-fornecimento-de-pecas-injetadas` · **Substitui:** `analise-dfm-cotacao-pecas-tecnicas-injetadas.webp` (3 páginas)
- **Cenário:** mesa de engenharia com molde parcialmente aberto.
- **Composição:** plaqueta de patrimônio no molde com “COMODATO — PROPRIEDADE DO CLIENTE”, pasta de contrato aberta ao lado com cláusulas visíveis, caneta e carimbo.
- **Elementos obrigatórios:** plaqueta metálica, cláusulas de SLA e reajuste legíveis como textura.
- **Alt sugerido:** Molde de injeção com plaqueta de comodato indicando propriedade do cliente e contrato técnico de fornecimento ao lado

### 10. `contrato-sla-otd-entrega-programada-injetados.webp` — Corpo 800×800
- **Rascunho:** `contrato-de-fornecimento-de-pecas-injetadas` · **Substitui:** `homologacao-fornecedores-moldes-injecao-b2b.webp` (2 páginas)
- **Cenário:** sala de controle com janela para a fábrica.
- **Composição:** painel com OTD 95%, ppm de refugo 320 e calendário de entregas semanais; pallets etiquetados visíveis pela janela.
- **Alt sugerido:** Painel de indicadores de fornecimento com OTD de 95%, ppm de refugo e calendário de entregas programadas de peças injetadas

### 11. `molde-usado-inspecao-particao-lampada.webp` — Capa 1200×675
- **Rascunho:** `molde-de-injecao-usado-riscos-e-checklist` · **Substitui:** `manutencao-3-eliminacao-rebarbas-ajuste-particao-spotting.webp` (2 páginas)
- **Cenário:** bancada com molde usado aberto sob lâmpada de inspeção.
- **Composição:** cavidade em primeiro plano com a aresta de partição iluminada, folha de checklist com itens marcados e caneta; marcas de desgaste visíveis sem exagero.
- **Elementos obrigatórios:** checklist impresso, lâmpada articulada, aresta destacada.
- **Evitar:** ferrugem exagerada ou molde destruído (passa impressão de sucata, não de oportunidade).
- **Alt sugerido:** Inspeção de molde de injeção usado sob lâmpada articulada, com checklist de avaliação e destaque na linha de partição

### 12. `molde-usado-durometro-dureza-hrc.webp` — Corpo 800×800
- **Rascunho:** `molde-de-injecao-usado-riscos-e-checklist` · **Substitui:** `inspecao-defeitos-injecao-plastica-rebarba-chupagem.webp` (4 páginas)
- **Cenário:** close na cavidade com durômetro portátil apoiado.
- **Composição:** aparelho com visor em 42,5 HRC, ponta de medição tocando o aço; ao fundo, trincas finas de fadiga térmica.
- **Elementos obrigatórios:** leitura em HRC no visor, superfície de aço usada.
- **Alt sugerido:** Durômetro portátil medindo 42,5 HRC na cavidade de um molde usado, com trincas de fadiga térmica ao fundo

### 13. `molde-gaveta-slide-cinematica-cunha.webp` — Capa 1200×675
- **Rascunho:** `molde-com-gaveta-slide-e-contra-saida` · **Substitui:** `usinagem-cnc-5-eixos-cavidade-molde-aco-h13.webp` (3 páginas)
- **Cenário:** molde em corte, montado em bancada, com peça técnica ao lado.
- **Composição:** vista em corte do bloco deslizante com cunha mecânica, ângulo de 20° desenhado e seta de curso lateral de 40 mm; peça com rebaixo lateral visível.
- **Elementos obrigatórios:** cunha, guias, ângulo cotado, seta de curso.
- **Alt sugerido:** Corte de molde com gaveta acionada por cunha mecânica, mostrando o ângulo de acionamento e o curso lateral de desmoldagem

### 14. `molde-gaveta-lifter-desmoldagem-detalhe.webp` — Corpo 800×800
- **Rascunho:** `molde-com-gaveta-slide-e-contra-saida` · **Substitui:** `fase-3-eletroerosao-penetracao-edm-moldes.webp` (2 páginas)
- **Cenário:** detalhe interno do molde, em macro.
- **Composição:** lifter (pinça angular) desmoldando um rebaixo lateral com a peça em elevação; alojamento usinado em evidência e seta do movimento angular.
- **Alt sugerido:** Detalhe de lifter desmoldando rebaixo lateral em molde de injeção, com o alojamento usinado em evidência

### 15. `refrigeracao-conformal-inserto-dmls-canais.webp` — Capa 1200×675
- **Rascunho:** `refrigeracao-conformal-em-moldes` · **Substitui:** `fresamento-alta-velocidade-camara-quente-manifold.webp` (3 páginas)
- **Cenário:** inserto metálico impresso em DMLS sobre bancada, em corte.
- **Composição:** corte do inserto com os canais conformais acompanhando o contorno da cavidade; gradiente de cor indicando temperatura uniforme (azul a laranja).
- **Elementos obrigatórios:** canais curvos, distância à parede cotada em 10 mm, superfície de impressão visível.
- **Alt sugerido:** Inserto de molde fabricado por DMLS em corte, com canais de refrigeração conformal acompanhando o contorno da cavidade e gradiente térmico uniforme

### 16. `refrigeracao-conformal-mapa-termico-ciclo.webp` — Corpo 800×800
- **Rascunho:** `refrigeracao-conformal-em-moldes` · **Substitui:** `simulacao-reologica-moldflow-projeto-cad-molde.webp` (4 páginas)
- **Cenário:** tela de CAE com mapa térmico de peça, vista 3D.
- **Composição:** split comparativo — à esquerda canal reto com bordas quentes (vermelho), à direita canal conformal com temperatura uniforme (verde); escala de temperatura em °C.
- **Alt sugerido:** Mapa térmico de simulação CAE comparando refrigeração convencional e conformal, com temperatura uniforme na versão conformal

### 17. `custo-hora-maquina-planilha-operador-painel.webp` — Capa 1200×675
- **Rascunho:** `custo-hora-maquina-injetora` · **Substitui:** `injetora-1-servo-hidraulica-80t-150t-precisao.webp` (2 páginas)
- **Cenário:** chão de fábrica, junto ao painel de uma injetora.
- **Composição:** painel HMI exibindo kWh/h e 26 s de ciclo, operador ao fundo em atividade e planilha de composição de custo em primeiro plano com valores legíveis como textura.
- **Elementos obrigatórios:** leitura de kWh, ícone de energia.
- **Alt sugerido:** Painel de injetora exibindo consumo em kWh e tempo de ciclo, com planilha de composição de custo hora-máquina em primeiro plano

### 18. `custo-hora-maquina-composicao-custo-grafico.webp` — Corpo 800×800
- **Rascunho:** `custo-hora-maquina-injetora` · **Substitui:** `calculo-forca-fechamento-tonelagem-injetora-industrial.webp` (4 páginas)
- **Cenário:** infografia limpa sobre fundo navy.
- **Composição:** gráfico de rosca com quatro fatias — depreciação 45%, operador 20%, manutenção 20%, energia 15% — e nota “base: 5.000 h produtivas/ano”.
- **Alt sugerido:** Gráfico de composição da hora-máquina de injetora com depreciação 45%, operador 20%, manutenção 20% e energia 15%

### 19. `molde-2k-mesa-giratoria-duas-cavidades.webp` — Capa 1200×675
- **Rascunho:** `molde-bicomponente-duas-cores-2k` · **Substitui:** `engenharia-3-bolsoes-ar-saidas-gases-venting.webp` (2 páginas)
- **Cenário:** molde 2K aberto sobre bancada, placa rotativa visível.
- **Composição:** dois postos de injeção lado a lado, placa rotativa em 90°, peça bicolor rígido-flexível em destaque na mão enluvada.
- **Elementos obrigatórios:** duas unidades de injeção, peça com duas cores.
- **Alt sugerido:** Molde bicomponente 2K aberto com mesa giratória, dois postos de injeção e peça bicolor rígido-flexível em destaque

### 20. `molde-2k-selagem-pp-tpe-interface.webp` — Corpo 800×800
- **Rascunho:** `molde-bicomponente-duas-cores-2k` · **Substitui:** `engenharia-4-empenamento-contracao-volumetrica-cnc.webp` (2 páginas)
- **Cenário:** macro da peça em corte, sobre superfície escura.
- **Composição:** corte mostrando o corpo rígido (PP) e a camada flexível (TPE), com destaque na zona de aderência/selagem e cota da espessura de parede.
- **Alt sugerido:** Corte de peça bicomponente 2K mostrando a interface entre PP rígido e TPE flexível, com destaque na zona de selagem

---

## Checklist de integração (somente após as artes existirem)

1. Salvar os 20 arquivos em `/imagens/` com os nomes da coluna “Novo arquivo”.
2. Converter para WebP q80–85 com Pillow (`ImageOps.fit` + `method=6`), EXIF mínimo sem GPS.
3. Conferir peso: capa ≤120 KB, corpo ≤80 KB.
4. Em cada rascunho, trocar **duas** referências: `src` (com prefixo `../imagens/`) e `og:image` (URL absoluta) da capa.
5. Atualizar o `alt` da imagem substituída para o “Alt sugerido” do briefing.
6. Rodar `py scripts/seo_checker.py .` e `py scripts/geo_checker.py .`.
7. Registrar em `PROGRESS.md` e, só então, liberar o post pelo `scripts/liberar_post.py`.

> Enquanto os arquivos não existirem, os rascunhos continuam funcionando com as imagens atuais — e **não entram no ar** porque estão em `/rascunhos/`, fora do deploy.

## Regras respeitadas nesta etapa

- Nenhum `src` ou `og:image` foi alterado nos 33 HTMLs.
- Os 8 artigos publicados, os 4 pilares, os 4 hubs e a home permanecem intactos.
- O `rascunhos/IMAGENS-A-CRIAR.md` continua válido como registro dos alt texts atuais.

