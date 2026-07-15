// Shared UI behaviour for all pages.
(function () {
  'use strict';

  // Mobile navigation toggle.
  var toggle = document.querySelector('[data-nav-toggle]');
  var menu = document.querySelector('[data-nav-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('hidden') === false;
      toggle.setAttribute('aria-expanded', String(open));
    });
    // Close menu when a link is clicked (mobile).
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < 768) {
          menu.classList.add('hidden');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Highlight the current page in the nav.
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-menu] a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === path) {
      link.classList.add('bg-brand-100', 'text-brand-900');
    }
  });

  // Footer year.
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Floating quick-contact buttons (Zalo + gọi điện) on every page.
  var fab = document.createElement('div');
  fab.className = 'fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3';
  fab.innerHTML =
    '<a href="https://zalo.me/0919666115" target="_blank" rel="noopener" aria-label="Nhắn Zalo" ' +
    'class="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white shadow-lg ring-2 ring-white transition hover:bg-brand-700">Zalo</a>' +
    '<a href="tel:0919666115" aria-label="Gọi điện" ' +
    'class="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl text-white shadow-lg ring-2 ring-white transition hover:opacity-90">☎️</a>';
  document.body.appendChild(fab);
})();
