/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import embedTickerParser from './parsers/embed-ticker.js';
import embedSearchParser from './parsers/embed-search.js';
import carouselFeatureParser from './parsers/carousel-feature.js';
import cardsVideoParser from './parsers/cards-video.js';
import cardsIconParser from './parsers/cards-icon.js';
import cardsNewsParser from './parsers/cards-news.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/flinders-cleanup.js';
import sectionsTransformer from './transformers/flinders-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'embed-ticker': embedTickerParser,
  'embed-search': embedSearchParser,
  'carousel-feature': carouselFeatureParser,
  'cards-video': cardsVideoParser,
  'cards-icon': cardsIconParser,
  'cards-news': cardsNewsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Flinders University homepage with hero, navigation, featured content, and calls to action',
  urls: [
    'https://www.flinders.edu.au/',
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: ['.hero-banner.tabs .flinders-banner.flinders-image'],
    },
    {
      name: 'embed-ticker',
      instances: [".iframe-component iframe[src*='slider.flinders.edu.au']"],
    },
    {
      name: 'embed-search',
      instances: ['.quick-search .quicksearch'],
    },
    {
      name: 'carousel-feature',
      instances: ['.flinders-banner.flinders-carousel'],
    },
    {
      name: 'cards-video',
      instances: ['.video-overlay.youtube-overlay-custom'],
    },
    {
      name: 'cards-icon',
      instances: [
        '.cmp-flindersonline-contentcard-carousel.carousel-0',
        '.cmp-flindersonline-contentcard-carousel.carousel-1',
        '.cmp-flindersonline-contentcard-carousel.carousel-2',
      ],
    },
    {
      name: 'cards-news',
      instances: ['.news-feed-v2'],
    },
  ],
  sections: [
    { id: 'section-1', name: 'Hero Banner', selector: '.hero-banner.tabs', style: null, blocks: ['hero-banner'], defaultContent: [] },
    { id: 'section-2', name: 'About Intro', selector: 'a#discover', style: 'gold', blocks: [], defaultContent: ['#rte-795553330b h2', '#rte-8e88248a86 p', ".cta-button a[href='/about']"] },
    { id: 'section-3', name: 'Stats Ticker', selector: '.iframe-component', style: 'gold', blocks: ['embed-ticker'], defaultContent: [] },
    { id: 'section-4', name: 'Course Search', selector: 'a#courses', style: null, blocks: ['embed-search'], defaultContent: ['#rte-9966970261 h2', '#rte-d0d2960397 p'] },
    { id: 'section-5', name: 'Feature Carousel', selector: '.flinders-banner.flinders-carousel', style: null, blocks: ['carousel-feature'], defaultContent: [] },
    { id: 'section-6', name: 'Student Stories', selector: '.video-overlay.youtube-overlay-custom', style: null, blocks: ['cards-video'], defaultContent: ['#rte-15cf17507b h2'] },
    { id: 'section-7', name: 'Life at Flinders', selector: '.cmp-flindersonline-contentcard-carousel.carousel-0', style: null, blocks: ['cards-icon'], defaultContent: ['#rte-15cf17507b h2', '#rte-a4c9b218bd p'] },
    { id: 'section-8', name: 'Research', selector: '.cmp-flindersonline-contentcard-carousel.carousel-1', style: null, blocks: ['cards-icon'], defaultContent: ['#rte-1013ddc91a h2', '#rte-930fbc3a0e p'] },
    { id: 'section-9', name: 'Getting Started', selector: '.cmp-flindersonline-contentcard-carousel.carousel-2', style: 'dark', blocks: ['cards-icon'], defaultContent: ['#rte-927c4e9322 p', '#rte-9cafd3cda3 h2'] },
    { id: 'section-10', name: 'News', selector: '.news-feed-v2', style: null, blocks: ['cards-news'], defaultContent: ['#rte-cc6b69dc17 h2'] },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
