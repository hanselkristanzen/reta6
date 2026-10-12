/**
 * Dock, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Components/Dock).
 * MIT + Commons Clause, see ./LICENSE.md.
 *
 * Kept from upstream: the magnification model (cosine falloff over `distance`), the damped-spring
 * integration that drives each icon's size, the `fit` scaling that shrinks the whole dock to the
 * space it has, the tooltip labels, the active dot and arrow / Home / End keyboard movement.
 *
 * Changes for this site:
 * - Items are links (`href`) so they are real anchors: they work without script, show the target
 *   in the status bar and take the page's smooth anchor scroll. `aria-current` marks the active one.
 * - Colours come from the site's role tokens (`--c-*`) instead of the upstream dark/light hex maps,
 *   so the dock follows the theme switch with no `theme` prop.
 * - Removed features this page does not use: context menus and long-press, the click "hop"
 *   (the brief asks for no excessive bounce), count badges and auto-hide. Roughly 600 lines go with them.
 * - New `hidden` prop: the page shows the dock only once the visitor has scrolled past the hero.
 *   While hidden the dock is `inert`, so it cannot take focus.
 * - Magnification follows a real mouse only, and is off under `prefers-reduced-motion`. Hover
 *   labels only exist on hover-capable pointers.
 * - The animation loop sleeps when every icon is at rest, and the window listeners are removed on unmount.
 */
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";

export interface DockItemData {
  icon?: ReactNode;
  label?: string;
  href?: string;
  active?: boolean;
  separator?: boolean;
}

export interface DockProps {
  items: DockItemData[];
  baseItemSize?: number;
  magnification?: number;
  distance?: number;
  panelHeight?: number;
  gap?: number;
  roundness?: number;
  hidden?: boolean;
  label?: string;
  className?: string;
}

interface Spring {
  size: number;
  velocity: number;
  drawn: string;
  node: HTMLElement | null;
}

const EDGE = 12;
const STIFFNESS = 150;
const MASS = 0.1;
const DAMPING = 12;

const ROOT =
  "absolute bottom-3 left-1/2 z-10 flex h-[var(--dock-thickness)] items-end [transform:translateX(-50%)] gap-[var(--dock-gap)] box-border p-[var(--dock-pad)] rounded-[calc(var(--dock-base)*var(--dock-round)*0.5_+_var(--dock-pad))] [background:var(--dock-panel)] [box-shadow:inset_0_0_0_1px_var(--dock-panel-edge),inset_0_1px_0_var(--dock-panel-highlight),var(--dock-panel-shadow)] backdrop-blur-[20px] backdrop-saturate-[1.6] [transition:translate_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.2s_ease] data-[hidden]:pointer-events-none data-[hidden]:opacity-0 data-[hidden]:[translate:0_calc(100%_+_12px)] data-[hidden]:[transition:translate_0.36s_cubic-bezier(0.55,0,0.75,0.15),opacity_0.24s_ease_0.1s] motion-reduce:!transition-none before:absolute before:inset-x-0 before:bottom-full before:-z-10 before:hidden before:h-[calc(var(--dock-reach)_+_8px)] before:content-[''] hover:before:block";

const ITEM =
  "group relative m-0 flex-none cursor-pointer select-none rounded-[calc(var(--dock-base)*var(--dock-round)*0.5)] border-0 bg-transparent p-0 text-[color:var(--dock-ink)] no-underline outline-none [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] w-[var(--dock-base)] h-[var(--dock-base)] focus-visible:z-[1]";

const TILE = "pointer-events-none absolute left-0 top-0 h-[var(--dock-base)] w-[var(--dock-base)] origin-top-left";

const FACE =
  "absolute inset-0 flex items-center justify-center overflow-hidden leading-none rounded-[calc(var(--dock-base)*var(--dock-round)*0.5)] [background:var(--dock-tile)] [box-shadow:inset_0_0_0_1px_var(--dock-tile-edge),inset_0_1px_0_var(--dock-tile-highlight),var(--dock-tile-shadow)] [font-size:calc(var(--dock-base)*0.44)] [transition:filter_0.2s_ease,color_0.2s_ease] group-active:[filter:var(--dock-press)] group-active:[transition-duration:0s] group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-[3px] group-focus-visible:outline-[color:var(--dock-accent)] group-aria-[current=true]:text-[color:var(--dock-active-ink)]";

const DOT =
  "pointer-events-none absolute left-1/2 -ml-[2px] top-[calc(100%_+_max(var(--dock-pad)/2,5px)_-_2px)] h-1 w-1 rounded-full [background:var(--dock-dot)]";

