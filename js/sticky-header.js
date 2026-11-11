/* Header fixo com redução no scroll — Portal Molde Injeção.
   Aplicado em 100% das páginas. Atua sobre #pmiMainHeader, que já é
   `sticky top-0`; aqui só alternamos a classe .pmi-scrolled (shrink). */
(function () {
  'use strict';

  var LIMIAR_REDUZIR = 60;
  var LIMIAR_RESTAURAR = 10;
  var header = null;
  var reduzido = false;

  function aplicar() {
    if (!header) { return; }
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (!reduzido && y > LIMIAR_REDUZIR) {
      reduzido = true;
      header.classList.add('pmi-scrolled');
    } else if (reduzido && y <= LIMIAR_RESTAURAR) {
      reduzido = false;
      header.classList.remove('pmi-scrolled');
    }
  }

  function iniciar() {
    header = document.getElementById('pmiMainHeader');
    if (!header || header.getAttribute('data-pmi-sticky-ready') === '1') { return; }
    header.setAttribute('data-pmi-sticky-ready', '1');
    header.classList.add('pmi-sticky-active');
    window.addEventListener('scroll', aplicar, { passive: true });
    window.addEventListener('resize', aplicar, { passive: true });
    aplicar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
