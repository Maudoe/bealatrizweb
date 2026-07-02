/* ===========================================================
   Bealatriz Pilates Studio — main.js
   =========================================================== */

// ---- Header: fondo sólido al hacer scroll ----
var hdr = document.getElementById('hdr');
function onScroll() {
  if (window.scrollY > 40) hdr.classList.add('scrolled');
  else hdr.classList.remove('scrolled');
}
window.addEventListener('scroll', onScroll);
onScroll();

// ---- Menú hamburguesa (mobile) ----
document.getElementById('burger').addEventListener('click', function () {
  document.getElementById('menu').classList.toggle('open');
});
document.querySelectorAll('#menu a').forEach(function (a) {
  a.addEventListener('click', function () {
    document.getElementById('menu').classList.remove('open');
  });
});

// ---- Idioma: Inglés <-> Tailandés ----
var LANG = 'en';
try { LANG = localStorage.getItem('bz_lang') || 'en'; } catch (e) {}

function setLang(l) {
  LANG = (l === 'th') ? 'th' : 'en';
  document.documentElement.lang = LANG;
  document.body.classList.toggle('th', LANG === 'th');
  document.querySelectorAll('[data-en]').forEach(function (el) {
    var v = el.getAttribute('data-' + LANG);
    if (v != null) el.textContent = v;
  });
  var t = document.getElementById('langToggle');
  if (t) t.textContent = (LANG === 'en') ? 'ไทย' : 'EN';
  try { localStorage.setItem('bz_lang', LANG); } catch (e) {}
}

document.getElementById('langToggle').addEventListener('click', function () {
  setLang(LANG === 'en' ? 'th' : 'en');
  document.getElementById('menu').classList.remove('open');
});

setLang(LANG);

// ---- Carrusel del hero (cross-fade + Ken Burns) ----
(function () {
  var srcs = ['assets/hero1.jpg', 'assets/hero2.jpg', 'assets/hero3.jpg', 'assets/hero4.jpg', 'assets/hero.jpg'];
  var host = document.getElementById('heroSlides');
  if (!host) return;
  var slides = [];
  srcs.forEach(function (src) {
    var im = new Image();
    im.onload = function () {
      var d = document.createElement('div');
      d.className = 'hero-slide';
      d.style.backgroundImage = "url('" + src + "')";
      host.appendChild(d);
      slides.push(d);
      if (slides.length === 1) d.classList.add('on'); // primera foto cargada = visible
    };
    im.src = src; // si no existe, onload no dispara y no se agrega (sin imágenes rotas)
  });
  var idx = 0;
  setInterval(function () {
    if (slides.length < 2) return;            // con 1 sola foto queda estática
    slides[idx].classList.remove('on');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('on');
  }, 5000);
})();

// ---- Aparición suave de secciones al hacer scroll ----
(function () {
  var els = document.querySelectorAll('.info-cell, #estudio .center, .quote .center, #clases .center, .ccard, #galeria .center, .gitem, .cta .center, .foot-grid > div');
  els.forEach(function (el) { el.classList.add('reveal'); });
  // escalonado en grupos (tarjetas y galería)
  ['.cards .ccard', '.gallery .gitem'].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el, i) { el.style.transitionDelay = (i * 0.09) + 's'; });
  });
  if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (el) { io.observe(el); });
})();
