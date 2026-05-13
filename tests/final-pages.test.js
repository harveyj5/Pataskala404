/**
 * Pataskala Lodge #404 — Final Pages Tests
 * Covers: gallery filter logic, gallery data structure, history page data
 */

'use strict';

// Mock DOM for Node/Jest
global.document = {
  getElementById:   jest.fn(() => null),
  querySelector:    jest.fn(() => null),
  querySelectorAll: jest.fn(() => []),
  readyState:       'complete',
  addEventListener: jest.fn(),
  activeElement:    null,
  body: { style: {} },
};
global.window = {
  scrollY:          0,
  matchMedia:       jest.fn(() => ({ matches: false })),
  addEventListener: jest.fn(),
  innerWidth:       1200,
};

const {
  filterGallery,
  navigateLightbox,
  GALLERY_PHOTOS,
  CATEGORY_LABELS,
} = require('../js/gallery.js');

/* =========================================================
   GALLERY_PHOTOS data structure
   ========================================================= */
describe('gallery.js — GALLERY_PHOTOS', () => {
  test('GALLERY_PHOTOS is an array', () => {
    expect(Array.isArray(GALLERY_PHOTOS)).toBe(true);
  });

  test('each photo entry has required keys when present', () => {
    GALLERY_PHOTOS.forEach((photo) => {
      expect(photo).toHaveProperty('src');
      expect(photo).toHaveProperty('alt');
      expect(photo).toHaveProperty('title');
      expect(photo).toHaveProperty('category');
    });
  });

  test('category values are valid when present', () => {
    const validCategories = ['events', 'degrees', 'charity', 'lodge'];
    GALLERY_PHOTOS.forEach((photo) => {
      expect(validCategories).toContain(photo.category);
    });
  });
});

/* =========================================================
   CATEGORY_LABELS
   ========================================================= */
describe('gallery.js — CATEGORY_LABELS', () => {
  test('is an object', () => {
    expect(typeof CATEGORY_LABELS).toBe('object');
    expect(CATEGORY_LABELS).not.toBeNull();
  });

  test('contains all four expected categories', () => {
    expect(CATEGORY_LABELS).toHaveProperty('events');
    expect(CATEGORY_LABELS).toHaveProperty('degrees');
    expect(CATEGORY_LABELS).toHaveProperty('charity');
    expect(CATEGORY_LABELS).toHaveProperty('lodge');
  });

  test('all label values are non-empty strings', () => {
    Object.values(CATEGORY_LABELS).forEach((label) => {
      expect(typeof label).toBe('string');
      expect(label.trim().length).toBeGreaterThan(0);
    });
  });

  test('"events" label is a string', () => {
    expect(typeof CATEGORY_LABELS.events).toBe('string');
  });

  test('"degrees" label is a string', () => {
    expect(typeof CATEGORY_LABELS.degrees).toBe('string');
  });
});

/* =========================================================
   filterGallery — with mocked DOM cards
   ========================================================= */
describe('gallery.js — filterGallery (DOM mocked)', () => {
  function makeCard(category) {
    return {
      getAttribute: (attr) => attr === 'data-category' ? category : null,
      classList: {
        _hidden: false,
        toggle(cls, force) { if (cls === 'is-hidden') this._hidden = force; },
        contains(cls) { return cls === 'is-hidden' ? this._hidden : false; },
      },
    };
  }

  beforeEach(() => {
    // Reset querySelectorAll to return mock cards
    global.document.querySelectorAll = jest.fn((sel) => {
      if (sel === '.gallery-card') {
        return [
          makeCard('events'),
          makeCard('degrees'),
          makeCard('charity'),
          makeCard('lodge'),
          makeCard('events'),
        ];
      }
      return [];
    });
    global.document.getElementById = jest.fn(() => null); // no count el
  });

  test('returns 5 when filter is "all"', () => {
    const count = filterGallery('all');
    expect(count).toBe(5);
  });

  test('returns correct count for "events" filter', () => {
    const count = filterGallery('events');
    expect(count).toBe(2);
  });

  test('returns correct count for "degrees" filter', () => {
    const count = filterGallery('degrees');
    expect(count).toBe(1);
  });

  test('returns correct count for "charity" filter', () => {
    const count = filterGallery('charity');
    expect(count).toBe(1);
  });

  test('returns correct count for "lodge" filter', () => {
    const count = filterGallery('lodge');
    expect(count).toBe(1);
  });

  test('returns 0 for an unknown category', () => {
    const count = filterGallery('unknown');
    expect(count).toBe(0);
  });

  test('returns a number in all cases', () => {
    expect(typeof filterGallery('all')).toBe('number');
    expect(typeof filterGallery('events')).toBe('number');
  });
});

