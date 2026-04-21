/**
 * Spacer Block - Adds vertical spacing between sections
 * Reads height from first cell content (default 50px)
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const firstCell = block.querySelector('div > div');
  const height = parseInt(firstCell?.textContent?.trim(), 10) || 50;
  block.textContent = '';
  block.style.height = `${height}px`;
}
