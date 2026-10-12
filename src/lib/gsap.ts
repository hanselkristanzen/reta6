import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

/**
 * One place that registers GSAP plugins, so every React Bits component shares a single
 * GSAP instance (and a single ScrollTrigger) instead of each one registering its own.
 */
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Scroll positions depend on web fonts and late layout, so measure again once both settle.
if (typeof window !== "undefined") {
  const refresh = () => ScrollTrigger.refresh();
  void document.fonts?.ready.then(refresh);
  window.addEventListener("load", refresh, { once: true });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