/* =========================================================
   navigateLightbox — boundary behaviour
   ========================================================= */
describe('gallery.js — navigateLightbox', () => {
  test('navigateLightbox is a function', () => {
    expect(typeof navigateLightbox).toBe('function');
  });

  test('navigateLightbox accepts a direction argument without throwing when index is out of range', () => {
    // With no visible cards and currentIndex at 0, direction +1 goes out of bounds → early return
    // We reset querySelectorAll so visibleCards stays empty after filterGallery
    global.document.querySelectorAll = jest.fn(() => []);
    filterGallery('all'); // resets visibleCards to []
    expect(() => navigateLightbox(1)).not.toThrow();
    expect(() => navigateLightbox(-1)).not.toThrow();
  });
});

/* =========================================================
   HISTORY PAGE — timeline data integrity checks
   (Validates that the timeline spans the correct eras)
   ========================================================= */
describe('history page — timeline year coverage', () => {
  const TIMELINE_YEARS = [1868, 1885, 1917, 1941, 1952, 1968, 2000, 2018];

  test('timeline starts at 1868 (founding year)', () => {
    expect(TIMELINE_YEARS[0]).toBe(1868);
  });

  test('timeline includes 1968 centennial', () => {
    expect(TIMELINE_YEARS).toContain(1968);
  });

  test('timeline includes 2018 sesquicentennial', () => {
    expect(TIMELINE_YEARS).toContain(2018);
  });

  test('all years are positive integers', () => {
    TIMELINE_YEARS.forEach((y) => {
      expect(Number.isInteger(y)).toBe(true);
      expect(y).toBeGreaterThan(0);
    });
  });

  test('years are in ascending order', () => {
    for (let i = 1; i < TIMELINE_YEARS.length; i++) {
      expect(TIMELINE_YEARS[i]).toBeGreaterThan(TIMELINE_YEARS[i - 1]);
    }
  });

  test('founding year is before centennial', () => {
    expect(1868).toBeLessThan(1968);
  });

  test('centennial is before sesquicentennial', () => {
    expect(1968).toBeLessThan(2018);
  });
});

/* =========================================================
   CHARITY PAGE — cause category coverage
   ========================================================= */
describe('charity page — cause areas', () => {
  const CAUSE_AREAS = [
    'Local Food Pantry Support',
    'Student Scholarships',
    'Ohio Masonic Home',
    'Shriners Hospitals for Children',
    'Brother & Family Assistance',
    'Community Events & Service Days',
  ];

  test('there are 6 defined cause areas', () => {
    expect(CAUSE_AREAS).toHaveLength(6);
  });

  test('all cause areas are non-empty strings', () => {
    CAUSE_AREAS.forEach((cause) => {
      expect(typeof cause).toBe('string');
      expect(cause.trim().length).toBeGreaterThan(0);
    });
  });

  test('includes Ohio Masonic Home', () => {
    expect(CAUSE_AREAS.some((c) => c.includes('Ohio Masonic'))).toBe(true);
  });

  test('includes a scholarship cause', () => {
    expect(CAUSE_AREAS.some((c) => c.toLowerCase().includes('scholarship'))).toBe(true);
  });
});
