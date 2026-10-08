// Aplica o tema salvo (claro/escuro) antes de desenhar a página, para não piscar.
(function () {
  try {
    var m = localStorage.getItem('ns-mode');
    if (m === 'light' || m === 'dark') document.documentElement.setAttribute('data-mode', m);
  } catch (e) { /* armazenamento bloqueado: segue o tema do sistema */ }
})();
