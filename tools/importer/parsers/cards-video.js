/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-video. Base: cards.
 * Source: https://www.flinders.edu.au/
 * Selector: .video-overlay.youtube-overlay-custom
 *
 * Cards block structure:
 *   Each row = [image | heading, description]
 *
 * The selector matches individual video overlay elements within video containers.
 * Each video is paired with a quote in an adjacent column.
 */
export default function parse(element, { document }) {
  // Walk up to the col_2_section row containing video + quote
  const parentRow = element.closest('.content_middle') || element.closest('.row');
  if (!parentRow) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-video', cells: [] });
    element.replaceWith(block);
    return;
  }

  // Get the video thumbnail image from the video-image container
  const videoContainer = element.closest('.video-container');
  const img = videoContainer ? videoContainer.querySelector('.video-image > img') : null;

  // Get the YouTube link
  const videoLink = videoContainer ? videoContainer.querySelector('a[href*="youtube"]') : null;

  // Get the quote text from the adjacent column (col-lg-8)
  const textCol = parentRow.querySelector('.col-lg-8');
  const quoteText = textCol ? textCol.querySelector('.cmp-text p, .rte p') : null;
  const iconImg = textCol ? textCol.querySelector('.cmp-image__image, .cmp-image img') : null;

  const contentCell = [];
  if (quoteText) contentCell.push(quoteText);
  if (videoLink) {
    const link = document.createElement('a');
    link.href = videoLink.href;
    link.textContent = 'Watch video';
    contentCell.push(link);
  }

  const cells = [];
  if (img || contentCell.length > 0) {
    cells.push([img || '', contentCell.length > 0 ? contentCell : '']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-video', cells });
  element.replaceWith(block);
}
