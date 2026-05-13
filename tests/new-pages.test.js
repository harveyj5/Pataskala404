/**
 * Pataskala Lodge #404 — New Page Tests
 * Covers: calendar logic, FAQ module
 */

'use strict';

// Mock DOM globals
global.document = {
  getElementById:   jest.fn(() => null),
  querySelector:    jest.fn(() => null),
  querySelectorAll: jest.fn(() => []),
  readyState:       'complete',
  addEventListener: jest.fn(),
};
global.window = {
  scrollY:      0,
  matchMedia:   jest.fn(() => ({ matches: false })),
  addEventListener: jest.fn(),
  innerWidth:   1200,
};

const {
  getMeetingDays,
  getNthWeekdayOfMonth,
  getEventsForDay,
} = require('../js/calendar.js');

const { initFaq } = require('../js/faq.js');

/* =========================================================
   getNthWeekdayOfMonth
   ========================================================= */
describe('calendar.js — getNthWeekdayOfMonth', () => {
  // May 2025: 1st Tuesday = May 6, 3rd Tuesday = May 20
  test('returns the 1st Tuesday of May 2025 as day 6', () => {
    expect(getNthWeekdayOfMonth(2025, 4, 2, 1)).toBe(6);
  });

  test('returns the 3rd Tuesday of May 2025 as day 20', () => {
    expect(getNthWeekdayOfMonth(2025, 4, 2, 3)).toBe(20);
  });

  test('returns the 1st Tuesday of September 2025 as day 2', () => {
    expect(getNthWeekdayOfMonth(2025, 8, 2, 1)).toBe(2);
  });

  test('returns the 3rd Tuesday of September 2025 as day 16', () => {
    expect(getNthWeekdayOfMonth(2025, 8, 2, 3)).toBe(16);
  });

  test('returns a number between 1 and 31', () => {
    const result = getNthWeekdayOfMonth(2026, 0, 2, 2);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(31);
  });
});

/* =========================================================
   getMeetingDays
   ========================================================= */
describe('calendar.js — getMeetingDays', () => {
  test('returns an empty array for July (month 6)', () => {
    expect(getMeetingDays(2025, 6)).toEqual([]);
  });

  test('returns an empty array for August (month 7)', () => {
    expect(getMeetingDays(2025, 7)).toEqual([]);
  });

  test('returns exactly 2 meeting days for a regular month', () => {
    const days = getMeetingDays(2025, 4); // May
    expect(days).toHaveLength(2);
  });

  test('both meeting days are Tuesdays', () => {
    const days = getMeetingDays(2025, 4); // May 2025
    days.forEach((day) => {
      const date = new Date(2025, 4, day);
      expect(date.getDay()).toBe(2); // Tuesday
    });
  });

  test('first meeting day is before the third', () => {
    const days = getMeetingDays(2025, 9); // October
    expect(days[0]).toBeLessThan(days[1]);
  });

  test('returns meeting days for September', () => {
    const days = getMeetingDays(2025, 8); // September
    expect(days.length).toBe(2);
  });

  test('returns meeting days for June (last meeting month)', () => {
    const days = getMeetingDays(2025, 5); // June
    expect(days.length).toBe(2);
  });

  test('returns empty array for all no-meeting months', () => {
    [6, 7].forEach((m) => {
      expect(getMeetingDays(2025, m)).toEqual([]);
    });
  });
});

/* =========================================================
   getEventsForDay
   ========================================================= */
describe('calendar.js — getEventsForDay', () => {
  test('returns an array', () => {
    expect(Array.isArray(getEventsForDay(2025, 4, 1))).toBe(true);
  });

  test('returns a stated meeting on a meeting day', () => {
    // May 6, 2025 is 1st Tuesday
    const events = getEventsForDay(2025, 4, 6);
    const meeting = events.find((e) => e.type === 'meeting');
    expect(meeting).toBeDefined();
    expect(meeting.title).toBe('Stated Meeting');
  });

  test('returns no meeting events in July', () => {
    const events = getEventsForDay(2025, 6, 1);
    const meeting = events.find((e) => e.type === 'meeting');
    expect(meeting).toBeUndefined();
  });

  test('returns empty array for a non-event day', () => {
    // A Wednesday in a meeting month — not a meeting day
    const events = getEventsForDay(2025, 4, 14); // May 14 = Wednesday
    expect(events).toHaveLength(0);
  });

  test('meeting events have title, time, and type properties', () => {
    const events = getEventsForDay(2025, 4, 6);
    const meeting = events.find((e) => e.type === 'meeting');
    expect(meeting).toHaveProperty('title');
    expect(meeting).toHaveProperty('time');
    expect(meeting).toHaveProperty('type');
  });

  test('returns special event on configured date (Sep 6, 2025)', () => {
    // SPECIAL_EVENTS includes month:8 (Sep), day:6, year:2025
    const events = getEventsForDay(2025, 7, 6);
    const special = events.find((e) => e.type === 'special');
    expect(special).toBeDefined();
  });
});

/* =========================================================
   initFaq
   ========================================================= */
describe('faq.js — initFaq', () => {
  test('returns 0 when no FAQ buttons exist in DOM', () => {
    // document.querySelectorAll returns [] in our mock
    const count = initFaq();
    expect(count).toBe(0);
  });

  test('initFaq returns a number', () => {
    expect(typeof initFaq()).toBe('number');
  });
});
