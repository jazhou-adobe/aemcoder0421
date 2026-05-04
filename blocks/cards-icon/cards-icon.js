export default function decorate(block) {
  const rows = [...block.children];

  const container = document.createElement('div');
  container.className = 'cards-icon-carousel';

  const track = document.createElement('ul');
  track.className = 'cards-icon-track';

  rows.forEach((row) => {
    const cols = [...row.children];
    const li = document.createElement('li');
    li.className = 'cards-icon-card';

    if (cols.length >= 3) {
      // 3-column: bg image | icon | content
      const bgCol = cols[0];
      const iconCol = cols[1];
      const contentCol = cols[2];

      const bgImg = bgCol.querySelector('img');
      if (bgImg) {
        const bgDiv = document.createElement('div');
        bgDiv.className = 'cards-icon-card-bg';
        bgDiv.innerHTML = `<img src="${bgImg.src}" alt="" loading="lazy">`;
        li.append(bgDiv);
        li.classList.add('has-bg');
      }

      const iconImg = iconCol.querySelector('img');
      if (iconImg) {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'cards-icon-card-icon';
        iconDiv.innerHTML = `<img src="${iconImg.src}" alt="${iconImg.alt || ''}" loading="lazy">`;
        li.append(iconDiv);
      }

      const bodyDiv = document.createElement('div');
      bodyDiv.className = 'cards-icon-card-body';
      bodyDiv.append(...[...contentCol.children]);
      li.append(bodyDiv);
    } else {
      // 2-column fallback: icon | content
      const iconCol = cols[0];
      const contentCol = cols[1];

      const iconImg = iconCol?.querySelector('img');
      if (iconImg) {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'cards-icon-card-icon';
        iconDiv.innerHTML = `<img src="${iconImg.src}" alt="${iconImg.alt || ''}" loading="lazy">`;
        li.append(iconDiv);
      }

      if (contentCol) {
        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'cards-icon-card-body';
        bodyDiv.append(...[...contentCol.children]);
        li.append(bodyDiv);
      }
    }

    track.append(li);
  });

  // Nav buttons
  const nav = document.createElement('div');
  nav.className = 'cards-icon-nav';
  nav.innerHTML = `
    <button type="button" class="cards-icon-prev" aria-label="Previous">‹</button>
    <button type="button" class="cards-icon-next" aria-label="Next">›</button>
  `;

  container.append(nav, track);
  block.textContent = '';
  block.append(container);

  const cards = [...track.querySelectorAll('li')];
  const GAP = 16;
  let currentIndex = 0;

  function getVisible() {
    return window.innerWidth >= 900 ? 3 : 1;
  }

  function updateCardWidths() {
    const visible = getVisible();
    const containerWidth = container.offsetWidth;
    const cardWidth = Math.floor((containerWidth - GAP * (visible - 1)) / visible);
    cards.forEach((card) => { card.style.flexBasis = `${cardWidth}px`; });
  }

  function goTo(index) {
    const maxIdx = cards.length - getVisible();
    if (index < 0) currentIndex = maxIdx;
    else if (index > maxIdx) currentIndex = 0;
    else currentIndex = index;
    const cardWidth = cards[0].offsetWidth;
    track.style.transform = `translateX(-${currentIndex * (cardWidth + GAP)}px)`;
  }

  const prevBtn = nav.querySelector('.cards-icon-prev');
  const nextBtn = nav.querySelector('.cards-icon-next');
  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  updateCardWidths();
  goTo(0);

  window.addEventListener('resize', () => {
    currentIndex = 0;
    updateCardWidths();
    goTo(0);
  });
}
