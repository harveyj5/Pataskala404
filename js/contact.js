/**
 * Pataskala Lodge #404 — Contact Form
 * Client-side validation only. Server-side validation REQUIRED on backend.
 * WCAG 2.1 AA compliant error handling.
 */

'use strict';

/* ---- VALIDATION RULES ---- */

/**
 * Validates a non-empty string.
 * @param {string} value
 * @returns {boolean}
 */
function isNonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates an email address format.
 * @param {string} value
 * @returns {boolean}
 */
function isValidEmail(value) {
  // RFC 5322 simplified — suitable for client-side hint
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Validates a field against a rule and returns an error message or null.
 * @param {string} name  - Field identifier
 * @param {string} value - Field value
 * @returns {string|null} Error message, or null if valid
 */
function validateField(name, value) {
  switch (name) {
    case 'first_name':
    case 'last_name':
      return isNonEmpty(value) ? null : 'This field is required.';
    case 'email':
      if (!isNonEmpty(value)) return 'Email address is required.';
      if (!isValidEmail(value)) return 'Please enter a valid email address.';
      return null;
    case 'message':
      if (!isNonEmpty(value)) return 'Please enter a message.';
      if (value.trim().length < 10) return 'Message must be at least 10 characters.';
      return null;
    default:
      return null;
  }
}

/* ---- DOM HELPERS ---- */

/**
 * Shows an error message for a form field.
 * @param {HTMLElement} input
 * @param {string} message
 */
function showError(input, message) {
  input.classList.add('is-invalid');
  input.classList.remove('is-valid');
  input.setAttribute('aria-invalid', 'true');
  const errorEl = document.getElementById(`${input.id}-error`);
  if (errorEl) errorEl.textContent = message;
}

/**
 * Clears the error state for a form field.
 * @param {HTMLElement} input
 */
function clearError(input) {
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  input.setAttribute('aria-invalid', 'false');
  const errorEl = document.getElementById(`${input.id}-error`);
  if (errorEl) errorEl.textContent = '';
}

/**
 * Shows a form-level status message.
 * @param {HTMLElement} statusEl
 * @param {string} message
 * @param {'success'|'error'} type
 */
function showStatus(statusEl, message, type) {
  statusEl.textContent = message;
  statusEl.className = `form-status is-${type}`;
}

/* ---- FORM INIT ---- */

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');

  // Field ids that need validation
  const validatedFields = ['first-name', 'last-name', 'email', 'message'];

  // Inline validation on blur
  validatedFields.forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener('blur', () => {
      const error = validateField(input.name, input.value);
      error ? showError(input, error) : clearError(input);
    });

    input.addEventListener('input', () => {
      // Clear error as soon as user starts typing
      if (input.classList.contains('is-invalid')) {
        const error = validateField(input.name, input.value);
        if (!error) clearError(input);
      }
    });
  });

  // Form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Honeypot check
    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value.trim() !== '') {
      // Bot detected — silently do nothing
      return;
    }

    let hasErrors = false;
    let firstErrorInput = null;

    validatedFields.forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;
      const error = validateField(input.name, input.value);
      if (error) {
        showError(input, error);
        hasErrors = true;
        if (!firstErrorInput) firstErrorInput = input;
      } else {
        clearError(input);
      }
    });

    if (hasErrors) {
      showStatus(statusEl, 'Please correct the errors above before submitting.', 'error');
      // Move focus to first error for accessibility
      if (firstErrorInput) firstErrorInput.focus();
      return;
    }

    // --- INTEGRATION POINT ---
    // Replace the block below with your actual form submission.
    // Options: Netlify Forms, Formspree, EmailJS, your own API.
    // Example with fetch:
    //
    // const data = new FormData(form);
    // fetch('/api/contact', { method: 'POST', body: data })
    //   .then(res => res.json())
    //   .then(() => {
    //     showStatus(statusEl, 'Thank you — we will be in touch soon.', 'success');
    //     form.reset();
    //   })
    //   .catch(() => showStatus(statusEl, 'Something went wrong. Please try again.', 'error'));

    // Placeholder success for demo:
    showStatus(
      statusEl,
      'Thank you for your message! A Brother will be in touch soon.',
      'success'
    );
    form.reset();
    validatedFields.forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        input.classList.remove('is-valid', 'is-invalid');
        input.removeAttribute('aria-invalid');
      }
    });
  });
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm);
} else {
  initContactForm();
}

/* ---- EXPORTS (for testing) ---- */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { isNonEmpty, isValidEmail, validateField };
}
