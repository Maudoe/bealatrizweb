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
  document.querySelectorAll('[data-ph-en]').forEach(function (el) {
    var v = el.getAttribute('data-ph-' + LANG);
    if (v != null) el.placeholder = v;
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

// ---- Carrusel del hero (cross-fade + Ken Burns + dots) ----
(function () {
  var srcs = ['assets/hero1.jpg', 'assets/hero2.jpg', 'assets/hero3.jpg', 'assets/hero4.jpg', 'assets/hero.jpg'];
  var host = document.getElementById('heroSlides');
  var dotsHost = document.getElementById('heroDots');
  if (!host) return;
  var slides = [], dots = [], idx = 0, timer;
  function show(i) {
    if (!slides.length) return;
    slides[idx].classList.remove('on'); if (dots[idx]) dots[idx].classList.remove('on');
    idx = (i + slides.length) % slides.length;
    slides[idx].classList.add('on'); if (dots[idx]) dots[idx].classList.add('on');
  }
  function start() { clearInterval(timer); if (slides.length > 1) timer = setInterval(function () { show(idx + 1); }, 5000); }
  srcs.forEach(function (src) {
    var im = new Image();
    im.onload = function () {
      var d = document.createElement('div');
      d.className = 'hero-slide';
      d.style.backgroundImage = "url('" + src + "')";
      host.appendChild(d); slides.push(d);
      if (dotsHost) {
        var dot = document.createElement('i'); var mine = slides.length - 1;
        dot.addEventListener('click', function () { show(mine); start(); });
        dotsHost.appendChild(dot); dots.push(dot);
      }
      if (slides.length === 1) { d.classList.add('on'); if (dots[0]) dots[0].classList.add('on'); }
      start();
    };
    im.src = src; // si no existe, onload no dispara y no se agrega (sin imágenes rotas)
  });
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

// ---- Galería: 4 placas que rotan fotos al azar (cross-fade) ----
(function () {
  var wrap = document.getElementById('galGrid');
  if (!wrap) return;
  var N = 14, TILES = 4;               // fotos totales (g1..gN) y cantidad de placas
  var pool = [];
  for (var i = 1; i <= N; i++) pool.push('assets/gallery/g' + i + '.jpg');
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  for (var t = 0; t < TILES; t++) {
    var tile = document.createElement('div'); tile.className = 'gtile';
    var la = document.createElement('div'), lb = document.createElement('div');
    la.className = 'gl on'; lb.className = 'gl';
    tile.appendChild(la); tile.appendChild(lb); wrap.appendChild(tile);
    var order = shuffle(pool);
    la.style.backgroundImage = "url('" + order[0] + "')";
    (function (front, back, order) {
      var f = front, b = back, p = 0;
      function tick() {
        p = (p + 1) % order.length;
        b.style.backgroundImage = "url('" + order[p] + "')";
        b.classList.add('on'); f.classList.remove('on');
        var tmp = f; f = b; b = tmp;                 // swap capas
        setTimeout(tick, 3200 + Math.random() * 3400); // 3.2–6.6 s, distinto cada vez
      }
      setTimeout(tick, 1500 + Math.random() * 3500);   // arranque escalonado
    })(la, lb, order);
  }
})();

// ---- Equipo (modales) ----
var TEAM = {
  bee:  { name: 'Bee',  img: 'assets/team/bee.jpg',  role_en: 'Instructor · Scolio-Pilates certified', role_th: 'ครูผู้สอน · ได้รับการรับรอง Scolio-Pilates',
    bio_en: 'Bee is a certified Pilates instructor with specialised training in Scolio-Pilates — the method for scoliosis and postural conditions. She leads Bealatriz’s health workshops together with physiotherapists and doctors, including sessions on posture and office syndrome. For Bee, Pilates is not only movement, but a way to truly understand and care for your body.',
    bio_th: 'ครู Bee เป็นครูสอนพิลาทิสที่ได้รับการรับรอง และมีการอบรมเฉพาะทางด้าน Scolio-Pilates ซึ่งเป็นวิธีสำหรับกระดูกสันหลังคดและปัญหาท่าทาง เธอเป็นผู้นำเวิร์กช็อปสุขภาพของ Bealatriz ร่วมกับนักกายภาพบำบัดและแพทย์ รวมถึงหัวข้อท่าทางและออฟฟิศซินโดรม สำหรับครู Bee พิลาทิสไม่ใช่แค่การเคลื่อนไหว แต่เป็นวิธีทำความเข้าใจและดูแลร่างกายอย่างแท้จริง' },
  aida: { name: 'Aida', img: 'assets/team/aida.jpg', role_en: 'Instructor', role_th: 'ครูผู้สอน',
    bio_en: 'Aida is a dedicated Pilates instructor who loves helping clients move better and feel stronger. She brings warmth, precision and patience to every class — whether it’s your very first session or your hundredth.',
    bio_th: 'ครู Aida เป็นครูสอนพิลาทิสที่ทุ่มเท ชอบช่วยให้ลูกค้าเคลื่อนไหวได้ดีขึ้นและแข็งแรงขึ้น เธอใส่ใจ อบอุ่น และอดทนในทุกคลาส ไม่ว่าจะเป็นครั้งแรกหรือครั้งที่ร้อยของคุณ' },
  ai:   { name: 'Ai',   img: 'assets/team/ai.jpg',   role_en: 'Instructor', role_th: 'ครูผู้สอน',
    bio_en: 'Ai is a passionate Pilates instructor focused on control, breath and mindful movement. She creates a calm, supportive space so every client can progress safely at their own pace.',
    bio_th: 'ครู Ai เป็นครูสอนพิลาทิสที่มีใจรัก เน้นการควบคุม การหายใจ และการเคลื่อนไหวอย่างมีสติ เธอสร้างบรรยากาศที่สงบและเป็นกำลังใจ เพื่อให้ทุกคนก้าวหน้าได้อย่างปลอดภัยตามจังหวะของตัวเอง' }
};
function openTeam(id) {
  var t = TEAM[id]; if (!t) return;
  var lang = (typeof LANG !== 'undefined') ? LANG : 'en';
  document.getElementById('tmName').textContent = t.name;
  document.getElementById('tmRole').textContent = (lang === 'th') ? t.role_th : t.role_en;
  document.getElementById('tmBio').textContent = (lang === 'th') ? t.bio_th : t.bio_en;
  var av = document.getElementById('tmAvatar');
  var im = new Image();
  av.style.backgroundImage = "url('" + t.img + "')";
  im.onerror = function () { av.style.backgroundImage = 'linear-gradient(135deg,var(--accent),var(--accent2))'; };
  im.src = t.img;
  document.getElementById('teamModal').hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeTeam() {
  var m = document.getElementById('teamModal'); if (m) m.hidden = true;
  document.body.style.overflow = '';
}
// ===== Booking: tipo -> datos -> calendario =====
var CRM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyUboSnNfLWwwx28pUqIErWkP4OdzNGved9QPAYkRUbM08sjz7QRERkO9FwQACk0yWE/exec';
var _bookType = null;
function _bid(id) { return document.getElementById(id); }
function resetBook() {
  var s1 = _bid('bookStep1'), s2 = _bid('bookStep2'), f = _bid('bookForm'), msg = _bid('bookMsg'), btn = _bid('bookGo');
  if (s1) s1.hidden = false; if (s2) s2.hidden = true;
  if (f) f.reset(); if (msg) { msg.hidden = true; msg.className = 'cform-msg'; }
  if (btn) btn.disabled = true;
  _bookType = null;
}
function openBook() { resetBook(); var m = _bid('bookModal'); if (m) { m.hidden = false; document.body.style.overflow = 'hidden'; } }
function closeBook() { var m = _bid('bookModal'); if (m) m.hidden = true; document.body.style.overflow = ''; }
function pickType(t) {
  _bookType = t;
  var lang = (typeof LANG !== 'undefined') ? LANG : 'en';
  var lbl = _bid('bookTypeLabel');
  if (lbl) lbl.textContent = (t === 'group') ? (lang === 'th' ? 'คลาสกลุ่ม' : 'Group class') : (lang === 'th' ? 'ส่วนตัว / คู่' : 'Private / Duo');
  _bid('bookStep1').hidden = true; _bid('bookStep2').hidden = false;
  validateBook();
  var n = _bid('bkName'); if (n) setTimeout(function () { n.focus(); }, 60);
}
function bookBack() { _bid('bookStep2').hidden = true; _bid('bookStep1').hidden = false; }
function validateBook() {
  var n = _bid('bkName'), l = _bid('bkLast'), e = _bid('bkEmail'), p = _bid('bkPhone'), d = _bid('bkDate'), ti = _bid('bkTime'), btn = _bid('bookGo');
  if (!btn) return;
  var ok = n.value.trim() && l.value.trim() && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.value.trim()) && p.value.trim().length >= 6 && d && d.value && ti && ti.value;
  btn.disabled = !ok;
}
(function () {
  ['bkName', 'bkLast', 'bkEmail', 'bkPhone', 'bkDate', 'bkTime'].forEach(function (id) { var el = _bid(id); if (el) { el.addEventListener('input', validateBook); el.addEventListener('change', validateBook); } });
  var form = _bid('bookForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    validateBook();
    if (_bid('bookGo').disabled || !_bookType) return;
    var lang = (typeof LANG !== 'undefined') ? LANG : 'en';
    var body = new URLSearchParams({
      name: _bid('bkName').value.trim(),
      surname: _bid('bkLast').value.trim(),
      email: _bid('bkEmail').value.trim(),
      phone: _bid('bkPhone').value.trim(),
      date: _bid('bkDate').value,
      time: _bid('bkTime').value,
      class_type: _bookType === 'group' ? 'Group' : 'Private/Duo',
      studio_preference: _bid('bkPref') ? _bid('bkPref').value.trim() : ''
    });
    fetch(CRM_ENDPOINT, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() }).catch(function () {});
    var msg = _bid('bookMsg');
    if (msg) { msg.textContent = (lang === 'th' ? 'ส่งคำขอจองแล้ว! เราจะติดต่อกลับเพื่อยืนยันคลาสของคุณ' : 'Booking request sent! We’ll contact you to confirm your class.'); msg.className = 'cform-msg ok'; msg.hidden = false; }
    var gb = _bid('bookGo'); if (gb) gb.disabled = true;
    setTimeout(closeBook, 3400);
  });
})();
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeTeam(); closeBook(); } });

