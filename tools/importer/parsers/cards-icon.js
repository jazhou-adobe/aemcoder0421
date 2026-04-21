/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-icon. Base: cards.
 * Source: https://www.flinders.edu.au/
 * Selector: .cmp-flindersonline-contentcard-carousel (carousel-0, carousel-1, carousel-2)
 *
 * Cards block structure:
 *   Each row = [image | heading, description, CTA]
 *
 * Content card carousel contains swiper-slides with contentcard-tile elements.
 * Each tile has: background image, icon, heading (h3), description (p), CTA link.
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll('.swiper-slide'));
  const cells = [];

  slides.forEach((slide) => {
    const tile = slide.querySelector('.contentcard-tile');
    if (!tile) return;

    // Column 1: card icon image (from .card-icon)
    const icon = tile.querySelector('.card-icon img');

    // Column 2: heading + description + CTA link
    const heading = tile.querySelector('.rte h3, .rte h2');
    const description = tile.querySelector('.rte p');
    const ctaLink = tile.querySelector('a.cta-button, a[class*="cta"]');

    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLink) contentCell.push(ctaLink);

    if (icon || contentCell.length > 0) {
      cells.push([icon || '', contentCell.length > 0 ? contentCell : '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-icon', cells });
  element.replaceWith(block);
}
