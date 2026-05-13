/**
 * Pataskala Lodge #404 — Automated Tests
 * Run with: npm test
 *
 * Covers: utility functions, form validation, accessibility attributes
 */

'use strict';

/* =========================================================
   SETUP: Mock browser APIs for Node/Jest environment
   ========================================================= */

// Mock DOM globals
global.document = {
  getElementById: jest.fn(() => null),
  querySelector: jest.fn(() => null),
  querySelectorAll: jest.fn(() => []),
  readyState: 'complete',
  addEventListener: jest.fn(),
};
global.window = {
  scrollY: 0,
  matchMedia: jest.fn(() => ({ matches: false })),
  addEventListener: jest.fn(),
  innerWidth: 1200,
};

/* =========================================================
   UNIT TESTS — main.js
   ========================================================= */
const { setFooterYear, initExternalLinks } = require('../js/main.js');

describe('main.js — setFooterYear', () => {
  test('returns the current year as a number', () => {
    const year = setFooterYear();
    expect(typeof year).toBe('number');
    expect(year).toBe(new Date().getFullYear());
  });

  test('returns a 4-digit year', () => {
    const year = setFooterYear();
    expect(year.toString()).toMatch(/^\d{4}$/);
  });

  test('year is between 2024 and 2100', () => {
    const year = setFooterYear();
    expect(year).toBeGreaterThanOrEqual(2024);
    expect(year).toBeLessThan(2100);
  });
});

describe('main.js — initExternalLinks', () => {
  test('returns a number (count of links processed)', () => {
    const count = initExternalLinks();
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

/* =========================================================
   UNIT TESTS — contact.js
   ========================================================= */
const {
  isNonEmpty,
  isValidEmail,
  validateField,
} = require('../js/contact.js');

/* ---- isNonEmpty ---- */
describe('contact.js — isNonEmpty', () => {
  test('returns true for a normal string', () => {
    expect(isNonEmpty('hello')).toBe(true);
  });

  test('returns true for a string with internal spaces', () => {
    expect(isNonEmpty('John Doe')).toBe(true);
  });

  test('returns false for an empty string', () => {
    expect(isNonEmpty('')).toBe(false);
  });

  test('returns false for a whitespace-only string', () => {
    expect(isNonEmpty('   ')).toBe(false);
  });

  test('returns false for a number type', () => {
    expect(isNonEmpty(42)).toBe(false);
  });

  test('returns false for null', () => {
    expect(isNonEmpty(null)).toBe(false);
  });

  test('returns false for undefined', () => {
    expect(isNonEmpty(undefined)).toBe(false);
  });
});

/* ---- isValidEmail ---- */
describe('contact.js — isValidEmail', () => {
  test('returns true for a standard email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  test('returns true for email with subdomain', () => {
    expect(isValidEmail('brother@lodge.freemason.com')).toBe(true);
  });

  test('returns true for email with plus addressing', () => {
    expect(isValidEmail('user+tag@example.org')).toBe(true);
  });

  test('returns false for missing @', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
  });

  test('returns false for missing domain', () => {
    expect(isValidEmail('user@')).toBe(false);
  });

  test('returns false for missing TLD', () => {
    expect(isValidEmail('user@example')).toBe(false);
  });

  test('returns false for empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  test('returns false for whitespace only', () => {
    expect(isValidEmail('   ')).toBe(false);
  });

  test('strips leading/trailing whitespace before validating', () => {
    expect(isValidEmail('  user@example.com  ')).toBe(true);
  });
});

/* ---- validateField ---- */
describe('contact.js — validateField', () => {
  // first_name
  describe('first_name', () => {
    test('returns null for a valid name', () => {
      expect(validateField('first_name', 'John')).toBeNull();
    });

    test('returns an error string for empty input', () => {
      const result = validateField('first_name', '');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('returns an error string for whitespace only', () => {
      const result = validateField('first_name', '   ');
      expect(typeof result).toBe('string');
    });
  });

  // last_name
  describe('last_name', () => {
    test('returns null for a valid last name', () => {
      expect(validateField('last_name', 'Smith')).toBeNull();
    });

    test('returns an error for an empty last name', () => {
      expect(validateField('last_name', '')).not.toBeNull();
    });
  });

  // email
  describe('email', () => {
    test('returns null for a valid email', () => {
      expect(validateField('email', 'wm@lodge404.com')).toBeNull();
    });

    test('returns an error for an empty email', () => {
      const result = validateField('email', '');
      expect(result).not.toBeNull();
      expect(result).toContain('required');
    });

    test('returns an error for an invalid email format', () => {
      const result = validateField('email', 'notanemail');
      expect(result).not.toBeNull();
      expect(result).toContain('valid');
    });
  });

  // message
  describe('message', () => {
    test('returns null for a sufficiently long message', () => {
      expect(validateField('message', 'I am interested in joining the lodge.')).toBeNull();
    });

    test('returns an error for an empty message', () => {
      expect(validateField('message', '')).not.toBeNull();
    });

    test('returns an error for a message shorter than 10 chars', () => {
      const result = validateField('message', 'Hi');
      expect(result).not.toBeNull();
    });

    test('returns null for a message of exactly 10 characters', () => {
      expect(validateField('message', '1234567890')).toBeNull();
    });
  });

  // unknown field
  describe('unknown field', () => {
    test('returns null for an unrecognized field name', () => {
      expect(validateField('unknown_field', 'anything')).toBeNull();
    });
  });
});
