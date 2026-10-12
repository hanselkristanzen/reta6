/**
 * Magnet, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Animations/Magnet).
 * MIT + Commons Clause, see ./LICENSE.md.
 *
 * Changes for this site:
 * - No React state on pointer move. The original called `setPosition` with a new object on every
 *   mouse move of every Magnet on the page, re-rendering them all. The pointer is read in a
 *   requestAnimationFrame and written straight to `style.transform`.
 * - Listens only while the element is on screen, and only for a real mouse (`hover: hover` and
 *   `pointer: fine`). Touch and keyboard users get the plain button.
 * - `prefers-reduced-motion`: no movement.
 * - Ease-out curves from the site's motion tokens: a quick pull in, a slightly slower release.
 */
import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { useCanHover } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** How far outside the element the pull starts, in px. */
  padding?: number;
  disabled?: boolean;
  /** Higher is gentler: the element follows the pointer by offset / strength. */
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

export default function Magnet({
  children,
  padding = 80,
  disabled = false,
  magnetStrength = 3,
  activeTransition = "transform 320ms cubic-bezier(0.23, 1, 0.32, 1)",
  inactiveTransition = "transform 520ms cubic-bezier(0.23, 1, 0.32, 1)",
  wrapperClassName = "",
  innerClassName = "",
  ...props
}: MagnetProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const canHover = useCanHover();
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner || disabled || !canHover || reduced) return;

    let frame = 0;
    let pointer: { x: number; y: number } | null = null;
    let listening = false;

    const apply = () => {
      frame = 0;
      if (!pointer) return;
      const { left, top, width, height } = wrapper.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const near = Math.abs(centerX - pointer.x) < width / 2 + padding && Math.abs(centerY - pointer.y) < height / 2 + padding;
      inner.style.transition = near ? activeTransition : inactiveTransition;
      inner.style.transform = near
        ? `translate3d(${(pointer.x - centerX) / magnetStrength}px, ${(pointer.y - centerY) / magnetStrength}px, 0)`
        : "translate3d(0, 0, 0)";
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) window.addEventListener("pointermove", onMove, { passive: true });
      else {
        window.removeEventListener("pointermove", onMove);
        pointer = null;
        inner.style.transition = inactiveTransition;
        inner.style.transform = "translate3d(0, 0, 0)";
      }
    };

    const observer = new IntersectionObserver(([entry]) => listen(entry.isIntersecting), { rootMargin: `${padding}px` });
    observer.observe(wrapper);

    return () => {
      observer.disconnect();
      listen(false);
      cancelAnimationFrame(frame);
      inner.style.transform = "";
      inner.style.transition = "";
    };
  }, [disabled, canHover, reduced, padding, magnetStrength, activeTransition, inactiveTransition]);

  return (
    <div ref={wrapperRef} className={`relative inline-block ${wrapperClassName}`} {...props}>
      <div ref={innerRef} className={`will-change-transform ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}