// ---- Testimonios: carousel con auto-avance ----
(function () {
  var track = document.getElementById('tstTrack'), dots = document.getElementById('tstDots');
  if (!track) return;
  var n = track.children.length, i = 0, timer = null;
  for (var k = 0; k < n; k++) {
    var d = document.createElement('i');
    d.addEventListener('click', (function (idx) { return function () { go(idx); }; })(k));
    dots.appendChild(d);
  }
  function render() {
    track.style.transform = 'translateX(-' + (i * 100) + '%)';
    Array.prototype.forEach.call(dots.children, function (el, idx) { el.classList.toggle('on', idx === i); });
  }
  function go(idx) { i = (idx + n) % n; render(); restart(); }
  function restart() { clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 6500); }
  window.tstShift = function (dir) { go(i + dir); };
  var box = track.closest('.tst');
  if (box) { box.addEventListener('mouseenter', function () { clearInterval(timer); }); box.addEventListener('mouseleave', restart); }
  render(); restart();
})();

// ---- FX: cambio de tono al scrollear + glow que sigue el cursor ----
(function () {
  var root = document.documentElement, cg = document.querySelector('.cursor-glow');
  function onScroll() {
    var h = root.scrollHeight - window.innerHeight;
    var p = h > 0 ? window.scrollY / h : 0;
    root.style.setProperty('--scrollhue', (p * 300).toFixed(1) + 'deg');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  var fine = window.matchMedia('(pointer:fine)').matches;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (cg && fine && !reduce) {
    document.body.classList.add('has-cursor');
    var rx = window.innerWidth / 2, ry = window.innerHeight / 2, cx = rx, cy = ry, raf = null;
    window.addEventListener('mousemove', function (e) { rx = e.clientX; ry = e.clientY; if (!raf) raf = requestAnimationFrame(tick); });
    function tick() {
      cx += (rx - cx) * 0.16; cy += (ry - cy) * 0.16;
      cg.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px) translate(-50%,-50%)';
      raf = (Math.abs(rx - cx) > 0.4 || Math.abs(ry - cy) > 0.4) ? requestAnimationFrame(tick) : null;
    }
  }
})();

