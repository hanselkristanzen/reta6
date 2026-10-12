/**
 * MagicBento, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Components/MagicBento).
 * MIT + Commons Clause, see ./LICENSE.md.
 *
 * Kept from upstream: the proximity glow that follows the cursor across the whole grid (per-card
 * `--glow-x/--glow-y/--glow-intensity` driven by distance to the card), the glowing border ring,
 * the drifting star particles on hover, the small magnetic pull and the click ripple.
 *
 * Changes for this site:
 * - Data-driven: it takes `cards` with real content (a grid of skill groups) instead of the demo
 *   `cardData`, and the grid layout is set by the caller through each card's `className`.
 * - Colours are the site's role tokens plus a `glowColor` "r, g, b" triple for the rings and stars,
 *   so the section follows the light and dark themes. The upstream purple palette and its inline
 *   <style> block (hard-coded greys and purples) are gone; the styles live in index.css (.bento-*).
 * - The 800px fixed spotlight element that blends with `mix-blend-mode: screen` is removed: it is
 *   invisible on a light page. The same effect is carried by the in-card radial glow.
 * - Everything cursor-driven runs for a real mouse only (`hover: hover` and `pointer: fine`) and not
 *   under `prefers-reduced-motion`; touch and reduced-motion visitors get a still, fully readable grid.
 * - The pointer listener is one rAF-throttled `pointermove` on the window that only works while the
 *   grid is on screen (IntersectionObserver); particles start from a small scale, not from zero, and
 *   are removed on leave and on unmount.
 * - Cards are keyboard-reachable only when the caller makes their content interactive; the card
 *   itself is a plain `<li>` with a heading, so the effect never traps focus.
 */
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useCanHover } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface BentoCard {
  id: string;
  label: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export interface MagicBentoProps {
  cards: BentoCard[];
  /** "r, g, b" of the glow, for example "0, 68, 102". */
  glowColor: string;
  className?: string;
  enableStars?: boolean;
  enableBorderGlow?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  particleCount?: number;
  spotlightRadius?: number;
}

function BentoItem({
  card,
  animate,
  glowColor,
  enableStars,
  enableMagnetism,
  clickEffect,
  particleCount,
}: {
  card: BentoCard;
  animate: boolean;
  glowColor: string;
  enableStars: boolean;
  enableMagnetism: boolean;
  clickEffect: boolean;
  particleCount: number;
}) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !animate) return undefined;

    const particles: HTMLElement[] = [];
    const timers: number[] = [];
    let hovered = false;

    const clearParticles = () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.length = 0;
      particles.splice(0).forEach((particle) => {
        gsap.killTweensOf(particle);
        gsap.to(particle, {
          opacity: 0,
          scale: 0.6,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => particle.remove(),
        });
      });
    };

    const spawnParticles = () => {
      const { width, height } = element.getBoundingClientRect();
      for (let i = 0; i < particleCount; i++) {
        timers.push(
          window.setTimeout(() => {
            if (!hovered) return;
            const particle = document.createElement("span");
            particle.className = "bento-particle";
            particle.setAttribute("aria-hidden", "true");
            particle.style.left = `${Math.random() * width}px`;
            particle.style.top = `${Math.random() * height}px`;
            element.appendChild(particle);
            particles.push(particle);
            gsap.fromTo(particle, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
            gsap.to(particle, {
              x: (Math.random() - 0.5) * 90,
              y: (Math.random() - 0.5) * 90,
              duration: 2 + Math.random() * 2,
              ease: "none",
              repeat: -1,
              yoyo: true,
            });
            gsap.to(particle, { opacity: 0.35, duration: 1.5, ease: "power2.inOut", repeat: -1, yoyo: true });
          }, i * 100),
        );
      }
    };

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      hovered = true;
      if (enableStars) spawnParticles();
    };

    const onLeave = () => {
      hovered = false;
      clearParticles();
      if (enableMagnetism) gsap.to(element, { x: 0, y: 0, duration: 0.4, ease: "power3.out" });
    };

    const onMove = (event: PointerEvent) => {
      if (!enableMagnetism || event.pointerType !== "mouse") return;
      const rect = element.getBoundingClientRect();
      gsap.to(element, {
        x: (event.clientX - rect.left - rect.width / 2) * 0.03,
        y: (event.clientY - rect.top - rect.height / 2) * 0.03,
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const onClick = (event: MouseEvent) => {
      if (!clickEffect || event.detail === 0) return;
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const reach = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      );
      const ripple = document.createElement("span");
      ripple.className = "bento-ripple";
      ripple.setAttribute("aria-hidden", "true");
      ripple.style.cssText = `width:${reach * 2}px;height:${reach * 2}px;left:${x - reach}px;top:${y - reach}px;`;
      element.appendChild(ripple);
      gsap.fromTo(
        ripple,
        { scale: 0.05, opacity: 1 },
        { scale: 1, opacity: 0, duration: 0.8, ease: "power2.out", onComplete: () => ripple.remove() },
      );
    };

    element.addEventListener("pointerenter", onEnter);
    element.addEventListener("pointerleave", onLeave);
    element.addEventListener("pointermove", onMove);
    element.addEventListener("click", onClick);

    return () => {
      hovered = false;
      element.removeEventListener("pointerenter", onEnter);
      element.removeEventListener("pointerleave", onLeave);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("click", onClick);
      timers.forEach((timer) => window.clearTimeout(timer));
      particles.splice(0).forEach((particle) => {
        gsap.killTweensOf(particle);
        particle.remove();
      });
      gsap.killTweensOf(element);
    };
  }, [animate, enableStars, enableMagnetism, clickEffect, particleCount]);

  return (
    <li
      ref={ref}
      className={`bento-card ${card.className ?? ""}`}
      style={{ "--glow-rgb": glowColor } as CSSProperties}
    >
      <div className="relative z-[2] flex h-full flex-col gap-4">
        <div>
          <p className="type-eyebrow">{card.label}</p>
          <h3 className="type-h3 mt-2">{card.title}</h3>
          {card.description ? <p className="mt-2 text-sm text-ink-2">{card.description}</p> : null}
        </div>
        {card.children}
      </div>
    </li>
  );
}

