/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Flinders University cleanup.
 * Selectors from captured DOM of https://www.flinders.edu.au/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie/GDPR banner (blocks parsing)
    WebImporter.DOMUtils.remove(element, [
      '#gdpr_notification_container',
      '.gdpr-notification',
    ]);

    // Remove loader overlay
    WebImporter.DOMUtils.remove(element, ['#ajax-loader-overlay']);

    // Remove spacer components (non-authorable layout elements)
    WebImporter.DOMUtils.remove(element, ['.spacer-component']);

    // Remove hidden inputs used for DOM toggling
    WebImporter.DOMUtils.remove(element, [
      '#dom_int_toggle_show_input',
      '#dom_redirect_url',
      '#int_redirect_url',
    ]);

    // Remove mobile duplicate sliders (keep desktop only)
    WebImporter.DOMUtils.remove(element, ['.flinders-hero-swiper-mobile']);

    // Remove course search dropdown options (interactive widget, not authorable)
    WebImporter.DOMUtils.remove(element, [
      '.quicksearch__select',
      '.show_more_container',
    ]);

    // Remove promotion switch tab navigation and entire tab container
    WebImporter.DOMUtils.remove(element, ['.cmp-tabs__tablist']);
    // Remove the promotion switch tab component entirely (student stories tabs)
    WebImporter.DOMUtils.remove(element, ['.promotion-switch-tab-2']);

    // Remove inactive tab panels (keep only active)
    const inactivePanels = element.querySelectorAll('.cmp-tabs__tabpanel:not(.cmp-tabs__tabpanel--active)');
    inactivePanels.forEach((panel) => panel.remove());

    // Remove domestic/international toggle UI
    WebImporter.DOMUtils.remove(element, [
      '.dom_int_toggle',
      '#dom_int_toggle_international',
      '#dom_int_toggle_domestic',
    ]);
  }

  if (hookName === H.after) {
    // Remove header/navigation (auto-populated in EDS)
    WebImporter.DOMUtils.remove(element, [
      '.main_header_container',
      '.navigation-global',
      '.header-tail',
      '.header_section_component',
    ]);

    // Remove footer content (auto-populated in EDS)
    WebImporter.DOMUtils.remove(element, [
      '.footer',
      '.footer_main',
      '.sub-footer',
      '.social-footer',
      '.footer_uni_content',
      '.footer_line',
      '.footer_contacts',
      '.footer_list',
      '.footer_copyright',
    ]);

    // Remove back-to-top button
    WebImporter.DOMUtils.remove(element, ['.scroll-top']);

    // Remove accessibility widget
    WebImporter.DOMUtils.remove(element, ['[class*="reciteme"]']);

    // Remove domestic/international content notification bar
    const intlNotice = element.querySelector('[class*="dom_int_notification"]');
    if (intlNotice) intlNotice.remove();

    // Remove "You are viewing international student" banner and Hotjar elements
    element.querySelectorAll('a[href="about:blank"]').forEach((el) => {
      const parent = el.closest('p') || el;
      parent.remove();
    });
    // Remove the "You are viewing international/domestic" toggle text
    element.querySelectorAll('p').forEach((p) => {
      const text = p.textContent.trim();
      if (text.startsWith('You are viewing') && text.includes('student')) {
        p.remove();
      }
      if (text === '×') p.remove();
    });

    // Remove social footer (reference-components loaded separately)
    element.querySelectorAll('img[src*="reference-components/social-footer"]').forEach((img) => {
      const linkParent = img.closest('p') || img.closest('a');
      if (linkParent) linkParent.remove();
    });
    // Remove "Follow Flinders" heading and reciteme icon
    element.querySelectorAll('h4').forEach((h4) => {
      if (h4.textContent.trim() === 'Follow Flinders') h4.remove();
    });
    element.querySelectorAll('img[src*="reciteme"]').forEach((img) => {
      const p = img.closest('p') || img;
      p.remove();
    });

    // Remove leftover course subject links between embed-search and carousel-feature
    // These are <p><a href="/study/..."> links from the quick-search area
    element.querySelectorAll('p').forEach((p) => {
      const link = p.querySelector('a[href^="/study/"]');
      if (link && p.children.length === 1 && p.childElementCount === 1) {
        // Only remove standalone study links (not links inside blocks)
        const inBlock = p.closest('[class*="carousel"], [class*="cards"], [class*="hero"], [class*="embed"]');
        if (!inBlock) {
          const text = p.textContent.trim();
          // Match course subject links and utility links
          if (/^(Business|Computer science|Creative arts|Criminology|Defence|Education|Engineering|Environment|Health|Humanities|International relations|Languages|Law|Medicine|Nursing|Psychology|Science|Social Work|Sport|View all courses|Not sure yet)/.test(text)) {
            p.remove();
          }
        }
      }
      // Remove "VIEWING DOMESTICINTERNATIONAL" text
      if (p.textContent.trim() === 'VIEWING DOMESTICINTERNATIONAL') p.remove();
    });

    // Remove student name tab list (Aria, Asher, Samuel, Arabella)
    element.querySelectorAll('ul').forEach((ul) => {
      const items = Array.from(ul.querySelectorAll('li'));
      const names = items.map((li) => li.textContent.trim());
      if (names.length <= 5 && names.every((n) => /^[A-Z][a-z]+$/.test(n))) {
        ul.remove();
      }
    });

    // Remove decorative background images (not authorable content)
    element.querySelectorAll('img[src*="bg-waves"]').forEach((img) => {
      const p = img.closest('p') || img;
      p.remove();
    });

    // Remove Hotjar, international student toggle, and misc junk paragraphs
    element.querySelectorAll('a[href="about:blank"]').forEach((a) => {
      const p = a.closest('p') || a;
      p.remove();
    });
    element.querySelectorAll('p').forEach((p) => {
      const t = p.textContent.trim();
      if (t.startsWith('You are viewing') || t === '×' || t === 'VIEWING DOMESTICINTERNATIONAL') {
        p.remove();
      }
      // Remove ranking footnotes (non-authorable boilerplate)
      if (t.startsWith('*') || t.startsWith('^') || t.startsWith('†')) {
        if (t.includes('Flinders is ranked') || t.includes('Ranked #1') || t.includes('Ranked')) {
          p.remove();
        }
      }
    });
    // Also catch sup-prefixed footnotes
    element.querySelectorAll('p > sup:first-child').forEach((sup) => {
      const p = sup.parentElement;
      if (p && p.tagName === 'P' && (p.textContent.includes('Flinders is ranked') || p.textContent.includes('Ranked #1') || p.textContent.includes('CRICOS'))) {
        p.remove();
      }
    });

    // Remove decorative background images (not authorable)
    element.querySelectorAll('p').forEach((p) => {
      const img = p.querySelector('img');
      if (img && p.childElementCount === 1 && p.children[0] === img) {
        const src = img.getAttribute('src') || '';
        if (src.includes('bg-waves') || src.includes('high-school-02') || src.includes('reciteme')) {
          p.remove();
        }
      }
    });

    // Remove iframes, noscript, link, script tags
    WebImporter.DOMUtils.remove(element, ['noscript', 'link', 'script']);

    // Clean tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-analytics');
    });
  }
}
