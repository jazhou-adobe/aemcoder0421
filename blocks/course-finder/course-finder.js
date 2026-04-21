const SEARCH_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

const GLOBE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>';

const ARROWS_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // Row 0: search placeholder text
  const searchPlaceholder = rows[0]?.textContent?.trim() || 'Search or select a course';

  // Remaining rows: course links, last two are action buttons
  const linkRows = rows.slice(1);
  const links = [];
  linkRows.forEach((row) => {
    const anchor = row.querySelector('a');
    if (anchor) {
      links.push({ text: anchor.textContent.trim(), href: anchor.href });
    }
  });

  // Last two links are action buttons
  const courseLinks = links.slice(0, -2);
  const viewAllLink = links[links.length - 2];
  const quizLink = links[links.length - 1];

  // Clear block
  block.textContent = '';

  // Search area
  const searchArea = document.createElement('div');
  searchArea.className = 'course-finder-search';
  searchArea.innerHTML = `
    <div class="course-finder-search-box">
      <input type="text" placeholder="${searchPlaceholder}" aria-label="${searchPlaceholder}">
      <span class="course-finder-search-icon">${SEARCH_ICON}</span>
    </div>
    <div class="course-finder-toggle">
      <span class="course-finder-toggle-label">VIEWING DOMESTIC</span>
      <div class="course-finder-toggle-buttons">
        <button type="button" class="toggle-btn active" aria-label="Domestic" title="Domestic">${GLOBE_ICON}</button>
        <button type="button" class="toggle-btn" aria-label="International" title="International">${ARROWS_ICON}</button>
      </div>
    </div>
  `;
  block.append(searchArea);

  // Course pills grid
  const pillsGrid = document.createElement('div');
  pillsGrid.className = 'course-finder-pills';
  courseLinks.forEach(({ text, href }) => {
    const pill = document.createElement('a');
    pill.href = href;
    pill.className = 'course-finder-pill';
    pill.textContent = text;
    pillsGrid.append(pill);
  });

  // Action buttons at the end
  if (viewAllLink) {
    const viewAll = document.createElement('a');
    viewAll.href = viewAllLink.href;
    viewAll.className = 'course-finder-pill course-finder-pill-action';
    viewAll.textContent = viewAllLink.text;
    pillsGrid.append(viewAll);
  }
  if (quizLink) {
    const quiz = document.createElement('a');
    quiz.href = quizLink.href;
    quiz.className = 'course-finder-pill course-finder-pill-cta';
    quiz.textContent = quizLink.text;
    pillsGrid.append(quiz);
  }
  block.append(pillsGrid);

  // Search filtering
  const input = searchArea.querySelector('input');
  const pills = pillsGrid.querySelectorAll('.course-finder-pill:not(.course-finder-pill-action):not(.course-finder-pill-cta)');
  input.addEventListener('input', () => {
    const query = input.value.toLowerCase();
    pills.forEach((pill) => {
      const match = pill.textContent.toLowerCase().includes(query);
      pill.style.display = match ? '' : 'none';
    });
  });

  // Toggle buttons
  const toggleBtns = searchArea.querySelectorAll('.toggle-btn');
  const toggleLabel = searchArea.querySelector('.course-finder-toggle-label');
  toggleBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      toggleLabel.textContent = i === 0 ? 'VIEWING DOMESTIC' : 'VIEWING INTERNATIONAL';
    });
  });
}
