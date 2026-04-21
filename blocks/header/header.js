import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function createIcon(name) {
  const span = document.createElement('span');
  span.className = `icon icon-${name}`;
  span.innerHTML = `<img data-icon-name="${name}" src="/icons/${name}.svg" alt="${name}" loading="lazy">`;
  return span;
}

/**
 * Builds the two-tier tools: utility bar (text links) + action icons
 * @param {Element} navTools The nav-tools element
 */
function buildTwoTierTools(navTools) {
  const allParagraphs = [...navTools.querySelectorAll('p')];
  const utilityBar = document.createElement('div');
  utilityBar.className = 'nav-utility';
  const navActions = document.createElement('div');
  navActions.className = 'nav-actions';

  // First 3 are utility links (Staff, Students, Library)
  // Remaining are icon-based actions
  const utilityLinks = ['staff', 'students', 'library'];

  allParagraphs.forEach((p) => {
    const link = p.querySelector('a');
    if (!link) return;
    const text = link.textContent.trim().toLowerCase();

    if (utilityLinks.some((u) => text.includes(u))) {
      utilityBar.append(p);
    } else if (text.includes(':phone:') || text.includes('phone')) {
      link.textContent = '';
      link.setAttribute('aria-label', 'Contact us');
      link.append(createIcon('phone'));
      p.classList.add('nav-action-icon');
      navActions.append(p);
    } else if (text.includes('quick links') || text.includes(':bookmark:')) {
      const cleanText = link.textContent.replace(/:bookmark:/g, '').trim();
      link.textContent = '';
      link.append(document.createTextNode(cleanText));
      link.append(document.createTextNode(' '));
      link.append(createIcon('bookmark'));
      link.setAttribute('aria-label', 'Quick links');
      p.classList.add('nav-action-label');
      navActions.append(p);
    } else if (text.includes(':search:') || text.includes('search')) {
      link.textContent = '';
      link.setAttribute('aria-label', 'Search');
      link.append(createIcon('search'));
      p.classList.add('nav-action-icon');
      navActions.append(p);
    } else {
      utilityBar.append(p);
    }
  });

  navTools.textContent = '';
  navTools.append(utilityBar);
  navTools.append(navActions);
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  // Replace brand text with official Flinders logos (white + dark for scroll state)
  const brandAnchor = navBrand.querySelector('a');
  if (brandAnchor) {
    const logoWhite = document.createElement('img');
    logoWhite.className = 'nav-logo nav-logo-white';
    logoWhite.src = '/icons/flinders-logo.png';
    logoWhite.alt = 'Flinders University';
    logoWhite.height = 40;

    const logoDark = document.createElement('img');
    logoDark.className = 'nav-logo nav-logo-dark';
    logoDark.src = '/icons/flinders-logo-dark.png';
    logoDark.alt = 'Flinders University';
    logoDark.height = 40;

    brandAnchor.textContent = '';
    brandAnchor.append(logoWhite);
    brandAnchor.append(logoDark);
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll('.button').forEach((button) => {
      button.className = '';
      const buttonContainer = button.closest('.button-container');
      if (buttonContainer) {
        buttonContainer.className = '';
      }
    });

    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // Split tools into utility bar + icon actions, placing them as direct nav children
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    buildTwoTierTools(navTools);
    const utilityBar = navTools.querySelector('.nav-utility');
    const navActions = navTools.querySelector('.nav-actions');
    if (utilityBar) nav.append(utilityBar);
    if (navActions) nav.append(navActions);
    navTools.remove();
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // Scroll detection: toggle scrolled state for sticky gold nav
  const scrollThreshold = 10;
  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      navWrapper.classList.add('nav-scrolled');
    } else {
      navWrapper.classList.remove('nav-scrolled');
    }
  });
}
