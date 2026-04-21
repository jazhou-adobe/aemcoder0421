const PLAY_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>';

function buildStudentCard(row, index) {
  const cols = [...row.children];
  const videoCol = cols[0];
  const contentCol = cols[1];

  const card = document.createElement('div');
  card.className = 'student-stories-card';
  card.dataset.index = index;
  if (index === 0) card.classList.add('active');

  // Extract video link
  const videoLink = videoCol.querySelector('a');
  const videoUrl = videoLink ? videoLink.href : '';
  const youtubeId = videoUrl.match(/(?:v=|\/)([\w-]{11})/)?.[1] || '';

  // Build video area with YouTube thumbnail
  const videoArea = document.createElement('div');
  videoArea.className = 'student-stories-video';
  if (youtubeId) {
    videoArea.innerHTML = `
      <img src="https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg" alt="" loading="lazy">
      <button type="button" class="student-stories-play" aria-label="Play video" data-video-id="${youtubeId}">
        ${PLAY_ICON}
      </button>
    `;
  }

  // Build content area
  const quote = contentCol.querySelector('h3, h2');
  const details = contentCol.querySelector('p');
  const contentArea = document.createElement('div');
  contentArea.className = 'student-stories-content';

  const quoteEl = document.createElement('blockquote');
  quoteEl.textContent = quote ? quote.textContent : '';

  const detailsEl = document.createElement('p');
  detailsEl.className = 'student-stories-details';
  if (details) {
    const lines = details.innerHTML.split('<br>').map((l) => l.trim());
    detailsEl.innerHTML = `<strong>${lines[0]}</strong>${lines[1] ? `<br>${lines[1]}` : ''}`;
  }

  const tag = document.createElement('span');
  tag.className = 'student-stories-tag';
  tag.textContent = 'Career paths';

  contentArea.append(tag, quoteEl, detailsEl);
  card.append(videoArea, contentArea);

  return card;
}

function buildTab(row, index) {
  const contentCol = row.children[1];
  const details = contentCol?.querySelector('p');
  const fullName = details ? details.innerHTML.split('<br>')[0].trim() : `Student ${index + 1}`;
  const firstName = fullName.replace(/<[^>]*>/g, '').split(' ')[0];

  const tab = document.createElement('button');
  tab.type = 'button';
  tab.className = 'student-stories-tab';
  if (index === 0) tab.classList.add('active');
  tab.textContent = firstName;
  tab.dataset.index = index;
  tab.setAttribute('aria-label', `Show ${fullName}'s story`);
  return tab;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  block.textContent = '';

  // Build tabs
  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'student-stories-tabs';

  // Build cards
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'student-stories-cards';

  rows.forEach((row, i) => {
    tabsContainer.append(buildTab(row, i));
    cardsContainer.append(buildStudentCard(row, i));
  });

  block.append(tabsContainer, cardsContainer);

  // Tab switching
  const tabs = block.querySelectorAll('.student-stories-tab');
  const cards = block.querySelectorAll('.student-stories-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.dataset.index, 10);
      tabs.forEach((t) => t.classList.remove('active'));
      cards.forEach((c) => c.classList.remove('active'));
      tab.classList.add('active');
      cards[idx].classList.add('active');
    });
  });

  // Play button - embed YouTube iframe
  block.querySelectorAll('.student-stories-play').forEach((btn) => {
    btn.addEventListener('click', () => {
      const { videoId } = btn.dataset;
      const videoArea = btn.closest('.student-stories-video');
      videoArea.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    });
  });
}
