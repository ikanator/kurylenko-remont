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

// ── Language Toggle ───────────────────────────────────────
const PL_FLAG = '<svg width="20" height="14" viewBox="0 0 20 14" fill="none"><rect width="20" height="7" fill="#DC143C"/><rect y="7" width="20" height="7" fill="white"/></svg>';
const UA_FLAG = '<svg width="20" height="14" viewBox="0 0 20 14" fill="none"><rect width="20" height="7" fill="#005BBB"/><rect y="7" width="20" height="7" fill="#FFD500"/></svg>';

let lang = localStorage.getItem('krlang') || 'pl';
const langBtn   = document.getElementById('langBtn');
const langLabel = document.getElementById('langLabel');
const langFlag  = document.getElementById('langFlag');

function applyLang(l) {
  document.querySelectorAll('[data-pl]').forEach(el => {
    const v = el.getAttribute('data-' + l) || el.getAttribute('data-pl');
    if (v !== null) el.innerHTML = v;
  });
  if (langLabel) langLabel.textContent = l.toUpperCase();
  if (langFlag)  langFlag.innerHTML = l === 'ua' ? UA_FLAG : PL_FLAG;
  document.documentElement.lang = l === 'ua' ? 'uk' : 'pl';
  localStorage.setItem('krlang', l);
}

if (langBtn) langBtn.addEventListener('click', () => { lang = lang === 'pl' ? 'ua' : 'pl'; applyLang(lang); });
applyLang(lang);

// ── FAQ Accordion ─────────────────────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ── Scroll Reveal ─────────────────────────────────────────
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
