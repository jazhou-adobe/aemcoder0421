import { createOptimizedPicture } from '../../scripts/aem.js';

function createDateBadge(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-AU', { month: 'short' }).toUpperCase();
  const badge = document.createElement('div');
  badge.className = 'cards-news-date';
  badge.innerHTML = `<span class="cards-news-date-day">${day}</span><span class="cards-news-date-month">${month}</span>`;
  return badge;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && (div.querySelector('picture') || div.querySelector('img'))) {
        div.className = 'cards-news-card-image';
      } else {
        div.className = 'cards-news-card-body';
        const firstP = div.querySelector('p');
        if (firstP) {
          const badge = createDateBadge(firstP.textContent.trim());
          if (badge) {
            firstP.remove();
            li.append(badge);
          }
        }
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
