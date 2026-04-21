/**
 * About Intro Block
 * White card with centered heading, text, and CTA on gold background
 * @param {Element} block The block element
 */
export default function decorate(block) {
  // Find the last link and style it as a CTA button with arrow
  const links = block.querySelectorAll('a');
  const cta = links[links.length - 1];
  if (cta) {
    cta.classList.add('about-intro-cta');
    const arrow = document.createElement('span');
    arrow.className = 'about-intro-cta-arrow';
    arrow.textContent = '›';
    cta.append(arrow);
  }
}
