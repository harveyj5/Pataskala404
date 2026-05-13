/**
 * Pataskala Lodge #404 — FAQ Accordion
 * WCAG 2.1 AA: manages aria-expanded, hidden, keyboard nav
 */

'use strict';

/**
 * Initialise all FAQ accordion buttons.
 * @returns {number} count of FAQ buttons found
 */
function initFaq() {
  const buttons = document.querySelectorAll('.faq-question');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      const answerId = btn.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);

      if (!answer) return;

      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        answer.hidden = true;
      } else {
        // Close all others first (accordion behaviour)
        buttons.forEach((otherBtn) => {
          const otherId = otherBtn.getAttribute('aria-controls');
          const otherAnswer = document.getElementById(otherId);
          otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.hidden = true;
        });

        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      }
    });
  });

  return buttons.length;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFaq);
} else {
  initFaq();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initFaq };
}
