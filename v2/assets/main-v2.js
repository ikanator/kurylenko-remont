/* Kurylenko Remonty Kraków — main.js */
'use strict';

// ── Mobile Menu ──────────────────────────────────────────
const menuBtn   = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeBtn  = document.getElementById('closeMenu');

function openMenu()  { mobileMenu.classList.add('is-open'); document.body.style.overflow = 'hidden'; if(menuBtn) menuBtn.setAttribute('aria-expanded','true'); }
function closeMenu() { mobileMenu.classList.remove('is-open'); document.body.style.overflow = ''; if(menuBtn) menuBtn.setAttribute('aria-expanded','false'); }

if (menuBtn)   menuBtn.addEventListener('click', openMenu);
if (closeBtn)  closeBtn.addEventListener('click', closeMenu);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// ── Language (v2: separate static URLs) ───────────────────
const langBtn = document.getElementById('langBtn');
if (langBtn) langBtn.addEventListener('click', () => { const t = langBtn.getAttribute('data-alt'); if (t && t !== '#') { try { localStorage.setItem('krlang', document.documentElement.lang === 'uk' ? 'pl' : 'ua'); } catch (e) {} location.href = t; } });

// ── FAQ Accordion ─────────────────────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
    document.querySelectorAll('.faq-q').forEach(x => x.setAttribute('aria-expanded', x.closest('.faq-item').classList.contains('open') ? 'true' : 'false'));
  });
});

// ── Scroll Reveal ─────────────────────────────────────────
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
