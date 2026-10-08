/* Página de links · Nicolas Schulze
   Monta a página a partir de window.CONTEUDO (conteudo.js).
   Segurança: todo texto entra com textContent (nunca innerHTML),
   links só aceitam https:// e imagens só aceitam arquivos do próprio site. */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- validação ---------- */
  function texto(v, max) {
    return typeof v === 'string' ? v.slice(0, max || 200) : '';
  }
  function urlSegura(v) {
    if (typeof v !== 'string' || !v) return '';
    try {
      var u = new URL(v);
      return u.protocol === 'https:' ? u.href : '';
    } catch (e) { return ''; }
  }
  // Só caminhos relativos simples dentro do site: letras, números, - _ . /
  var IMG_OK = /^(?!.*\.\.)[A-Za-z0-9_\-\/]+\.(jpe?g|png|webp)$/i;
  function imagemSegura(v) {
    return typeof v === 'string' && IMG_OK.test(v) ? v : '';
  }
  var FOCO_OK = /^\d{1,3}% \d{1,3}%$/;

  function limpar(dados) {
    dados = dados && typeof dados === 'object' ? dados : {};
    var p = dados.perfil || {};
    return {
      perfil: {
        rotulo: texto(p.rotulo, 80),
        titulo: texto(p.titulo, 60),
        texto: texto(p.texto, 240),
        stack: texto(p.stack, 80)
      },
      links: (Array.isArray(dados.links) ? dados.links : []).slice(0, 12).map(function (l) {
        return {
          nome: texto(l && l.nome, 40),
          url: urlSegura(l && l.url),
          ativo: !!(l && l.ativo),
          destaque: !!(l && l.destaque)
        };
      }).filter(function (l) { return l.nome; }),
      projetos: (Array.isArray(dados.projetos) ? dados.projetos : []).slice(0, 80).map(function (s) {
        return {
          imagem: imagemSegura(s && s.imagem),
          projeto: texto(s && s.projeto, 40),
          legenda: texto(s && s.legenda, 60),
          alt: texto(s && s.alt, 160),
          ajuste: s && s.ajuste === 'inteira' ? 'inteira' : 'cobrir',
          foco: s && FOCO_OK.test(s.foco) ? s.foco : '50% 50%',
          ativo: !(s && s.ativo === false)
        };
      }).filter(function (s) { return s.imagem && s.ativo; })
    };
  }

  /* ---------- helpers de DOM ---------- */
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function $(id) { return document.getElementById(id); }

  /* ---------- perfil e links ---------- */
  function renderPerfil(p) {
    $('rotulo').textContent = p.rotulo;
    $('titulo').textContent = p.titulo;
    $('texto').textContent = p.texto;
    $('stack').textContent = p.stack;
    $('stack').hidden = !p.stack;
  }

  function renderLinks(links) {
    var ul = $('links');
    ul.replaceChildren();
    links.forEach(function (l) {
      var li = el('li');
      if (l.ativo && l.url) {
        var a = el('a', 'btn' + (l.destaque ? ' primary' : ''));
        a.href = l.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.appendChild(el('span', 't', l.nome));
        var ar = el('span', 'arrow', '→'); ar.setAttribute('aria-hidden', 'true');
        a.appendChild(ar);
        li.appendChild(a);
      } else {
        var d = el('div', 'btn off');
        d.setAttribute('aria-disabled', 'true');
        var w = el('span');
        w.appendChild(el('span', 't', l.nome));
        w.appendChild(el('span', 's', 'em breve'));
        d.appendChild(w);
        var dot = el('span', 'arrow', '·'); dot.setAttribute('aria-hidden', 'true');
        d.appendChild(dot);
        li.appendChild(d);
      }
      ul.appendChild(li);
    });
  }

  /* ---------- carrossel ---------- */
  var car = { todos: [], lista: [], i: 0, timer: null, pausado: false, filtro: 'Todos' };
  var parado = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function pad(x) { return (x < 10 ? '0' : '') + x; }

  function renderFiltros() {
    var box = $('filters');
    box.replaceChildren();
    var nomes = ['Todos'];
    car.todos.forEach(function (s) { if (s.projeto && nomes.indexOf(s.projeto) < 0) nomes.push(s.projeto); });
    box.hidden = nomes.length <= 2;
    nomes.forEach(function (n) {
      var b = el('button', 'chip', n);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(n === car.filtro));
      b.addEventListener('click', function () { car.filtro = n; montarSlides(); renderFiltros(); });
      box.appendChild(b);
    });
  }

  function montarSlides() {
    var box = $('slides'), dots = $('dots');
    Array.prototype.slice.call(box.querySelectorAll('.slide')).forEach(function (n) { n.remove(); });
    dots.replaceChildren();
    car.lista = car.filtro === 'Todos' ? car.todos : car.todos.filter(function (s) { return s.projeto === car.filtro; });
    var antes = box.querySelector('.nav.prev');
    car.lista.forEach(function (s, k) {
      var f = el('figure', 'slide' + (s.ajuste === 'inteira' ? ' fit' : ''));
      var img = el('img');
      // a imagem só é baixada quando o slide estiver perto de aparecer
      img.setAttribute('data-src', s.imagem);
      img.alt = s.alt || (s.projeto + (s.legenda ? ': ' + s.legenda : ''));
      img.decoding = 'async';
      img.style.objectPosition = s.foco;
      f.appendChild(img);
      if (s.projeto || s.legenda) {
        var cap = el('figcaption', 'tag');
        if (s.projeto) cap.appendChild(el('b', null, s.projeto));
        if (s.projeto && s.legenda) cap.appendChild(document.createTextNode(' · '));
        if (s.legenda) cap.appendChild(document.createTextNode(s.legenda));
        f.appendChild(cap);
      }
      box.insertBefore(f, antes);
      var d = el('button', 'dot');
      d.type = 'button';
      d.setAttribute('aria-label', 'Imagem ' + (k + 1));
      d.addEventListener('click', function () { ir(k); reiniciar(); });
      dots.appendChild(d);
    });
    dots.classList.toggle('many', car.lista.length > 12);
    $('tot').textContent = pad(car.lista.length);
    $('carousel').hidden = car.lista.length === 0;
    ir(0); reiniciar();
  }

  function ir(k) {
    var n = car.lista.length; if (!n) return;
    car.i = (k + n) % n;
    var slides = $('slides').querySelectorAll('.slide'), dots = $('dots').children;
    for (var j = 0; j < slides.length; j++) {
      slides[j].classList.toggle('on', j === car.i);
      slides[j].setAttribute('aria-hidden', String(j !== car.i));
      if (dots[j]) dots[j].setAttribute('aria-current', String(j === car.i));
    }
    $('cur').textContent = pad(car.i + 1);
    carregar(car.i); carregar(car.i + 1); carregar(car.i - 1);
  }
  function carregar(k) {
    var n = car.lista.length; if (!n) return;
    var img = $('slides').querySelectorAll('.slide img')[(k + n) % n];
    if (img && !img.getAttribute('src')) img.src = img.getAttribute('data-src');
  }
  function reiniciar() {
    clearInterval(car.timer);
    if (!parado && car.lista.length > 1) {
      car.timer = setInterval(function () { if (!car.pausado && !document.hidden) ir(car.i + 1); }, 4500);
    }
  }

  function ligarCarrossel() {
    var box = $('slides');
    box.querySelector('.prev').addEventListener('click', function () { ir(car.i - 1); reiniciar(); });
    box.querySelector('.next').addEventListener('click', function () { ir(car.i + 1); reiniciar(); });
    box.addEventListener('mouseenter', function () { car.pausado = true; });
    box.addEventListener('mouseleave', function () { car.pausado = false; });
    var x0 = null;
    box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { ir(dx < 0 ? car.i + 1 : car.i - 1); reiniciar(); }
      x0 = null;
    });
  }

  /* ---------- tema ---------- */
  function ligarTema() {
    var btns = document.querySelectorAll('.mode');
    function escuro() { return getComputedStyle(root).colorScheme.indexOf('dark') > -1; }
    function sync() {
      var d = escuro();
      Array.prototype.forEach.call(btns, function (b) {
        b.setAttribute('aria-pressed', String((b.getAttribute('data-set') === 'dark') === d));
      });
      var tc = document.querySelector('meta[name="theme-color"]');
      if (tc) tc.content = d ? '#0F0E17' : '#FFFFFF';
    }
    Array.prototype.forEach.call(btns, function (b) {
      b.addEventListener('click', function () {
        var m = b.getAttribute('data-set');
        root.setAttribute('data-mode', m);
        try { localStorage.setItem('ns-mode', m); } catch (e) {}
        sync();
      });
    });
    try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', sync); } catch (e) {}
    sync();
  }

  /* ---------- montagem ---------- */
  function render(dados) {
    var c = limpar(dados);
    renderPerfil(c.perfil);
    renderLinks(c.links);
    car.todos = c.projetos;
    if (car.filtro !== 'Todos' && !car.todos.some(function (s) { return s.projeto === car.filtro; })) car.filtro = 'Todos';
    renderFiltros();
    montarSlides();
  }

  $('ano').textContent = String(new Date().getFullYear());
  ligarTema();
  ligarCarrossel();
  render(window.CONTEUDO);

  /* Pré-visualização do editor local.
     Só funciona quando a página é aberta como arquivo no seu computador (file://).
     No site publicado (https://) este bloco não faz nada. */
  if (location.protocol === 'file:' && window.parent !== window) {
    window.addEventListener('message', function (e) {
      if (e.source !== window.parent) return;
      var d = e.data;
      if (d && d.tipo === 'ns-previa' && d.conteudo) render(d.conteudo);
    });
    try { window.parent.postMessage({ tipo: 'ns-pronto' }, '*'); } catch (e) {}
  }
})();
