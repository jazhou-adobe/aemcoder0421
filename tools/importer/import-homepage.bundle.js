var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const bgImg = element.querySelector(".hero_banner.desktop-only img.hero-image, img.hero-image");
    const heading = element.querySelector(".hero-description h1, .hero-description h2");
    const ctas = Array.from(element.querySelectorAll(".hero-description .cta-button a"));
    const cells = [];
    if (bgImg) {
      cells.push([bgImg]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    contentCell.push(...ctas);
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-ticker.js
  function parse2(element, { document }) {
    const iframe = element.tagName === "IFRAME" ? element : element.querySelector("iframe");
    const src = iframe ? iframe.getAttribute("src") : "";
    const cells = [];
    if (src) {
      const link = document.createElement("a");
      link.href = src;
      link.textContent = src;
      cells.push([link]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-ticker", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-search.js
  function parse3(element, { document }) {
    const link = document.createElement("a");
    link.href = "https://www.flinders.edu.au/study/explore";
    link.textContent = "https://www.flinders.edu.au/study/explore";
    const cells = [[link]];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-search", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-feature.js
  function parse4(element, { document }) {
    const slides = Array.from(
      element.querySelectorAll(".flinders-hero-swiper.desktop-only .swiper-slide.herobanner-slide")
    );
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".hero_banner img.hero-image");
      const desc = slide.querySelector(".hero-description");
      const heading = desc ? desc.querySelector("h2, h3") : null;
      const paragraph = desc ? desc.querySelector(".rte-text-online, .cmp-text p") : null;
      const ctaLink = desc ? desc.querySelector("a[href]") : null;
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (paragraph && paragraph !== heading) contentCell.push(paragraph);
      if (ctaLink) contentCell.push(ctaLink);
      if (img || contentCell.length > 0) {
        cells.push([img || "", contentCell.length > 0 ? contentCell : ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-video.js
  function parse5(element, { document }) {
    const parentRow = element.closest(".content_middle") || element.closest(".row");
    if (!parentRow) {
      const block2 = WebImporter.Blocks.createBlock(document, { name: "cards-video", cells: [] });
      element.replaceWith(block2);
      return;
    }
    const videoContainer = element.closest(".video-container");
    const img = videoContainer ? videoContainer.querySelector(".video-image > img") : null;
    const videoLink = videoContainer ? videoContainer.querySelector('a[href*="youtube"]') : null;
    const textCol = parentRow.querySelector(".col-lg-8");
    const quoteText = textCol ? textCol.querySelector(".cmp-text p, .rte p") : null;
    const iconImg = textCol ? textCol.querySelector(".cmp-image__image, .cmp-image img") : null;
    const contentCell = [];
    if (quoteText) contentCell.push(quoteText);
    if (videoLink) {
      const link = document.createElement("a");
      link.href = videoLink.href;
      link.textContent = "Watch video";
      contentCell.push(link);
    }
    const cells = [];
    if (img || contentCell.length > 0) {
      cells.push([img || "", contentCell.length > 0 ? contentCell : ""]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-icon.js
  function parse6(element, { document }) {
    const slides = Array.from(element.querySelectorAll(".swiper-slide"));
    const cells = [];
    slides.forEach((slide) => {
      const tile = slide.querySelector(".contentcard-tile");
      if (!tile) return;
      const icon = tile.querySelector(".card-icon img");
      const heading = tile.querySelector(".rte h3, .rte h2");
      const description = tile.querySelector(".rte p");
      const ctaLink = tile.querySelector('a.cta-button, a[class*="cta"]');
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);
      if (ctaLink) contentCell.push(ctaLink);
      if (icon || contentCell.length > 0) {
        cells.push([icon || "", contentCell.length > 0 ? contentCell : ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-icon", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse7(element, { document }) {
    const articles = Array.from(element.querySelectorAll(".component_section_item"));
    const cells = [];
    articles.forEach((article) => {
      const img = article.querySelector("img:not(.news_overlay img)") || article.querySelector(".news-overlay-layout img") || article.querySelector("img");
      const headline = article.querySelector(".news_title h3, h3");
      const dateSpan = article.querySelector(".news_date_month");
      const readMore = article.querySelector('.news_details a, a[class*="transparent_button"]');
      const contentCell = [];
      if (headline) contentCell.push(headline);
      if (dateSpan) {
        const datePara = document.createElement("p");
        datePara.textContent = dateSpan.textContent.trim();
        contentCell.push(datePara);
      }
      if (readMore) contentCell.push(readMore);
      if (img || contentCell.length > 0) {
        cells.push([img || "", contentCell.length > 0 ? contentCell : ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/flinders-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#gdpr_notification_container",
        ".gdpr-notification"
      ]);
      WebImporter.DOMUtils.remove(element, ["#ajax-loader-overlay"]);
      WebImporter.DOMUtils.remove(element, [".spacer-component"]);
      WebImporter.DOMUtils.remove(element, [
        "#dom_int_toggle_show_input",
        "#dom_redirect_url",
        "#int_redirect_url"
      ]);
      WebImporter.DOMUtils.remove(element, [".flinders-hero-swiper-mobile"]);
      WebImporter.DOMUtils.remove(element, [
        ".quicksearch__select",
        ".show_more_container"
      ]);
      WebImporter.DOMUtils.remove(element, [".cmp-tabs__tablist"]);
      WebImporter.DOMUtils.remove(element, [".promotion-switch-tab-2"]);
      const inactivePanels = element.querySelectorAll(".cmp-tabs__tabpanel:not(.cmp-tabs__tabpanel--active)");
      inactivePanels.forEach((panel) => panel.remove());
      WebImporter.DOMUtils.remove(element, [
        ".dom_int_toggle",
        "#dom_int_toggle_international",
        "#dom_int_toggle_domestic"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".main_header_container",
        ".navigation-global",
        ".header-tail",
        ".header_section_component"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".footer",
        ".footer_main",
        ".sub-footer",
        ".social-footer",
        ".footer_uni_content",
        ".footer_line",
        ".footer_contacts",
        ".footer_list",
        ".footer_copyright"
      ]);
      WebImporter.DOMUtils.remove(element, [".scroll-top"]);
      WebImporter.DOMUtils.remove(element, ['[class*="reciteme"]']);
      const intlNotice = element.querySelector('[class*="dom_int_notification"]');
      if (intlNotice) intlNotice.remove();
      element.querySelectorAll('a[href="about:blank"]').forEach((el) => {
        const parent = el.closest("p") || el;
        parent.remove();
      });
      element.querySelectorAll("p").forEach((p) => {
        const text = p.textContent.trim();
        if (text.startsWith("You are viewing") && text.includes("student")) {
          p.remove();
        }
        if (text === "\xD7") p.remove();
      });
      element.querySelectorAll('img[src*="reference-components/social-footer"]').forEach((img) => {
        const linkParent = img.closest("p") || img.closest("a");
        if (linkParent) linkParent.remove();
      });
      element.querySelectorAll("h4").forEach((h4) => {
        if (h4.textContent.trim() === "Follow Flinders") h4.remove();
      });
      element.querySelectorAll('img[src*="reciteme"]').forEach((img) => {
        const p = img.closest("p") || img;
        p.remove();
      });
      element.querySelectorAll("p").forEach((p) => {
        const link = p.querySelector('a[href^="/study/"]');
        if (link && p.children.length === 1 && p.childElementCount === 1) {
          const inBlock = p.closest('[class*="carousel"], [class*="cards"], [class*="hero"], [class*="embed"]');
          if (!inBlock) {
            const text = p.textContent.trim();
            if (/^(Business|Computer science|Creative arts|Criminology|Defence|Education|Engineering|Environment|Health|Humanities|International relations|Languages|Law|Medicine|Nursing|Psychology|Science|Social Work|Sport|View all courses|Not sure yet)/.test(text)) {
              p.remove();
            }
          }
        }
        if (p.textContent.trim() === "VIEWING DOMESTICINTERNATIONAL") p.remove();
      });
      element.querySelectorAll("ul").forEach((ul) => {
        const items = Array.from(ul.querySelectorAll("li"));
        const names = items.map((li) => li.textContent.trim());
        if (names.length <= 5 && names.every((n) => /^[A-Z][a-z]+$/.test(n))) {
          ul.remove();
        }
      });
      element.querySelectorAll('img[src*="bg-waves"]').forEach((img) => {
        const p = img.closest("p") || img;
        p.remove();
      });
      element.querySelectorAll('a[href="about:blank"]').forEach((a) => {
        const p = a.closest("p") || a;
        p.remove();
      });
      element.querySelectorAll("p").forEach((p) => {
        const t = p.textContent.trim();
        if (t.startsWith("You are viewing") || t === "\xD7" || t === "VIEWING DOMESTICINTERNATIONAL") {
          p.remove();
        }
        if (t.startsWith("*") || t.startsWith("^") || t.startsWith("\u2020")) {
          if (t.includes("Flinders is ranked") || t.includes("Ranked #1") || t.includes("Ranked")) {
            p.remove();
          }
        }
      });
      element.querySelectorAll("p > sup:first-child").forEach((sup) => {
        const p = sup.parentElement;
        if (p && p.tagName === "P" && (p.textContent.includes("Flinders is ranked") || p.textContent.includes("Ranked #1") || p.textContent.includes("CRICOS"))) {
          p.remove();
        }
      });
      element.querySelectorAll("p").forEach((p) => {
        const img = p.querySelector("img");
        if (img && p.childElementCount === 1 && p.children[0] === img) {
          const src = img.getAttribute("src") || "";
          if (src.includes("bg-waves") || src.includes("high-school-02") || src.includes("reciteme")) {
            p.remove();
          }
        }
      });
      WebImporter.DOMUtils.remove(element, ["noscript", "link", "script"]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-analytics");
      });
    }
  }

  // tools/importer/transformers/flinders-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const doc = element.ownerDocument || document;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-banner": parse,
    "embed-ticker": parse2,
    "embed-search": parse3,
    "carousel-feature": parse4,
    "cards-video": parse5,
    "cards-icon": parse6,
    "cards-news": parse7
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Flinders University homepage with hero, navigation, featured content, and calls to action",
    urls: [
      "https://www.flinders.edu.au/"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: [".hero-banner.tabs .flinders-banner.flinders-image"]
      },
      {
        name: "embed-ticker",
        instances: [".iframe-component iframe[src*='slider.flinders.edu.au']"]
      },
      {
        name: "embed-search",
        instances: [".quick-search .quicksearch"]
      },
      {
        name: "carousel-feature",
        instances: [".flinders-banner.flinders-carousel"]
      },
      {
        name: "cards-video",
        instances: [".video-overlay.youtube-overlay-custom"]
      },
      {
        name: "cards-icon",
        instances: [
          ".cmp-flindersonline-contentcard-carousel.carousel-0",
          ".cmp-flindersonline-contentcard-carousel.carousel-1",
          ".cmp-flindersonline-contentcard-carousel.carousel-2"
        ]
      },
      {
        name: "cards-news",
        instances: [".news-feed-v2"]
      }
    ],
    sections: [
      { id: "section-1", name: "Hero Banner", selector: ".hero-banner.tabs", style: null, blocks: ["hero-banner"], defaultContent: [] },
      { id: "section-2", name: "About Intro", selector: "a#discover", style: "gold", blocks: [], defaultContent: ["#rte-795553330b h2", "#rte-8e88248a86 p", ".cta-button a[href='/about']"] },
      { id: "section-3", name: "Stats Ticker", selector: ".iframe-component", style: "gold", blocks: ["embed-ticker"], defaultContent: [] },
      { id: "section-4", name: "Course Search", selector: "a#courses", style: null, blocks: ["embed-search"], defaultContent: ["#rte-9966970261 h2", "#rte-d0d2960397 p"] },
      { id: "section-5", name: "Feature Carousel", selector: ".flinders-banner.flinders-carousel", style: null, blocks: ["carousel-feature"], defaultContent: [] },
      { id: "section-6", name: "Student Stories", selector: ".video-overlay.youtube-overlay-custom", style: null, blocks: ["cards-video"], defaultContent: ["#rte-15cf17507b h2"] },
      { id: "section-7", name: "Life at Flinders", selector: ".cmp-flindersonline-contentcard-carousel.carousel-0", style: null, blocks: ["cards-icon"], defaultContent: ["#rte-15cf17507b h2", "#rte-a4c9b218bd p"] },
      { id: "section-8", name: "Research", selector: ".cmp-flindersonline-contentcard-carousel.carousel-1", style: null, blocks: ["cards-icon"], defaultContent: ["#rte-1013ddc91a h2", "#rte-930fbc3a0e p"] },
      { id: "section-9", name: "Getting Started", selector: ".cmp-flindersonline-contentcard-carousel.carousel-2", style: "dark", blocks: ["cards-icon"], defaultContent: ["#rte-927c4e9322 p", "#rte-9cafd3cda3 h2"] },
      { id: "section-10", name: "News", selector: ".news-feed-v2", style: null, blocks: ["cards-news"], defaultContent: ["#rte-cc6b69dc17 h2"] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