const LABEL =
  "pointer-events-none absolute bottom-[calc(100%_+_12px)] left-1/2 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[12px] font-medium leading-none opacity-0 [background:var(--dock-label)] text-[color:var(--dock-label-ink)] [box-shadow:0_8px_20px_-8px_var(--c-shadow)] [transform:translate(-50%,4px)] [transition:opacity_0.16s_ease,transform_0.16s_ease] [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:[transform:translate(-50%,0)] group-focus-visible:opacity-100 group-focus-visible:[transform:translate(-50%,0)]";

const SEPARATOR = "h-[calc(var(--dock-base)*0.72)] w-px flex-none self-center rounded-[1px] [background:var(--dock-separator)]";

/** Every colour is a site role token, so the dock follows the theme with no extra state. */
const TOKENS: Record<string, string> = {
  "--dock-panel": "color-mix(in oklab, var(--c-bg) 68%, transparent)",
  "--dock-panel-edge": "var(--c-line)",
  "--dock-panel-highlight": "color-mix(in oklab, var(--c-ink) 10%, transparent)",
  "--dock-panel-shadow": "0 22px 44px -20px var(--c-shadow), 0 6px 16px -8px var(--c-shadow)",
  "--dock-tile": "linear-gradient(180deg, var(--c-surface) 0%, var(--c-surface-2) 100%)",
  "--dock-tile-edge": "var(--c-line)",
  "--dock-tile-highlight": "color-mix(in oklab, white 38%, transparent)",
  "--dock-tile-shadow": "0 4px 10px -4px var(--c-shadow)",
  "--dock-ink": "var(--c-ink-2)",
  "--dock-active-ink": "var(--c-link)",
  "--dock-label": "var(--c-ink)",
  "--dock-label-ink": "var(--c-bg)",
  "--dock-dot": "var(--c-accent)",
  "--dock-separator": "var(--c-line-strong)",
  "--dock-press": "brightness(0.92)",
  "--dock-accent": "var(--c-focus)",
};

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function Dock({
  items,
  baseItemSize = 44,
  magnification = 62,
  distance = 150,
  panelHeight = 60,
  gap = 8,
  roundness = 0.5,
  hidden = false,
  label = "Quick navigation",
  className = "",
}: DockProps) {
  const rootRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const wakeRef = useRef<(() => void) | null>(null);
  const focusedRef = useRef(-1);
  const [fit, setFit] = useState(1);

  const rawBase = Math.max(16, baseItemSize);
  const rawPeak = Math.max(rawBase, magnification);
  const rawThickness = Math.max(rawBase, panelHeight);
  const rawGap = Math.max(0, gap);
  const length =
    items.reduce((sum, item) => sum + (item.separator ? 1 : rawBase), 0) +
    rawGap * Math.max(0, items.length - 1) +
    rawThickness -
    rawBase +
    (rawPeak - rawBase);
  const base = rawBase * fit;
  const peak = rawPeak * fit;
  const thickness = rawThickness * fit;

  const settingsRef = useRef({ items, base, peak, gap: rawGap * fit, distance: Math.max(1, distance) * fit });
  settingsRef.current = { items, base, peak, gap: rawGap * fit, distance: Math.max(1, distance) * fit };

  useEffect(() => {
    wakeRef.current?.();
  });

  /* Shrink the whole dock when the space is tighter than its natural length. */
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const host = root.offsetParent ?? document.documentElement;
    const measure = () => {
      const next = length > 0 ? Math.min(1, Math.max(0.4, (host.clientWidth - EDGE * 2) / length)) : 1;
      setFit(Math.round(next * 1000) / 1000);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    return () => observer.disconnect();
  }, [length]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const springs = new Map<number, Spring>();
    const pointer = { x: 0, inside: false };
    let lastBase = settingsRef.current.base;
    let raf = 0;
    let last = 0;
    let alive = true;

    const entry = (index: number): Spring => {
      let state = springs.get(index);
      if (!state) {
        state = { size: settingsRef.current.base, velocity: 0, drawn: "", node: null };
        springs.set(index, state);
      }
      return state;
    };

    const tick = (now: number) => {
      raf = 0;
      if (!alive) return;
      const s = settingsRef.current;
      const dt = Math.min(1 / 30, Math.max(0.001, (now - last) / 1000));
      last = now;
      if (s.base !== lastBase) {
        const ratio = s.base / lastBase;
        springs.forEach((state) => {
          state.size *= ratio;
          state.velocity *= ratio;
        });
        lastBase = s.base;
      }
      const rect = root.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const spans = s.items.map((item) => (item.separator ? 1 : s.base));
      let cursor = -(spans.reduce((sum, span) => sum + span, 0) + s.gap * Math.max(0, spans.length - 1)) / 2;
      const rest = spans.map((span) => {
        const middle = cursor + span / 2;
        cursor += span + s.gap;
        return middle;
      });
      let focus: number | null = null;
      if (pointer.inside) focus = pointer.x - center;
      else if (rest[focusedRef.current] !== undefined) focus = rest[focusedRef.current];
      const steps = Math.max(1, Math.ceil(dt * 240));
      const h = dt / steps;
      const k = STIFFNESS / MASS;
      const c = DAMPING / MASS;
      let moving = false;

      s.items.forEach((item, index) => {
        const node = itemRefs.current[index];
        if (!node || item.separator) return;
        const state = entry(index);
        const reach = focus === null ? 1 : Math.abs(focus - rest[index]) / s.distance;
        const target = reduce ? s.base : s.base + (s.peak - s.base) * (reach < 1 ? Math.cos((reach * Math.PI) / 2) ** 2 : 0);
        if (reduce) {
          state.size = target;
          state.velocity = 0;
        } else {
          for (let i = 0; i < steps; i++) {
            state.velocity = (state.velocity + h * k * (target - state.size)) / (1 + h * c + h * h * k);
            state.size += state.velocity * h;
          }
        }
        if (Math.abs(state.velocity) < 0.01 && Math.abs(target - state.size) < 0.01) {
          state.size = target;
          state.velocity = 0;
        } else {
          moving = true;
        }
        const size = Math.max(1, state.size);
        const drawn = size.toFixed(2);
        if (drawn === state.drawn && node === state.node) return;
        state.drawn = drawn;
        state.node = node;
        const tile = node.firstElementChild as HTMLElement | null;
        node.style.width = `${size}px`;
        node.style.height = `${size}px`;
        if (tile) tile.style.transform = `scale(${size / s.base})`;
      });

      if (moving) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    wakeRef.current = wake;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.x = event.clientX;
      pointer.inside = true;
      wake();
    };
    const onLeave = () => {
      pointer.inside = false;
      wake();
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointercancel", onLeave);
    wake();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointercancel", onLeave);
      wakeRef.current = null;
    };
  }, []);

  function onItemKeyDown(event: KeyboardEvent<HTMLElement>, index: number) {
    const order = items.flatMap((item, i) => (item.separator ? [] : [i]));
    const at = order.indexOf(index);
    let next: number | undefined;
    if (event.key === "ArrowLeft") next = order[(at - 1 + order.length) % order.length];
    else if (event.key === "ArrowRight") next = order[(at + 1) % order.length];
    else if (event.key === "Home") next = order[0];
    else if (event.key === "End") next = order[order.length - 1];
    if (next === undefined) return;
    event.preventDefault();
    itemRefs.current[next]?.focus();
  }

  return (
    <nav
      ref={rootRef}
      className={`${ROOT}${className ? ` ${className}` : ""}`}
      aria-label={label}
      data-hidden={hidden ? "" : undefined}
      inert={hidden}
      style={
        {
          ...TOKENS,
          "--dock-base": `${base}px`,
          "--dock-thickness": `${thickness}px`,
          "--dock-gap": `${rawGap * fit}px`,
          "--dock-pad": `${(thickness - base) / 2}px`,
          "--dock-reach": `${peak - base}px`,
          "--dock-round": Math.min(Math.max(roundness, 0), 1),
        } as CSSProperties
      }
    >
      {items.map((item, index) =>
        item.separator ? (
          <span key={`sep-${index}`} className={SEPARATOR} aria-hidden="true" />
        ) : (
          <a
            key={item.href ?? index}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            href={item.href}
            className={ITEM}
            aria-label={item.label}
            aria-current={item.active ? "true" : undefined}
            onFocus={(event) => {
              if (event.currentTarget.matches(":focus-visible")) {
                focusedRef.current = index;
                wakeRef.current?.();
              }
            }}
            onBlur={() => {
              focusedRef.current = -1;
              wakeRef.current?.();
            }}
            onKeyDown={(event) => onItemKeyDown(event, index)}
          >
            <span className={TILE}>
              <span className={FACE}>{item.icon}</span>
            </span>
            {item.active ? <span className={DOT} aria-hidden="true" /> : null}
            {item.label ? (
              <span className={LABEL} aria-hidden="true">
                {item.label}
              </span>
            ) : null}
          </a>
        ),
      )}
    </nav>
  );
}
