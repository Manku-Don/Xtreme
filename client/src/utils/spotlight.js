// Tracks the cursor position within a card and writes it to CSS custom
// properties (--x, --y) that the `.card-spotlight` utility in index.css
// reads to paint a soft radial highlight under the pointer.
export function handleSpotlightMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
}
