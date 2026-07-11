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
})();
