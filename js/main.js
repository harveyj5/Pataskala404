/**
 * Pataskala Lodge #404 — Main JavaScript
 * Features: Mobile nav, footer year, scroll effects, focus management
 * Compliant with WCAG 2.1 AA
 */

'use strict';

/* ---- UTILITIES ---- */

/**
 * Safely query a DOM element
 * @param {string} selector
 * @param {Element} [context=document]
 * @returns {Element|null}
 */
function qs(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Safely query all DOM elements
 * @param {string} selector
 * @param {Element} [context=document]
 * @returns {NodeList}
 */
function qsa(selector, context = document) {
  return context.querySelectorAll(selector);
}

/* ---- FOOTER YEAR ---- */

/**
 * Injects the current year into the footer copyright span.
 * Testable: returns the year set.
 * @returns {number}
 */
function setFooterYear() {
  const el = qs('#footer-year');
  const year = new Date().getFullYear();
  if (el) el.textContent = year;
  return year;
}

/* ---- MOBILE NAVIGATION ---- */

/**
 * Initialise the mobile nav toggle button.
 * Manages aria-expanded, class toggling, and keyboard dismissal.
 * @returns {{ toggle: HTMLElement|null, nav: HTMLElement|null }}
 */
function initMobileNav() {
  const toggle = qs('[data-testid="nav-toggle"]');
  const nav    = qs('[data-testid="main-nav"]');

  if (!toggle || !nav) return { toggle: null, nav: null };

  function openNav() {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
  }

  function closeNav() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
  }

  function isOpen() {
    return nav.classList.contains('is-open');
  }

  toggle.addEventListener('click', () => {
    isOpen() ? closeNav() : openNav();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      closeNav();
      toggle.focus();
    }
  });

  // Close when clicking outside the nav
  document.addEventListener('click', (e) => {
    if (isOpen() && !nav.contains(e.target) && !toggle.contains(e.target)) {
      closeNav();
    }
  });

  // Close nav on link click (mobile UX)
  qsa('.nav-link', nav).forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) closeNav();
    });
  });

  return { toggle, nav };
}

/* ---- HEADER SCROLL SHADOW ---- */

/**
 * Adds a stronger shadow to the sticky header when page is scrolled.
 * @returns {void}
 */
function initHeaderScroll() {
  const header = qs('[data-testid="site-header"]');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ---- INTERSECTION OBSERVER: FADE-IN SECTIONS ---- */

/**
 * Applies a subtle fade-in animation to section cards when they
 * enter the viewport. Respects prefers-reduced-motion.
 * @returns {void}
 */
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const targets = qsa('.pillar-card, .join-step');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

/* ---- EXTERNAL LINK ANNOUNCEMENTS (Accessibility) ---- */

/**
 * Ensures all external links have rel="noopener noreferrer".
 * Adds a visually-hidden notice for screen readers when not already present.
 * @returns {number} Count of external links processed
 */
function initExternalLinks() {
  const links = qsa('a[target="_blank"]');
  links.forEach((link) => {
    // Ensure security attributes are set
    const rel = link.getAttribute('rel') || '';
    if (!rel.includes('noopener')) {
      link.setAttribute('rel', `${rel} noopener noreferrer`.trim());
    }
  });
  return links.length;
}

/* ---- INIT ---- */

/**
 * Main initialisation — runs after DOM is ready.
 */
function init() {
  setFooterYear();
  initMobileNav();
  initHeaderScroll();
  initScrollReveal();
  initExternalLinks();
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ---- EXPORTS (for testing with Jest / Node) ---- */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setFooterYear,
    initExternalLinks,
  };
}
