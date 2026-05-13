/**
 * Pataskala Lodge #404 — Petition for Degrees (Join) Form
 * Handles: client-side validation, conditional fields, Formspree submission
 * WCAG 2.1 AA compliant error handling
 */

'use strict';

/* ---- VALIDATION RULES ---- */

/**
 * Returns true if value is a non-empty string.
 * @param {string} value
 * @returns {boolean}
 */
function isNonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Returns true if value is a valid email address format.
 * @param {string} value
 * @returns {boolean}
 */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Returns true if value is a valid US phone number (flexible format).
 * @param {string} value
 * @returns {boolean}
 */
function isValidPhone(value) {
  return /^[\d\s\-\(\)\+\.]{7,20}$/.test(value.trim());
}

/**
 * Returns true if value is a valid date string.
 * @param {string} value
 * @returns {boolean}
 */
function isValidDate(value) {
  if (!isNonEmpty(value)) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

/**
 * Returns true if a petitioner is at least 18 years old based on birth date.
 * @param {string} birthDateStr
 * @returns {boolean}
 */
function isAtLeast18(birthDateStr) {
  if (!isValidDate(birthDateStr)) return false;
  const birth = new Date(birthDateStr);
  const today = new Date();
  const age18 = new Date(birth.getFullYear() + 18, birth.getMonth(), birth.getDate());
  return today >= age18;
}

/**
 * Validates a ZIP code (5 digit or ZIP+4).
 * @param {string} value
 * @returns {boolean}
 */
function isValidZip(value) {
  return /^\d{5}(-\d{4})?$/.test(value.trim());
}

/**
 * Validates a specific petition field by name.
 * @param {string} name
 * @param {string} value
 * @returns {string|null} Error message or null if valid
 */
function validatePetitionField(name, value) {
  switch (name) {
    case 'first_name':
    case 'last_name':
      return isNonEmpty(value) ? null : 'This field is required.';
    case 'birth_city':
    case 'birth_state':
      return isNonEmpty(value) ? null : 'This field is required.';
    case 'birth_date':
      if (!isNonEmpty(value)) return 'Date of birth is required.';
      if (!isValidDate(value)) return 'Please enter a valid date.';
      if (!isAtLeast18(value)) return 'You must be at least 18 years old to petition.';
      return null;
    case 'street':
      return isNonEmpty(value) ? null : 'Street address is required.';
    case 'city':
      return isNonEmpty(value) ? null : 'City is required.';
    case 'zip':
      if (!isNonEmpty(value)) return 'ZIP code is required.';
      if (!isValidZip(value)) return 'Please enter a valid ZIP code (e.g. 43062).';
      return null;
    case 'phone':
      if (!isNonEmpty(value)) return 'Phone number is required.';
      if (!isValidPhone(value)) return 'Please enter a valid phone number.';
      return null;
    case 'email':
      if (!isNonEmpty(value)) return 'Email address is required.';
      if (!isValidEmail(value)) return 'Please enter a valid email address.';
      return null;
    case 'full_name_attestation':
      return isNonEmpty(value) ? null : 'Please type your full name to attest.';
    case 'signed_date':
      if (!isNonEmpty(value)) return 'Date is required.';
      if (!isValidDate(value)) return 'Please enter a valid date.';
      return null;
    default:
      return null;
  }
}

/* ---- DOM HELPERS ---- */

function showError(input, message) {
  input.classList.add('is-invalid');
  input.classList.remove('is-valid');
  input.setAttribute('aria-invalid', 'true');
  const errorEl = document.getElementById(`${input.id}-error`);
  if (errorEl) errorEl.textContent = message;
}

function clearError(input) {
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  input.setAttribute('aria-invalid', 'false');
  const errorEl = document.getElementById(`${input.id}-error`);
  if (errorEl) errorEl.textContent = '';
}

function showRadioError(groupName, errorId, message) {
  const errorEl = document.getElementById(errorId);
  if (errorEl) errorEl.textContent = message;
}

function clearRadioError(errorId) {
  const errorEl = document.getElementById(errorId);
  if (errorEl) errorEl.textContent = '';
}

function showStatus(statusEl, message, type) {
  statusEl.textContent = message;
  statusEl.className = `form-status is-${type}`;
}

/* ---- CONDITIONAL: PRIOR PETITION ---- */

function initPriorPetitionToggle() {
  const radios = document.querySelectorAll('input[name="prior_petition"]');
  const detailsGroup = document.getElementById('prior-details-group');
  if (!radios.length || !detailsGroup) return;

  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.value === 'Yes' && radio.checked) {
        detailsGroup.hidden = false;
        detailsGroup.querySelector('textarea')?.focus();
      } else {
        detailsGroup.hidden = true;
      }
    });
  });
}

