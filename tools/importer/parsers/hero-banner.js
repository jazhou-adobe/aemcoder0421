/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner. Base: hero.
 * Source: https://www.flinders.edu.au/
 * Selector: .hero-banner.tabs .flinders-banner.flinders-image
 *
 * Hero block structure (from block library):
 *   Row 1: [background image]
 *   Row 2: [heading, subheading, CTA buttons]
 */
export default function parse(element, { document }) {
  // Extract background image (desktop version)
  const bgImg = element.querySelector('.hero_banner.desktop-only img.hero-image, img.hero-image');

  // Extract heading from hero description
  const heading = element.querySelector('.hero-description h1, .hero-description h2');

  // Extract CTA buttons
  const ctas = Array.from(element.querySelectorAll('.hero-description .cta-button a'));

  const cells = [];

  // Row 1: background image
  if (bgImg) {
    cells.push([bgImg]);
  }

  // Row 2: heading + CTAs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  contentCell.push(...ctas);
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
