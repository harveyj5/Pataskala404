/**
 * Pataskala Lodge #404 — Join Page Tests
 * Covers: all petition form validation functions
 */

'use strict';

global.document = {
  getElementById:   jest.fn(() => null),
  querySelector:    jest.fn(() => null),
  querySelectorAll: jest.fn(() => []),
  readyState:       'complete',
  addEventListener: jest.fn(),
};
global.window = {
  scrollY:          0,
  matchMedia:       jest.fn(() => ({ matches: false })),
  addEventListener: jest.fn(),
  location:         { href: '' },
  innerWidth:       1200,
};

const {
  isNonEmpty,
  isValidEmail,
  isValidPhone,
  isValidDate,
  isAtLeast18,
  isValidZip,
  validatePetitionField,
} = require('../js/join.js');

/* =========================================================
   isNonEmpty
   ========================================================= */
describe('join.js — isNonEmpty', () => {
  test('returns true for a regular string', () => expect(isNonEmpty('John')).toBe(true));
  test('returns false for empty string', () => expect(isNonEmpty('')).toBe(false));
  test('returns false for whitespace only', () => expect(isNonEmpty('   ')).toBe(false));
  test('returns false for null', () => expect(isNonEmpty(null)).toBe(false));
  test('returns false for undefined', () => expect(isNonEmpty(undefined)).toBe(false));
  test('returns false for number', () => expect(isNonEmpty(42)).toBe(false));
});

/* =========================================================
   isValidEmail
   ========================================================= */
describe('join.js — isValidEmail', () => {
  test('valid standard email', () => expect(isValidEmail('test@example.com')).toBe(true));
  test('valid with subdomain', () => expect(isValidEmail('user@mail.lodge.org')).toBe(true));
  test('strips whitespace', () => expect(isValidEmail('  user@example.com  ')).toBe(true));
  test('missing @', () => expect(isValidEmail('userexample.com')).toBe(false));
  test('missing domain', () => expect(isValidEmail('user@')).toBe(false));
  test('empty string', () => expect(isValidEmail('')).toBe(false));
});

/* =========================================================
   isValidPhone
   ========================================================= */
describe('join.js — isValidPhone', () => {
  test('valid 10-digit', () => expect(isValidPhone('7405550100')).toBe(true));
  test('valid with formatting', () => expect(isValidPhone('(740) 555-0100')).toBe(true));
  test('valid with dots', () => expect(isValidPhone('740.555.0100')).toBe(true));
  test('too short', () => expect(isValidPhone('123')).toBe(false));
  test('letters included', () => expect(isValidPhone('abc-def-ghij')).toBe(false));
  test('empty string', () => expect(isValidPhone('')).toBe(false));
});

/* =========================================================
   isValidDate
   ========================================================= */
describe('join.js — isValidDate', () => {
  test('valid ISO date', () => expect(isValidDate('1990-06-15')).toBe(true));
  test('valid date string', () => expect(isValidDate('2000-01-01')).toBe(true));
  test('invalid string', () => expect(isValidDate('not-a-date')).toBe(false));
  test('empty string', () => expect(isValidDate('')).toBe(false));
  test('null', () => expect(isValidDate(null)).toBe(false));
});

/* =========================================================
   isAtLeast18
   ========================================================= */
describe('join.js — isAtLeast18', () => {
  test('returns true for someone born 30 years ago', () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 30);
    expect(isAtLeast18(d.toISOString().split('T')[0])).toBe(true);
  });

  test('returns true for someone born exactly 18 years ago today', () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    expect(isAtLeast18(d.toISOString().split('T')[0])).toBe(true);
  });

  test('returns false for someone born 17 years ago', () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 17);
    expect(isAtLeast18(d.toISOString().split('T')[0])).toBe(false);
  });

  test('returns false for an invalid date', () => {
    expect(isAtLeast18('not-a-date')).toBe(false);
  });

  test('returns false for empty string', () => {
    expect(isAtLeast18('')).toBe(false);
  });
});

/* =========================================================
   isValidZip
   ========================================================= */