/* ---- REQUIRED TEXT FIELDS ---- */
const REQUIRED_TEXT_FIELDS = [
  'first-name', 'last-name',
  'birth-city', 'birth-state', 'birth-date',
  'street', 'city', 'zip',
  'phone', 'email',
  'full-name-attest', 'signed-date',
];

/* ---- REQUIRED RADIO GROUPS ---- */
const REQUIRED_RADIO_GROUPS = [
  { name: 'prior_petition',  errorId: 'prior-petition-error',  label: 'Please select Yes or No.' },
  { name: 'q1_answer',       errorId: 'q1-error',              label: 'Please answer this question.' },
  { name: 'q2_answer',       errorId: 'q2-error',              label: 'Please answer this question.' },
  { name: 'q3_answer',       errorId: 'q3-error',              label: 'Please answer this question.' },
  { name: 'q4_answer',       errorId: 'q4-error',              label: 'Please answer this question.' },
  { name: 'q5_answer',       errorId: 'q5-error',              label: 'Please answer this question.' },
];

/* ---- INLINE VALIDATION ---- */

function initInlineValidation() {
  REQUIRED_TEXT_FIELDS.forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener('blur', () => {
      const error = validatePetitionField(input.name, input.value);
      error ? showError(input, error) : clearError(input);
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) {
        const error = validatePetitionField(input.name, input.value);
        if (!error) clearError(input);
      }
    });
  });
}

/* ---- FORM SUBMISSION ---- */

function initPetitionForm() {
  const form = document.getElementById('petition-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');

  initPriorPetitionToggle();
  initInlineValidation();

  // Set today's date as default for signed-date
  const signedDateInput = document.getElementById('signed-date');
  if (signedDateInput && !signedDateInput.value) {
    const today = new Date().toISOString().split('T')[0];
    signedDateInput.value = today;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot check
    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== '') return;

    let hasErrors = false;
    let firstErrorEl = null;

    // Validate text fields
    REQUIRED_TEXT_FIELDS.forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;
      const error = validatePetitionField(input.name, input.value);
      if (error) {
        showError(input, error);
        hasErrors = true;
        if (!firstErrorEl) firstErrorEl = input;
      } else {
        clearError(input);
      }
    });

    // Validate radio groups
    REQUIRED_RADIO_GROUPS.forEach(({ name, errorId, label }) => {
      const selected = form.querySelector(`input[name="${name}"]:checked`);
      if (!selected) {
        showRadioError(name, errorId, label);
        hasErrors = true;
        if (!firstErrorEl) {
          firstErrorEl = form.querySelector(`input[name="${name}"]`);
        }
      } else {
        clearRadioError(errorId);
      }
    });

    if (hasErrors) {
      showStatus(statusEl, 'Please correct the errors above before submitting.', 'error');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorEl.focus();
      }
      return;
    }

    // Submit to Formspree
    const submitBtn = form.querySelector('[data-testid="submit-btn"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting…';
    }

    try {
      const data = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        // Redirect to thank-you page
        window.location.href = 'join-thankyou.html';
      } else {
        const json = await response.json().catch(() => ({}));
        const msg = json?.error || 'Submission failed. Please try again or contact us directly.';
        showStatus(statusEl, msg, 'error');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Petition';
        }
      }
    } catch {
      showStatus(
        statusEl,
        'Network error. Please check your connection and try again, or contact us directly.',
        'error'
      );
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Petition';
      }
    }
  });
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPetitionForm);
} else {
  initPetitionForm();
}

/* ---- EXPORTS (for testing) ---- */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isNonEmpty,
    isValidEmail,
    isValidPhone,
    isValidDate,
    isAtLeast18,
    isValidZip,
    validatePetitionField,
  };
}
