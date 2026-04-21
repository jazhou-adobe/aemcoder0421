/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-news. Base: cards.
 * Source: https://www.flinders.edu.au/
 * Selector: .news-feed-v2
 *
 * Cards block structure:
 *   Each row = [image | heading, description, link]
 *
 * News feed items are .component_section_item divs.
 * Each item has: img, .news_date_month, .news_title h3, .news_details a
 * Images are nested inside news-overlay-layout and may be direct children
 * or inside wrapper divs.
 */
export default function parse(element, { document }) {
  const articles = Array.from(element.querySelectorAll('.component_section_item'));
  const cells = [];

  articles.forEach((article) => {
    // Column 1: article image - try multiple selectors
    const img = article.querySelector('img:not(.news_overlay img)')
      || article.querySelector('.news-overlay-layout img')
      || article.querySelector('img');

    // Column 2: headline + date + read more link
    const headline = article.querySelector('.news_title h3, h3');
    const dateSpan = article.querySelector('.news_date_month');
    const readMore = article.querySelector('.news_details a, a[class*="transparent_button"]');

    const contentCell = [];
    if (headline) contentCell.push(headline);
    if (dateSpan) {
      const datePara = document.createElement('p');
      datePara.textContent = dateSpan.textContent.trim();
      contentCell.push(datePara);
    }
    if (readMore) contentCell.push(readMore);

    if (img || contentCell.length > 0) {
      cells.push([img || '', contentCell.length > 0 ? contentCell : '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
