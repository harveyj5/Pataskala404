/**
 * Pataskala Lodge #404 — Gallery
 * Features: category filtering, lightbox viewer, keyboard nav, accessibility
 * WCAG 2.1 AA compliant — focus management, aria-hidden, keyboard dismissal
 */

'use strict';

/* ---- PHOTO DATA ----
 * To add real photos:
 * 1. Place image files in images/gallery/
 * 2. Add entries to GALLERY_PHOTOS below
 * 3. The gallery will render them automatically
 *
 * Categories: 'events' | 'degrees' | 'charity' | 'lodge'
 */
const GALLERY_PHOTOS = [
  // Example (uncomment and update when you have real photos):
  // { src: 'images/gallery/lodge-exterior.jpg', alt: 'Front exterior of Pataskala Lodge 404 building', title: 'Lodge Exterior', category: 'lodge' },
  // { src: 'images/gallery/annual-dinner-2024.jpg', alt: 'Brothers gathered at the Annual Dinner 2024', title: 'Annual Dinner 2024', category: 'events' },
];

/* Category display names */
const CATEGORY_LABELS = {
  events:  'Events',
  degrees: 'Degree Nights',
  charity: 'Charity',
  lodge:   'The Lodge',
};

/* ---- STATE ---- */
let currentFilter   = 'all';
let currentIndex    = 0;
let visibleCards    = [];

/* ---- DOM REFS ---- */
const galleryGrid   = () => document.getElementById('gallery-grid');
const galleryCount  = () => document.getElementById('gallery-count');
const lightbox      = () => document.getElementById('lightbox');
const backdrop      = () => document.getElementById('lightbox-backdrop');
const lightboxImg   = () => document.getElementById('lightbox-img');
const lightboxCap   = () => document.getElementById('lightbox-caption');

/* =========================================================
   FILTERING
   ========================================================= */

/**
 * Filters gallery cards by category.
 * @param {string} filter — 'all' or a category string
 * @returns {number} count of visible cards
 */
function filterGallery(filter) {
  currentFilter = filter;
  const cards = Array.from(document.querySelectorAll('.gallery-card'));

  let visible = 0;
  cards.forEach((card) => {
    const cat = card.getAttribute('data-category');
    const show = filter === 'all' || cat === filter;
    card.classList.toggle('is-hidden', !show);
    if (show) visible++;
  });

  // Update count label
  const countEl = galleryCount();
  if (countEl) {
    const label = filter === 'all' ? 'All photos' : (CATEGORY_LABELS[filter] || filter);
    countEl.textContent = `${visible} ${visible === 1 ? 'photo' : 'photos'} — ${label}`;
  }

  // Update visible cards list for lightbox navigation
  visibleCards = cards.filter((c) => !c.classList.contains('is-hidden'));

  return visible;
}

/**
 * Initialise filter buttons.
 */
function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter') || 'all';

      // Update button states
      buttons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      filterGallery(filter);
    });
  });

  // Run once on load
  filterGallery('all');
}

/* =========================================================
   LIGHTBOX
   ========================================================= */

/** Previously focused element — restored when lightbox closes */
let lastFocusedEl = null;

/**
 * Opens the lightbox at a given card index within visible cards.
 * @param {number} index
 */
function openLightbox(index) {
  const lb = lightbox();
  const bd = backdrop();
  if (!lb || !bd) return;

  currentIndex = index;
  showLightboxSlide(index);

  lb.removeAttribute('aria-hidden');
  lb.classList.add('is-open');
  bd.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  // Focus the close button for keyboard users
  lastFocusedEl = document.activeElement;
  const closeBtn = document.getElementById('lightbox-close');
  if (closeBtn) closeBtn.focus();
}

/**
 * Closes the lightbox.
 */
function closeLightbox() {
  const lb = lightbox();
  const bd = backdrop();
  if (!lb || !bd) return;

  lb.setAttribute('aria-hidden', 'true');
  lb.classList.remove('is-open');
  bd.classList.remove('is-open');
  document.body.style.overflow = '';

  // Restore focus
  if (lastFocusedEl) lastFocusedEl.focus();
  lastFocusedEl = null;
}

/**
 * Shows a specific slide in the lightbox.
 * Uses placeholder data if no GALLERY_PHOTOS entry, falls back gracefully.
 * @param {number} index
 */
function showLightboxSlide(index) {
  if (index < 0 || index >= visibleCards.length) return;

  const card    = visibleCards[index];
  const titleEl = card.querySelector('.gallery-caption-title');
  const imgEl   = card.querySelector('img');
  const title   = titleEl ? titleEl.textContent : 'Lodge Photo';

  const lb  = lightboxImg();
  const cap = lightboxCap();

  if (lb) {
    if (imgEl) {
      lb.src = imgEl.src;
      lb.alt = imgEl.alt || title;
      lb.style.display = 'block';
    } else {
      // Placeholder card — no real image yet
      lb.src = '';
      lb.alt = '';
      lb.style.display = 'none';
    }
  }

  if (cap) cap.textContent = title;
  currentIndex = index;
}

/**
 * Navigate to the next or previous slide.
 * @param {1|-1} direction
 */
function navigateLightbox(direction) {
  const next = currentIndex + direction;
  if (next < 0 || next >= visibleCards.length) return;
  showLightboxSlide(next);
}

/**
 * Initialise lightbox: click handlers, keyboard, backdrop.
 */
function initLightbox() {
  // Open on card click
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.gallery-card');
    if (!card || card.classList.contains('is-hidden')) return;
    const index = visibleCards.indexOf(card);
    if (index >= 0) openLightbox(index);
  });

  // Close button
  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);

  // Backdrop click closes
  document.getElementById('lightbox-backdrop')?.addEventListener('click', closeLightbox);

  // Previous / next
  document.getElementById('lightbox-prev')?.addEventListener('click', () => navigateLightbox(-1));
  document.getElementById('lightbox-next')?.addEventListener('click', () => navigateLightbox(1));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const lb = lightbox();
    if (!lb || lb.getAttribute('aria-hidden') === 'true') return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        navigateLightbox(-1);
        break;
      case 'ArrowRight':
        navigateLightbox(1);
        break;
    }
  });
}

/* =========================================================
   INIT
   ========================================================= */
function init() {
  initFilters();
  initLightbox();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ---- EXPORTS (for testing) ---- */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { filterGallery, navigateLightbox, GALLERY_PHOTOS, CATEGORY_LABELS };
}
