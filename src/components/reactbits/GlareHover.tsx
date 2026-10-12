/**
 * GlareHover, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Animations/GlareHover).
 * MIT + Commons Clause, see ./LICENSE.md.
 *
 * Changes for this site:
 * - Sized and styled by `className` (the original forced a 500x500 grid cell with its own
 *   background and border props), so it can wrap a photo or a card of any size.
 * - Only a real mouse triggers it (`hover: hover` and `pointer: fine`); a tap on a touch screen
 *   does not leave the glare stuck.
 * - The glare is a `background-position` transition on a `pointer-events: none` overlay.
 * - `prefers-reduced-motion`: no glare.
 */
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface GlareHoverProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Hex colour of the glare. */
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  /** Milliseconds. */
  transitionDuration?: number;
  playOnce?: boolean;
}

function toRgba(color: string, opacity: number): string {
  const hex = color.replace("#", "");
  if (/^[\dA-Fa-f]{6}$/.test(hex)) {
    return `rgba(${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)}, ${opacity})`;
  }
  if (/^[\dA-Fa-f]{3}$/.test(hex)) {
    return `rgba(${parseInt(hex[0] + hex[0], 16)}, ${parseInt(hex[1] + hex[1], 16)}, ${parseInt(hex[2] + hex[2], 16)}, ${opacity})`;
  }
  return color;
}

export default function GlareHover({
  children,
  className = "",
  style,
  glareColor = "#ffffff",
  glareOpacity = 0.4,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 700,
  playOnce = false,
}: GlareHoverProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const animateIn = (event: React.PointerEvent) => {
    const el = overlayRef.current;
    if (!el || event.pointerType !== "mouse") return;
    el.style.transition = "none";
    el.style.backgroundPosition = "-100% -100%, 0 0";
    void el.offsetWidth; // commit the reset before the sweep starts
    el.style.transition = `${transitionDuration}ms cubic-bezier(0.23, 1, 0.32, 1)`;
    el.style.backgroundPosition = "100% 100%, 0 0";
  };

  const animateOut = (event: React.PointerEvent) => {
    const el = overlayRef.current;
    if (!el || event.pointerType !== "mouse") return;
    el.style.transition = playOnce ? "none" : `${transitionDuration}ms cubic-bezier(0.23, 1, 0.32, 1)`;
    el.style.backgroundPosition = "-100% -100%, 0 0";
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={style}
      onPointerEnter={reduced ? undefined : animateIn}
      onPointerLeave={reduced ? undefined : animateOut}
    >
      {children}
      {!reduced && (
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: `linear-gradient(${glareAngle}deg, hsla(0,0%,0%,0) 60%, ${toRgba(glareColor, glareOpacity)} 70%, hsla(0,0%,0%,0) 100%)`,
            backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "-100% -100%, 0 0",
          }}
        />
      )}
    </div>
  );
}
