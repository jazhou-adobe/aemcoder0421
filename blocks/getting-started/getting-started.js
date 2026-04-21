/**
 * Getting Started Block
 * Full-width background image section with heading + white card grid overlay
 * Content model: Row 1 = bg image | heading text, Rows 2+ = icon | card content
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // Row 1: background image + heading
  const headerRow = rows[0];
  const headerCols = [...headerRow.children];
  const bgImg = headerCols[0]?.querySelector('img');
  const headingCol = headerCols[1] || headerCols[0];

  // Build background
  const bgDiv = document.createElement('div');
  bgDiv.className = 'getting-started-bg';
  if (bgImg) {
    bgDiv.innerHTML = `<img src="${bgImg.src}" alt="" loading="lazy">`;
  }

  // Build heading area
  const headingDiv = document.createElement('div');
  headingDiv.className = 'getting-started-heading';
  headingDiv.append(...[...headingCol.children]);

  // Build cards grid
  const cardsDiv = document.createElement('div');
  cardsDiv.className = 'getting-started-cards';

  for (let i = 1; i < rows.length; i += 1) {
    const cols = [...rows[i].children];
    const card = document.createElement('div');
    card.className = 'getting-started-card';

    // Icon column
    const iconImg = cols[0]?.querySelector('img');
    if (iconImg) {
      const iconDiv = document.createElement('div');
      iconDiv.className = 'getting-started-card-icon';
      iconDiv.innerHTML = `<img src="${iconImg.src}" alt="${iconImg.alt || ''}" loading="lazy">`;
      card.append(iconDiv);
    }

    // Content column
    const contentCol = cols[1] || cols[0];
    if (contentCol) {
      const bodyDiv = document.createElement('div');
      bodyDiv.className = 'getting-started-card-body';
      bodyDiv.append(...[...contentCol.children]);
      card.append(bodyDiv);
    }

    cardsDiv.append(card);
  }

  // Gold diagonal stripes (decorative)
  const stripes = document.createElement('div');
  stripes.className = 'getting-started-stripes';

  block.textContent = '';
  block.append(bgDiv, stripes, headingDiv, cardsDiv);
}
