'use strict';

/*
  FIX FOR FADING PAGES:
  Add .js-loaded to <body> IMMEDIATELY — this is the very first line.
  The CSS only hides .fade-in elements when .js-loaded is on the body.
  This means elements are always visible until JS is ready to control them.
  Without this, opacity:0 fires before JS runs = blank/faded page on load.
*/
document.documentElement.classList.add('js-loaded');

document.addEventListener('DOMContentLoaded', () => {

  // Also add to body as backup (documentElement covers <html>)
  document.body.classList.add('js-loaded');

  // ===== 1. NAVBAR SCROLL BEHAVIOR =====

  /**
   * Adds/removes 'scrolled' class on .header based on scroll position.
   * Inner pages already have 'scrolled' by default via HTML class.
   */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ===== 2. MOBILE MENU TOGGLE =====

  /**
   * Toggles the 'open' class on .nav-links when the hamburger is clicked.
   * Also creates and appends a close (✕) button inside the open menu.
   */
  const toggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-close';
    closeBtn.innerHTML = '&#10005;';
    closeBtn.setAttribute('aria-label', 'Close menu');
    navLinks.prepend(closeBtn);

    toggle.addEventListener('click', () => {
      navLinks.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== 3. SCROLL REVEAL (IntersectionObserver) =====

  /**
   * Elements already visible in the viewport on page load get 'visible'
   * applied immediately. Elements below the fold animate in on scroll.
   */
  if (document.querySelector('.fade-in')) {

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    document.querySelectorAll('.fade-in').forEach(el => {
      const rect = el.getBoundingClientRect();
      const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (alreadyVisible) {
        // Already on screen — show immediately with no animation
        el.classList.add('visible');
      } else {
        // Below the fold — animate in when scrolled to
        observer.observe(el);
      }
    });
  }

  // ===== 4. STATS COUNTER ANIMATION =====

  /**
   * Animates .stat-number elements from 0 to their data-target value
   * using requestAnimationFrame over 2500ms with cubic ease-out.
   */
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-number').forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            if (isNaN(target)) return;
            const duration = 2500;
            const start = performance.now();
            const tick = (now) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.round(eased * target);
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsBar);
  }

  // ===== 5. FAQ ACCORDION =====

  /**
   * Toggles the 'open' class on .faq-item when its button is clicked.
   * Only one item can be open at a time (accordion behaviour).
   */
  if (document.querySelector('.faq-question')) {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  // ===== 6. ACTIVE NAV LINK DETECTION =====

  /**
   * Adds 'active' class to whichever nav link href matches the current page.
   */
  if (document.querySelector('.nav-links')) {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a:not(.btn)').forEach(link => {
      const href = link.getAttribute('href').replace('./', '');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

});