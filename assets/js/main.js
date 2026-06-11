/**
 * SoireeWeb — Main JavaScript
 * Navigation, Scroll Effects, Mobile Menu, Back-to-Top
 * Wedding Coordination & Event Planning — Philippines
 */

'use strict';

/* ============================================================
   1. DOM Ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavigation();
  initMobileMenu();
  initBackToTop();
  initSmoothScroll();
  setActiveNavLink();
  initPageTransition();
  initLazyImages();
});

/* ============================================================
   2. Scroll Progress Bar
   ============================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = `${Math.min(progress, 100)}%`;
  }, { passive: true });
}

/* ============================================================
   3. Navigation — Sticky + Transparent-to-Solid
   ============================================================ */
function initNavigation() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const heroSection = document.querySelector('.hero');
  const isHeroPage  = !!heroSection;

  function updateNav() {
    const scrollY = window.scrollY;

    if (isHeroPage) {
      if (scrollY > 60) {
        nav.classList.add('scrolled');
        nav.classList.remove('transparent');
      } else {
        nav.classList.remove('scrolled');
        nav.classList.add('transparent');
      }
    } else {
      // Inner pages — always solid
      nav.classList.add('scrolled');
      nav.classList.remove('transparent');
    }
  }

  // Initial state
  if (isHeroPage) {
    nav.classList.add('transparent');
  } else {
    nav.classList.add('scrolled');
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

/* ============================================================
   4. Mobile Menu Toggle
   ============================================================ */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay    = document.getElementById('menu-overlay');

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    document.body.style.overflow = '';
    if (overlay) overlay.classList.add('active');
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    if (overlay) overlay.classList.remove('active');
  }

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close on overlay click
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close when a mobile link is clicked
  mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close on window resize (tablet breakpoint)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ============================================================
   5. Back to Top Button
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   6. Smooth Scroll for Anchor Links
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const nav    = document.getElementById('main-nav');
      const offset = nav ? nav.offsetHeight + 20 : 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  });
}

/* ============================================================
   7. Active Nav Link (based on current page)
   ============================================================ */
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const filename    = currentPath.split('/').pop() || 'index.html';

  // Desktop links
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkFile = href.split('/').pop();

    if (
      linkFile === filename ||
      (filename === '' && linkFile === 'index.html') ||
      (filename === 'index.html' && (linkFile === 'index.html' || linkFile === ''))
    ) {
      link.classList.add('active');
    }
  });

  // Mobile links
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkFile = href.split('/').pop();

    if (
      linkFile === filename ||
      (filename === '' && linkFile === 'index.html') ||
      (filename === 'index.html' && (linkFile === 'index.html' || linkFile === ''))
    ) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   8. Page Transition (Fade In)
   ============================================================ */
function initPageTransition() {
  document.body.classList.add('page-transition');
}

/* ============================================================
   9. Lazy Image Loading (Intersection Observer)
   ============================================================ */
function initLazyImages() {
  if (!('IntersectionObserver' in window)) return;

  const lazyImages = document.querySelectorAll('img[data-src]');
  if (!lazyImages.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '200px 0px',
    threshold: 0.01
  });

  lazyImages.forEach(img => observer.observe(img));
}

/* ============================================================
   10. Utility Functions (exposed globally)
   ============================================================ */

/**
 * Debounce helper
 */
function debounce(fn, delay = 200) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle helper
 */
function throttle(fn, limit = 100) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Format number with commas
 */
function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Trap focus within a modal/overlay for accessibility
 */
function trapFocus(element) {
  const focusable = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

// Expose utilities
window.SoireeUtils = { debounce, throttle, formatNumber, trapFocus };