export default function MagicBento({
  cards,
  glowColor,
  className = "",
  enableStars = true,
  enableBorderGlow = true,
  enableMagnetism = true,
  clickEffect = true,
  particleCount = 8,
  spotlightRadius = 280,
}: MagicBentoProps) {
  const gridRef = useRef<HTMLUListElement>(null);
  const canHover = useCanHover();
  const reduced = useReducedMotion();
  const animate = canHover && !reduced;

  /* One pointer listener for the whole grid: each card's glow depends on how close the cursor is. */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !animate || !enableBorderGlow) return undefined;

    const proximity = spotlightRadius * 0.5;
    const fade = spotlightRadius * 0.75;
    let onScreen = false;
    let raf = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      raf = 0;
      grid.querySelectorAll<HTMLElement>(".bento-card").forEach((card) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.max(
          0,
          Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2)) - Math.max(rect.width, rect.height) / 2,
        );
        const intensity = distance <= proximity ? 1 : distance <= fade ? (fade - distance) / (fade - proximity) : 0;
        card.style.setProperty("--glow-x", `${((x - rect.left) / rect.width) * 100}%`);
        card.style.setProperty("--glow-y", `${((y - rect.top) / rect.height) * 100}%`);
        card.style.setProperty("--glow-intensity", intensity.toFixed(3));
        card.style.setProperty("--glow-radius", `${spotlightRadius}px`);
      });
    };

    const clear = () => {
      grid.querySelectorAll<HTMLElement>(".bento-card").forEach((card) => card.style.setProperty("--glow-intensity", "0"));
    };

    const onMove = (event: PointerEvent) => {
      if (!onScreen || event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (!onScreen) clear();
      },
      { rootMargin: "120px 0px" },
    );
    observer.observe(grid);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", clear);

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", clear);
      clear();
    };
  }, [animate, enableBorderGlow, spotlightRadius]);

  return (
    <ul ref={gridRef} className={`bento-grid ${enableBorderGlow ? "bento-glow" : ""} ${className}`}>
      {cards.map((card) => (
        <BentoItem
          key={card.id}
          card={card}
          animate={animate}
          glowColor={glowColor}
          enableStars={enableStars}
          enableMagnetism={enableMagnetism}
          clickEffect={clickEffect}
          particleCount={particleCount}
        />
      ))}
    </ul>
  );
}
