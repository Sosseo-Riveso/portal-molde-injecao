/* Busca interna do Portal Molde Injeção — client-side, sem dependências.
   Índice: /js/indice_busca.json (gerado por scripts/gerar_indice_busca.py).
   Componente usado na topbar (desktop) e na gaveta mobile. */
(function () {
  'use strict';

  var INDEX_URL = '/js/indice_busca.json';
  var LIMITE = 8;
  var MIN_CHARS = 2;
  var indicePromise = null;

  function normalizar(valor) {
    return String(valor || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function carregarIndice() {
    if (!indicePromise) {
      indicePromise = fetch(INDEX_URL, { credentials: 'same-origin' })
        .then(function (resposta) {
          if (!resposta.ok) { throw new Error('HTTP ' + resposta.status); }
          return resposta.json();
        })
        .then(function (dados) {
          var paginas = (dados && dados.paginas) || [];
          paginas.forEach(function (pagina) {
            pagina._titulo = normalizar(pagina.titulo);
            pagina._categoria = normalizar(pagina.categoria);
            pagina._resumo = normalizar(pagina.resumo);
            pagina._tags = normalizar(pagina.tags);
            pagina._tudo = [pagina._titulo, pagina._categoria, pagina._resumo, pagina._tags,
              normalizar(pagina.url.replace(/[\/-]+/g, ' '))].join(' ');
          });
          return paginas;
        })
        .catch(function (erro) {
          indicePromise = null;
          throw erro;
        });
    }
    return indicePromise;
  }

  function pontuar(pagina, tokens, frase) {
    var pontos = 0;
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (pagina._tudo.indexOf(token) === -1) { return 0; }
      if (pagina._titulo.indexOf(token) !== -1) { pontos += 8; }
      if (pagina._tags.indexOf(token) !== -1) { pontos += 4; }
      if (pagina._resumo.indexOf(token) !== -1) { pontos += 2; }
      if (pagina._categoria.indexOf(token) !== -1) { pontos += 2; }
    }
    if (frase && pagina._titulo.indexOf(frase) !== -1) { pontos += 10; }
    if (frase && pagina._tudo.indexOf(frase) !== -1) { pontos += 3; }
    return pontos;
  }

  function buscar(paginas, consulta) {
    var frase = normalizar(consulta);
    if (frase.length < MIN_CHARS) { return []; }
    var tokens = frase.split(' ').filter(Boolean);
    var achados = [];
    paginas.forEach(function (pagina) {
      var pontos = pontuar(pagina, tokens, frase);
      if (pontos > 0) { achados.push({ pagina: pagina, pontos: pontos }); }
    });
    achados.sort(function (a, b) {
      if (b.pontos !== a.pontos) { return b.pontos - a.pontos; }
      return a.pagina.titulo.length - b.pagina.titulo.length;
    });
    return achados.slice(0, LIMITE).map(function (item) { return item.pagina; });
  }

  function criarItem(pagina, id, indice) {
    var link = document.createElement('a');
    link.className = 'pmi-search-item';
    link.href = pagina.url;
    link.id = id;
    link.setAttribute('role', 'option');
    link.setAttribute('aria-selected', 'false');
    link.dataset.indice = String(indice);

    var categoria = document.createElement('span');
    categoria.className = 'pmi-search-cat';
    categoria.textContent = pagina.categoria || pagina.tipo;

    var titulo = document.createElement('span');
    titulo.className = 'pmi-search-title';
    titulo.textContent = pagina.titulo;

    var resumo = document.createElement('span');
    resumo.className = 'pmi-search-resumo';
    var texto = pagina.resumo || '';
    resumo.textContent = texto.length > 110 ? texto.slice(0, 107).trim() + '...' : texto;

    link.appendChild(categoria);
    link.appendChild(titulo);
    if (texto) { link.appendChild(resumo); }
    return link;
  }

  function iniciarComponente(raiz, indiceComponente) {
    var input = raiz.querySelector('input[type="search"]');
    var caixa = raiz.querySelector('.pmi-search-results');
    var status = raiz.querySelector('[data-pmi-search-status]');
    if (!input || !caixa) { return; }

    var idBase = caixa.id || ('pmi-search-' + indiceComponente);
    if (!caixa.id) { caixa.id = idBase; }
    input.setAttribute('aria-controls', idBase);
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');

    var ativo = -1;
    var timer = null;
    var ultimoRender = '';

    function itens() {
      return Array.prototype.slice.call(caixa.querySelectorAll('.pmi-search-item'));
    }

    function fechar() {
      caixa.hidden = true;
      caixa.innerHTML = '';
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      ativo = -1;
      ultimoRender = '';
    }

    function definirAtivo(posicao) {
      var lista = itens();
      if (!lista.length) { return; }
      if (posicao < 0) { posicao = lista.length - 1; }
      if (posicao >= lista.length) { posicao = 0; }
      lista.forEach(function (item, i) {
        var selecionado = i === posicao;
        item.classList.toggle('is-active', selecionado);
        item.setAttribute('aria-selected', selecionado ? 'true' : 'false');
      });
      ativo = posicao;
      input.setAttribute('aria-activedescendant', lista[posicao].id);
      if (lista[posicao].scrollIntoView) {
        lista[posicao].scrollIntoView({ block: 'nearest' });
      }
    }

    function mensagem(texto, classe) {
      caixa.innerHTML = '';
      var aviso = document.createElement('div');
      aviso.className = classe;
      aviso.textContent = texto;
      caixa.appendChild(aviso);
      caixa.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      input.removeAttribute('aria-activedescendant');
      ativo = -1;
    }

    function anunciar(texto) {
      if (status) { status.textContent = texto; }
    }

    function renderizar(consulta) {
      var termo = consulta.trim();
      if (termo.length < MIN_CHARS) {
        anunciar('');
        fechar();
        return;
      }
      ultimoRender = termo;
      carregarIndice().then(function (paginas) {
        if (ultimoRender !== termo) { return; }
        var achados = buscar(paginas, termo);
        caixa.innerHTML = '';
        ativo = -1;
        if (!achados.length) {
          mensagem('Nenhuma página encontrada para "' + termo + '". Tente aço H13, câmara quente, tonelagem ou molde.', 'pmi-search-empty');
          anunciar('Nenhum resultado para ' + termo + '.');
          return;
        }
        achados.forEach(function (pagina, i) {
          caixa.appendChild(criarItem(pagina, idBase + '-opt-' + i, i));
        });
        caixa.hidden = false;
        input.setAttribute('aria-expanded', 'true');
        anunciar(achados.length + (achados.length === 1 ? ' resultado encontrado.' : ' resultados encontrados.'));
      }).catch(function () {
        mensagem('Busca indisponível no momento. Tente novamente ou navegue pelo menu.', 'pmi-search-empty');
        anunciar('Busca indisponível.');
      });
    }

    input.addEventListener('input', function () {
      window.clearTimeout(timer);
      var valor = input.value;
      timer = window.setTimeout(function () { renderizar(valor); }, 90);
    });

    input.addEventListener('search', function () {
      if (!input.value) { fechar(); }
    });

    input.addEventListener('focus', function () {
      carregarIndice().catch(function () { /* erro tratado no render */ });
      if (input.value.trim().length >= MIN_CHARS) { renderizar(input.value); }
    });

    input.addEventListener('keydown', function (evento) {
      if (evento.key === 'ArrowDown') {
        if (caixa.hidden && input.value.trim().length >= MIN_CHARS) { renderizar(input.value); }
        evento.preventDefault();
        definirAtivo(ativo + 1);
      } else if (evento.key === 'ArrowUp') {
        evento.preventDefault();
        definirAtivo(ativo - 1);
      } else if (evento.key === 'Escape') {
        evento.preventDefault();
        fechar();
      } else if (evento.key === 'Enter') {
        var lista = itens();
        if (!lista.length) { return; }
        evento.preventDefault();
        var destino = ativo >= 0 ? lista[ativo] : lista[0];
        if (destino) { window.location.href = destino.href; }
      }
    });

    caixa.addEventListener('click', function () {
      fechar();
    });

    document.addEventListener('click', function (evento) {
      if (!raiz.contains(evento.target)) { fechar(); }
    });
  }

  function iniciar() {
    var componentes = document.querySelectorAll('[data-pmi-search]');
    Array.prototype.forEach.call(componentes, iniciarComponente);
  }

  if (typeof window !== 'undefined' && window) {
    window.PMIBusca = { normalizar: normalizar, carregarIndice: carregarIndice, buscar: buscar };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();

