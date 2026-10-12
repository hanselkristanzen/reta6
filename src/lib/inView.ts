interface InViewOptions {
  /** Share of the element that must be visible. */
  threshold?: number;
  /** Same syntax as CSS margin; a negative bottom value waits until the element is a little inside the viewport. */
  rootMargin?: string;
}

/**
 * Calls `callback` once, the first time `element` is on screen.
 *
 * Unlike a plain IntersectionObserver callback, an element that is already ABOVE the viewport
 * (the visitor deep-linked to #contact and then scrolled up) counts as seen, so reveal effects
 * never leave content hidden behind a trigger that has already been passed.
 * Returns a cleanup function.
 */
export function onceInView(element: Element, callback: () => void, options: InViewOptions = {}): () => void {
  if (typeof IntersectionObserver === "undefined") {
    callback();
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          observer.disconnect();
          callback();
          break;
        }
      }
    },
    { threshold: options.threshold ?? 0.1, rootMargin: options.rootMargin ?? "0px 0px -6% 0px" },
  );

  observer.observe(element);
  return () => observer.disconnect();
}
