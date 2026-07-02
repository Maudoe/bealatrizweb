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
