/**
 * Pataskala Lodge #404 — Calendar
 * Builds an accessible monthly calendar and upcoming events list.
 * Stated meetings: 1st & 3rd Tuesday, September–June.
 */

'use strict';

/* ---- CONFIGURATION ---- */

/**
 * Months when the lodge does NOT meet (0-indexed: 6=July, 7=August).
 * @type {number[]}
 */
const NO_MEETING_MONTHS = [6, 7]; // July, August

/**
 * Special events to display on the calendar and events list.
 * Add, edit, or remove as needed.
 * @type {Array<{year: number, month: number, day: number, title: string, time: string, type: string}>}
 */
const SPECIAL_EVENTS = [
  { year: 2025, month: 8,  day: 6,  title: 'District Picnic',            time: '11:00 AM', type: 'special' },
  { year: 2025, month: 10, day: 4,  title: 'Lodge Annual Dinner',        time: '6:00 PM',  type: 'special' },
  { year: 2025, month: 11, day: 22, title: 'Masonic Day of Service',     time: '9:00 AM',  type: 'special' },
  { year: 2026, month: 3,  day: 14, title: 'Lodge Degree Night',         time: '7:00 PM',  type: 'special' },
  { year: 2026, month: 5,  day: 16, title: 'Installation of Officers',   time: '7:00 PM',  type: 'special' },
];

const DAYS_OF_WEEK  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES   = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const SHORT_MONTHS  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* ---- MEETING DATE LOGIC ---- */

/**
 * Returns the Nth occurrence of a given weekday in a month.
 * @param {number} year
 * @param {number} month - 0-indexed
 * @param {number} weekday - 0=Sun, 2=Tue
 * @param {number} n - 1-indexed occurrence (1=first, 2=second, etc.)
 * @returns {number} day of month, or 0 if not found
 */
function getNthWeekdayOfMonth(year, month, weekday, n) {
  const first = new Date(year, month, 1);
  const firstWeekday = first.getDay();
  let day = 1 + ((weekday - firstWeekday + 7) % 7) + (n - 1) * 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return day <= daysInMonth ? day : 0;
}

/**
 * Returns the meeting days for a given month/year.
 * Returns empty array for July & August.
 * @param {number} year
 * @param {number} month - 0-indexed
 * @returns {number[]} array of day-of-month numbers
 */
function getMeetingDays(year, month) {
  if (NO_MEETING_MONTHS.includes(month)) return [];
  const first  = getNthWeekdayOfMonth(year, month, 2, 1); // 1st Tuesday
  const third  = getNthWeekdayOfMonth(year, month, 2, 3); // 3rd Tuesday
  return [first, third].filter(Boolean);
}

/**
 * Returns all events (meetings + special) for a given day.
 * @param {number} year
 * @param {number} month - 0-indexed
 * @param {number} day
 * @returns {Array<{title: string, time: string, type: string}>}
 */
function getEventsForDay(year, month, day) {
  const events = [];

  // Stated meeting?
  if (getMeetingDays(year, month).includes(day)) {
    events.push({ title: 'Stated Meeting', time: '7:00 PM', type: 'meeting' });
  }

  // Special events (month is 1-indexed in SPECIAL_EVENTS for readability)
  SPECIAL_EVENTS.forEach((e) => {
    if (e.year === year && e.month - 1 === month && e.day === day) {
      events.push({ title: e.title, time: e.time, type: e.type });
    }
  });

  return events;
}

/* ---- CALENDAR RENDER ---- */

/**
 * Renders the calendar grid for the given month/year.
 * @param {number} year
 * @param {number} month - 0-indexed
 */
function renderCalendar(year, month) {
  const grid = document.getElementById('calendar-grid');
  const monthDisplay = document.getElementById('cal-month-display');
  if (!grid || !monthDisplay) return;

  monthDisplay.textContent = `${MONTH_NAMES[month]} ${year}`;

  const today = new Date();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  let html = '';

  // Day headers
  DAYS_OF_WEEK.forEach((d) => {
    html += `<div class="cal-day-header" role="columnheader" aria-label="${d}">${d}</div>`;
  });

  // Empty cells before the 1st
  for (let i = 0; i < firstDay; i++) {
    const prevDay = prevDays - firstDay + i + 1;
    html += `<div class="cal-day cal-day--empty cal-day--other-month" aria-hidden="true">
      <span class="cal-day-num">${prevDay}</span>
    </div>`;
  }

  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = (
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
    const events = getEventsForDay(year, month, d);
    const date = new Date(year, month, d);
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    let classes = 'cal-day';
    if (isToday) classes += ' cal-day--today';

    let eventHtml = events.map((e) =>
      `<div class="cal-event cal-event--${e.type}" title="${e.title} · ${e.time}">${e.title}</div>`
    ).join('');

    const ariaLabel = events.length
      ? `${dateStr}. Events: ${events.map(e => `${e.title} at ${e.time}`).join(', ')}`
      : dateStr;

    html += `<div class="${classes}" role="gridcell" aria-label="${ariaLabel}">
      <span class="cal-day-num" aria-hidden="true">${d}</span>
      ${eventHtml}
    </div>`;
  }

  // Fill remaining cells
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  let nextDay = 1;
  for (let i = firstDay + daysInMonth; i < totalCells; i++) {
    html += `<div class="cal-day cal-day--empty cal-day--other-month" aria-hidden="true">
      <span class="cal-day-num">${nextDay++}</span>
    </div>`;
  }

  grid.innerHTML = html;
}

/* ---- EVENTS LIST ---- */

/**
 * Renders the upcoming events list (next 10 events from today).
 */
function renderEventsList() {
  const list = document.getElementById('events-list');
  if (!list) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = [];

  // Scan the next 12 months for meetings and special events
  for (let m = 0; m < 12; m++) {
    const d = new Date(today.getFullYear(), today.getMonth() + m, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date < today) continue;

      const events = getEventsForDay(year, month, day);
      events.forEach((e) => {
        upcoming.push({ date, day, month, year, ...e });
      });
    }
  }

  // Sort and take first 8
  upcoming.sort((a, b) => a.date - b.date);
  const shown = upcoming.slice(0, 8);

  if (shown.length === 0) {
    list.innerHTML = '<li class="event-item"><div class="event-info"><p class="event-title">No upcoming events found.</p></div></li>';
    return;
  }

  list.innerHTML = shown.map((e) => `
    <li class="event-item">
      <div class="event-date-block" aria-hidden="true">
        <span class="event-date-month">${SHORT_MONTHS[e.month]}</span>
        <span class="event-date-day">${e.day}</span>
      </div>
      <div class="event-info">
        <div class="event-title">${e.title}</div>
        <div class="event-meta">${MONTH_NAMES[e.month]} ${e.day}, ${e.year} &middot; ${e.time} &middot; 116 S. Vine St., Pataskala, OH</div>
        <span class="event-tag event-tag--${e.type}">${e.type === 'meeting' ? 'Stated Meeting' : 'Special Event'}</span>
      </div>
    </li>
  `).join('');
}

/* ---- NAV CONTROLS ---- */

function initCalendar() {
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;

  const today = new Date();
  let currentYear  = today.getFullYear();
  let currentMonth = today.getMonth();

  renderCalendar(currentYear, currentMonth);
  renderEventsList();

  document.getElementById('prev-month')?.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar(currentYear, currentMonth);
  });

  document.getElementById('next-month')?.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar(currentYear, currentMonth);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalendar);
} else {
  initCalendar();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getMeetingDays, getNthWeekdayOfMonth, getEventsForDay };
}
