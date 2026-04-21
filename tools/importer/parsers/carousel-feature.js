/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-feature. Base: carousel.
 * Source: https://www.flinders.edu.au/
 * Selector: .flinders-banner.flinders-carousel
 *
 * Carousel block structure (from block library):
 *   Each row = [image | heading, description, CTA link]
 * Only uses desktop slides (.flinders-hero-swiper.desktop-only)
 */
export default function parse(element, { document }) {
  const slides = Array.from(
    element.querySelectorAll('.flinders-hero-swiper.desktop-only .swiper-slide.herobanner-slide'),
  );

  const cells = [];

  slides.forEach((slide) => {
    // Column 1: background image
    const img = slide.querySelector('.hero_banner img.hero-image');

    // Column 2: heading + description + CTA from hero-description
    const desc = slide.querySelector('.hero-description');
    const heading = desc ? desc.querySelector('h2, h3') : null;
    const paragraph = desc ? desc.querySelector('.rte-text-online, .cmp-text p') : null;
    const ctaLink = desc ? desc.querySelector('a[href]') : null;

    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (paragraph && paragraph !== heading) contentCell.push(paragraph);
    if (ctaLink) contentCell.push(ctaLink);

    if (img || contentCell.length > 0) {
      cells.push([img || '', contentCell.length > 0 ? contentCell : '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-feature', cells });
  element.replaceWith(block);
}
