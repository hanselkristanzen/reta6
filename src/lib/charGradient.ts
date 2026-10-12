/**
 * One continuous gradient across split characters.
 *
 * `background-clip: text` stops working on a parent whose children are transformed, so a split,
 * animated heading cannot simply sit inside a gradient. Instead every character carries the
 * same gradient (class `char-gradient`), sized to the whole line and shifted left by the
 * character's own offset, so together they read as one gradient.
 *
 * `box` must be `position: relative` (it is the offsetParent), which also keeps the measurement
 * independent of any transform a character is mid-way through.
 */
export function applyCharGradient(box: HTMLElement, chars: Element[]) {
  const width = box.offsetWidth;
  for (const node of chars) {
    const char = node as HTMLElement;
    char.style.backgroundSize = `${width}px 100%`;
    char.style.backgroundPosition = `${-char.offsetLeft}px 0`;
  }
}

/** Re-measures when the box resizes or a web font finishes loading. Returns a cleanup function. */
export function watchCharGradient(box: HTMLElement, getChars: () => Element[]): () => void {
  let frame = 0;
  const update = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => applyCharGradient(box, getChars()));
  };

  update();
  const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
  observer?.observe(box);
  document.fonts?.addEventListener("loadingdone", update);

  return () => {
    cancelAnimationFrame(frame);
    observer?.disconnect();
    document.fonts?.removeEventListener("loadingdone", update);
  };
}
