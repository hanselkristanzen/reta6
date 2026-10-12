import { useEffect } from "react";

/**
 * Honors a `#section` in the address when the page first loads.
 *
 * The app renders on the client, after the browser has already tried to scroll to the fragment and
 * found nothing there, so a link such as `/#contact` would otherwise open at the top. This jumps
 * straight to the section (no smooth scroll across the whole page), and once more after the load
 * event and a short delay in case images or fonts moved it. It stops as soon as the visitor scrolls,
 * clicks or presses a key, so it never fights them.
 */
export function useHashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return undefined;

    let touched = false;
    const stop = () => {
      touched = true;
    };
    const inputs = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    inputs.forEach((name) => window.addEventListener(name, stop, { passive: true, once: true }));

    const jump = () => {
      if (!touched) document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    };
    jump();
    window.addEventListener("load", jump, { once: true });
    const later = window.setTimeout(jump, 700);

    return () => {
      window.clearTimeout(later);
      window.removeEventListener("load", jump);
      inputs.forEach((name) => window.removeEventListener(name, stop));
    };
  }, []);
}
