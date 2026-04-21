/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-search. Base: embed.
 * Source: https://www.flinders.edu.au/
 * Selector: .quick-search .quicksearch
 *
 * Embed block structure:
 *   Row 1: [URL link to course search]
 */
export default function parse(element, { document }) {
  // The course search is an interactive widget; link to the study/explore page
  const link = document.createElement('a');
  link.href = 'https://www.flinders.edu.au/study/explore';
  link.textContent = 'https://www.flinders.edu.au/study/explore';

  const cells = [[link]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-search', cells });
  element.replaceWith(block);
}
