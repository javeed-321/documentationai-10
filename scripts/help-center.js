/**
 * Scrut Help Center — landing page search.
 *
 * The hero search box on home.mdx is styled to match the mockup, but the real
 * search lives in the platform's search modal. That modal is opened either by
 * clicking the platform search bar or by the Ctrl/Cmd+K listener the navbar
 * registers on `document`. The landing page hides the navbar with CSS, which
 * leaves both handlers mounted and working — so a click on the hero box just
 * replays the keyboard shortcut.
 *
 * Delegated from `document` so it keeps working after client-side navigation.
 */
(function () {
  'use strict';

  function openSearch() {
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'k',
        code: 'KeyK',
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      })
    );

    // Fallback for the case where the shortcut handler is not mounted yet.
    window.setTimeout(function () {
      if (document.querySelector('.dai-search-modal')) return;
      var bar = document.querySelector('.dai-search');
      if (bar) bar.click();
    }, 60);
  }

  /**
   * Ask AI.
   *
   * The platform's own Ask AI button carries no stable class or data attribute
   * — just generated utility classes — so it is found by its label instead.
   * The landing page only hides the navbar with CSS, so that button is still
   * mounted and its React handler still bound; a programmatic click opens the
   * assistant panel even though the button is not visible.
   *
   * If the platform ever renames the label, this returns false rather than
   * failing silently, and the hero button falls back to opening search.
   */
  function openAskAI() {
    var buttons = document.querySelectorAll('button');
    for (var i = 0; i < buttons.length; i++) {
      if ((buttons[i].textContent || '').trim() === 'Ask AI') {
        buttons[i].click();
        return true;
      }
    }
    return false;
  }

  document.addEventListener('click', function (event) {
    if (!event.target.closest) return;

    if (event.target.closest('[data-hc-search]')) {
      event.preventDefault();
      openSearch();
      return;
    }

    if (event.target.closest('[data-hc-askai]')) {
      event.preventDefault();
      if (!openAskAI()) openSearch();
    }
  });
})();
