/**
 * ClickSpark, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Animations/ClickSpark).
 * MIT + Commons Clause, see ./LICENSE.md.
 *
 * Changes for this site:
 * - The animation loop runs only while sparks exist. The original redrew an empty canvas on every
 *   frame for the life of the page.
 * - The canvas extends past its wrapper by the spark radius, so a spark at a button's edge is not clipped,
 *   and it is drawn at device pixel ratio.
 * - A keyboard-initiated click (no pointer position) sparks from the middle of the clicked element.
 * - `sparkColor` may be a CSS variable of the palette (resolved when the click happens, so it follows the theme).
 * - `prefers-reduced-motion`: no sparks.
 * - `className` on the wrapper, instead of a forced `w-full h-full`.
 */
import { useCallback, useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  extraScale?: number;
  className?: string;
  children?: ReactNode;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
  color: string;
}

const EASE = {
  linear: (t: number) => t,
  "ease-in": (t: number) => t * t,
  "ease-in-out": (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  "ease-out": (t: number) => t * (2 - t),
};

export default function ClickSpark({
  sparkColor = "#fff",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1,
  className = "",
  children,
}: ClickSparkProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const frameRef = useRef(0);
  const spill = Math.ceil(sparkRadius * extraScale + sparkSize + 6);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = wrapper.getBoundingClientRect();
    canvas.width = Math.round((width + spill * 2) * ratio);
    canvas.height = Math.round((height + spill * 2) * ratio);
    canvas.getContext("2d")?.setTransform(ratio, 0, 0, ratio, 0, 0);
  }, [spill]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, [resize]);

  const draw = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const ease = EASE[easing];

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const eased = ease(elapsed / duration);
        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        ctx.strokeStyle = spark.color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(spark.x + distance * Math.cos(spark.angle), spark.y + distance * Math.sin(spark.angle));
        ctx.lineTo(
          spark.x + (distance + lineLength) * Math.cos(spark.angle),
          spark.y + (distance + lineLength) * Math.sin(spark.angle),
        );
        ctx.stroke();
        return true;
      });

      frameRef.current = sparksRef.current.length ? requestAnimationFrame(draw) : 0;
    },
    [duration, easing, extraScale, sparkRadius, sparkSize],
  );

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const wrapper = wrapperRef.current;
    if (!wrapper || prefersReducedMotion()) return;

    const rect = wrapper.getBoundingClientRect();
    const keyboard = event.detail === 0 && event.clientX === 0 && event.clientY === 0;
    const target = (event.target as HTMLElement).getBoundingClientRect();
    const x = (keyboard ? target.left + target.width / 2 : event.clientX) - rect.left + spill;
    const y = (keyboard ? target.top + target.height / 2 : event.clientY) - rect.top + spill;

    let color = sparkColor;
    const variable = /^var\((--[\w-]+)\)$/.exec(sparkColor);
    if (variable) color = getComputedStyle(wrapper).getPropertyValue(variable[1]).trim() || "#fff";

    const now = performance.now();
    sparksRef.current.push(
      ...Array.from({ length: sparkCount }, (_, i) => ({ x, y, angle: (2 * Math.PI * i) / sparkCount, startTime: now, color })),
    );
    if (!frameRef.current) frameRef.current = requestAnimationFrame(draw);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`} onClick={handleClick}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute z-20"
        style={{ left: -spill, top: -spill }}
      />
      {children}
    </div>
  );
}