describe('join.js — isValidZip', () => {
  test('valid 5-digit ZIP', () => expect(isValidZip('43062')).toBe(true));
  test('valid ZIP+4', () => expect(isValidZip('43062-1234')).toBe(true));
  test('too short', () => expect(isValidZip('1234')).toBe(false));
  test('letters', () => expect(isValidZip('ABCDE')).toBe(false));
  test('empty string', () => expect(isValidZip('')).toBe(false));
  test('6 digits', () => expect(isValidZip('123456')).toBe(false));
});

/* =========================================================
   validatePetitionField
   ========================================================= */
describe('join.js — validatePetitionField', () => {

  describe('first_name / last_name', () => {
    test('valid first name returns null', () => expect(validatePetitionField('first_name', 'John')).toBeNull());
    test('empty first name returns error', () => expect(validatePetitionField('first_name', '')).not.toBeNull());
    test('valid last name returns null', () => expect(validatePetitionField('last_name', 'Smith')).toBeNull());
    test('empty last name returns error', () => expect(validatePetitionField('last_name', '')).not.toBeNull());
  });

  describe('birth_city / birth_state', () => {
    test('valid city returns null', () => expect(validatePetitionField('birth_city', 'Columbus')).toBeNull());
    test('empty city returns error', () => expect(validatePetitionField('birth_city', '')).not.toBeNull());
    test('valid state returns null', () => expect(validatePetitionField('birth_state', 'Ohio')).toBeNull());
  });

  describe('birth_date', () => {
    test('valid adult date returns null', () => {
      const d = new Date();
      d.setFullYear(d.getFullYear() - 25);
      expect(validatePetitionField('birth_date', d.toISOString().split('T')[0])).toBeNull();
    });
    test('empty returns required error', () => {
      const err = validatePetitionField('birth_date', '');
      expect(err).not.toBeNull();
      expect(err).toContain('required');
    });
    test('under 18 returns age error', () => {
      const d = new Date();
      d.setFullYear(d.getFullYear() - 16);
      const err = validatePetitionField('birth_date', d.toISOString().split('T')[0]);
      expect(err).not.toBeNull();
      expect(err).toContain('18');
    });
  });

  describe('zip', () => {
    test('valid ZIP returns null', () => expect(validatePetitionField('zip', '43062')).toBeNull());
    test('empty ZIP returns required error', () => expect(validatePetitionField('zip', '')).not.toBeNull());
    test('invalid ZIP format returns format error', () => {
      const err = validatePetitionField('zip', 'abcde');
      expect(err).not.toBeNull();
    });
  });

  describe('phone', () => {
    test('valid phone returns null', () => expect(validatePetitionField('phone', '(740) 555-0100')).toBeNull());
    test('empty phone returns error', () => expect(validatePetitionField('phone', '')).not.toBeNull());
    test('invalid phone returns error', () => expect(validatePetitionField('phone', 'abc')).not.toBeNull());
  });

  describe('email', () => {
    test('valid email returns null', () => expect(validatePetitionField('email', 'user@example.com')).toBeNull());
    test('empty email returns required error', () => {
      const err = validatePetitionField('email', '');
      expect(err).toContain('required');
    });
    test('invalid email returns format error', () => {
      const err = validatePetitionField('email', 'notanemail');
      expect(err).toContain('valid');
    });
  });

  describe('full_name_attestation', () => {
    test('valid name returns null', () => expect(validatePetitionField('full_name_attestation', 'John A. Smith')).toBeNull());
    test('empty returns error', () => expect(validatePetitionField('full_name_attestation', '')).not.toBeNull());
  });

  describe('signed_date', () => {
    test('valid date returns null', () => expect(validatePetitionField('signed_date', '2025-10-01')).toBeNull());
    test('empty returns error', () => expect(validatePetitionField('signed_date', '')).not.toBeNull());
    test('invalid returns error', () => expect(validatePetitionField('signed_date', 'not-a-date')).not.toBeNull());
  });

  describe('unknown field', () => {
    test('returns null', () => expect(validatePetitionField('unknown_field', 'anything')).toBeNull());
  });
});