// Mostrar la inicial en las tarjetas del equipo mientras no exista la foto
document.querySelectorAll('.tavatar').forEach(function (av) {
  var m = (av.style.backgroundImage || '').match(/url\(["']?([^"')]+)["']?\)/);
  if (!m) { av.classList.add('noimg'); return; }
  var im = new Image();
  im.onerror = function () { av.classList.add('noimg'); av.style.backgroundImage = 'none'; };
  im.src = m[1];
});

// ---- Formulario de contacto (envío por AJAX a FormSubmit) ----
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;
  var btn = document.getElementById('cformBtn');
  var msg = document.getElementById('cformMsg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form._honey && form._honey.value) return; // honeypot anti-spam
    var lang = (typeof LANG !== 'undefined') ? LANG : 'en';
    var sending = (lang === 'th') ? 'กำลังส่ง…' : 'Sending…';
    var okTxt = (lang === 'th') ? 'ขอบคุณ! เราจะติดต่อกลับเร็ว ๆ นี้ ✓' : 'Thanks! We\'ll get back to you soon ✓';
    var errTxt = (lang === 'th') ? 'เกิดข้อผิดพลาด ลองใหม่ หรือติดต่อทาง LINE' : 'Something went wrong. Please try again or reach us on LINE.';
    var orig = btn.textContent;
    btn.disabled = true; btn.textContent = sending; msg.hidden = true;
    fetch(form.action, { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && (d.success === 'true' || d.success === true)) {
          form.reset();
          msg.textContent = okTxt; msg.className = 'cform-msg ok'; msg.hidden = false;
        } else { throw new Error('fail'); }
        btn.textContent = orig; btn.disabled = false;
      })
      .catch(function () {
        msg.textContent = errTxt; msg.className = 'cform-msg err'; msg.hidden = false;
        btn.textContent = orig; btn.disabled = false;
      });
  });
})();
