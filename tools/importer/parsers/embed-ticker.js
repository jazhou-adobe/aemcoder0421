/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-ticker. Base: embed.
 * Source: https://www.flinders.edu.au/
 * Selector: .iframe-component iframe[src*='slider.flinders.edu.au']
 *
 * Embed block structure:
 *   Row 1: [URL link]
 */
export default function parse(element, { document }) {
  const iframe = element.tagName === 'IFRAME' ? element : element.querySelector('iframe');
  const src = iframe ? iframe.getAttribute('src') : '';

  const cells = [];
  if (src) {
    const link = document.createElement('a');
    link.href = src;
    link.textContent = src;
    cells.push([link]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-ticker', cells });
  element.replaceWith(block);
}
