import { useEffect, useId, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { animate, motion, useMotionValue, type AnimationPlaybackControls } from "motion/react";
import TiltedCard from "@/components/reactbits/TiltedCard";
import { Badge } from "@/components/ui/Badge";
import { profile, profilePhoto } from "@/data/portfolio";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const [, ...FOCUS] = profile.positioning.split(" · ");

/** A pendulum on a spring: underdamped, so a swing settles in about two seconds after a few passes. */
const SWING = { type: "spring", stiffness: 28, damping: 3.4, mass: 1.2 } as const;
/** Reduced motion keeps the drag (the visitor is in control) but drops the overshoot. */
const SETTLE = { type: "tween", duration: 0.25, ease: [0.23, 1, 0.32, 1] } as const;

const toDegrees = (radians: number) => (radians * 180) / Math.PI;

/** Past the limit the card still follows, but with growing resistance, and never more than 7 degrees beyond. */
function resist(angle: number, limit: number): number {
  const over = Math.abs(angle) - limit;
  if (over <= 0) return angle;
  return Math.sign(angle) * (limit + Math.min(7, over * 0.22));
}

/**
 * The hero's right column: the profile on a card that hangs from a strap and can be swung.
 *
 * Interaction: a pendulum whose pivot is the top of the strap. Dragging turns the card so it keeps
 * the point the visitor grabbed under the pointer (pointer capture, 1:1 tracking); on release the
 * card swings back on a spring that starts from the pointer's own velocity, and grabbing it again
 * mid-swing continues from where it is. A mouse also tilts the card in 3D (React Bits TiltedCard).
 * Touch: `touch-action: pan-y`, so a vertical swipe still scrolls the page and a horizontal drag swings the card.
 * Keyboard: the card is focusable, and the left and right arrow keys give it a push.
 * Reduced motion: no entrance swing, no overshoot.
 *
 * The card is decorative: it repeats facts that are also in the page text (name, program, GPA), and
 * carries no ID number or barcode, so it adds nothing a screen reader could miss.
 */
export function HeroBadge() {
  const hintId = useId();
  const angle = useMotionValue(0);
  const pivotRef = useRef<HTMLDivElement>(null);
  const playing = useRef<AnimationPlaybackControls | null>(null);
  const drag = useRef<{ id: number; offset: number; samples: { t: number; a: number }[] } | null>(null);
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(min-width: 64rem)", false);
  const limit = wide ? 30 : 14;

  const release = (velocity: number) => {
    playing.current?.stop();
    playing.current = animate(angle, 0, reduced ? SETTLE : { ...SWING, velocity });
  };

  // One entrance swing when the badge first mounts: it settles from a slight lean.
  useEffect(() => {
    if (reduced) return undefined;
    angle.set(wide ? 13 : 8);
    release(0);
    return () => playing.current?.stop();
    // The entrance plays once per layout, not on every re-render.
  }, [reduced, wide]);

  /** The angle the pivot sees the pointer at, in CSS rotation terms (positive is clockwise). */
  const pointerAngle = (event: PointerEvent) => {
    const rect = pivotRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return -toDegrees(Math.atan2(event.clientX - (rect.left + rect.width / 2), Math.max(event.clientY - rect.top, 1)));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current || (event.pointerType === "mouse" && event.button !== 0)) return;
    playing.current?.stop();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      id: event.pointerId,
      offset: angle.get() - pointerAngle(event),
      samples: [{ t: performance.now(), a: angle.get() }],
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    const next = resist(current.offset + pointerAngle(event), limit);
    angle.set(next);
    const now = performance.now();
    current.samples.push({ t: now, a: next });
    while (current.samples.length > 2 && now - current.samples[0].t > 90) current.samples.shift();
  };

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    drag.current = null;
    const first = current.samples[0];
    const last = current.samples[current.samples.length - 1];
    const elapsed = (last.t - first.t) / 1000;
    release(elapsed > 0.01 ? (last.a - first.a) / elapsed : 0);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    playing.current?.stop();
    release(event.key === "ArrowLeft" ? 70 : -70);
  };

  return (
    <div className="relative mx-auto w-full max-w-[22rem] lg:max-w-[24rem]">
      {/* Palette decoration behind the card: still shapes, no loop. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute top-[26%] -left-6 size-44 rounded-full bg-[color-mix(in_oklab,var(--c-soft)_55%,transparent)] blur-3xl" />
        <span className="absolute -right-4 bottom-[8%] size-52 rounded-full bg-[color-mix(in_oklab,var(--orchid)_38%,transparent)] blur-3xl" />
        <span className="absolute top-[52%] left-[6%] size-3 rounded-full bg-accent" />
        <span className="absolute top-[18%] -right-1 size-6 rounded-full border-2 border-[color-mix(in_oklab,var(--c-comp)_70%,transparent)]" />
      </div>

      {/* Fixed anchor for the pivot: it never rotates, so the pointer maths stays stable. */}
      <div ref={pivotRef} aria-hidden="true" className="pointer-events-none absolute top-0 left-1/2 h-px w-px" />

      <motion.div
        role="group"
        tabIndex={0}
        aria-label="Profile card"
        aria-describedby={hintId}
        onKeyDown={onKeyDown}
        style={{ rotate: angle, transformOrigin: "50% 0%" }}
        className="relative flex flex-col items-center rounded-surface outline-offset-8"
      >
        {/* Anchor ring where the strap is fixed. On large screens the strap runs off the top of the page instead. */}
        <span
          aria-hidden="true"
          className="mt-1 size-4 rounded-full border-[3px] border-[color:var(--c-comp)] bg-bg lg:hidden"
        />
        {/* Strap and clip */}
        <span
          aria-hidden="true"
          className="relative block h-14 w-3.5 shrink-0 rounded-b-[3px] bg-aqua shadow-card before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-gold lg:h-[8.5rem]"
        />
        <span
          aria-hidden="true"
          className="relative z-10 -mb-2.5 block h-7 w-9 rounded-md border border-[color-mix(in_oklab,var(--oblivion)_30%,transparent)] bg-[linear-gradient(180deg,var(--blende),color-mix(in_oklab,var(--blende)_60%,var(--oblivion)))] shadow-card"
        />

        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          className="w-full cursor-grab touch-pan-y select-none active:cursor-grabbing"
        >
          <TiltedCard className="w-full" rotateAmplitude={8} scaleOnHover={1.02}>
            <article className="relative rounded-[1.75rem] border border-line-strong bg-surface shadow-lift [transform-style:preserve-3d]">
              <div className="relative h-32 overflow-hidden rounded-t-[1.7rem] bg-[linear-gradient(135deg,var(--aqua)_0%,color-mix(in_oklab,var(--aqua)_45%,var(--orchid))_62%,var(--orchid)_100%)]">
                <span className="absolute -top-10 -right-8 size-36 rounded-full bg-[color-mix(in_oklab,var(--blende)_38%,transparent)]" />
                <span className="absolute -bottom-12 -left-6 size-32 rounded-full border-[14px] border-[color-mix(in_oklab,var(--blende)_30%,transparent)]" />
                <span className="absolute top-5 left-6 h-1.5 w-10 rounded-full bg-gold" />
                {/* Slot of the badge, like the hole in a lanyard card. */}
                <span className="absolute top-3 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-[color-mix(in_oklab,var(--oblivion)_55%,transparent)]" />
              </div>

              <div className="absolute top-[4.25rem] left-1/2 -translate-x-1/2 [transform:translateZ(32px)]">
                <img
                  src={profilePhoto}
                  alt={`Portrait of ${profile.fullName}`}
                  width={1000}
                  height={2000}
                  fetchPriority="high"
                  decoding="async"
                  draggable={false}
                  className="size-28 rounded-full border-4 border-surface object-cover object-[50%_16%] shadow-lift ring-2 ring-gold"
                />
              </div>

              <div className="px-6 pt-[4.5rem] pb-6 text-center">
                <p className="font-display text-[1.375rem] leading-[1.1] font-semibold tracking-[-0.03em] text-ink">
                  {profile.fullName}
                </p>
                <p className="mt-1.5 text-sm font-medium text-comp">{profile.program} Student</p>

                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-4 text-left">
                  <div>
                    <dt className="type-meta">University</dt>
                    <dd className="mt-0.5 text-sm font-medium text-ink">{profile.university}</dd>
                  </div>
                  <div>
                    <dt className="type-meta">Program</dt>
                    <dd className="mt-0.5 text-sm font-medium text-ink">{profile.program}</dd>
                  </div>
                  <div>
                    <dt className="type-meta">GPA</dt>
                    <dd className="mt-0.5 text-sm font-medium text-ink tabular-nums">{profile.gpa}</dd>
                  </div>
                  <div>
                    <dt className="type-meta">Based in</dt>
                    <dd className="mt-0.5 text-sm font-medium text-ink">{profile.contact.location}</dd>
                  </div>
                </dl>

                <ul className="mt-4 flex flex-wrap justify-center gap-1.5 border-t border-line pt-4" aria-label="Focus areas">
                  {FOCUS.map((item) => (
                    <li key={item}>
                      <Badge tone="brand" className="px-2.5 py-1.5 text-xs">
                        {item}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </TiltedCard>
        </div>
      </motion.div>

      <p id={hintId} className="type-meta mt-6 text-center">
        Drag the card
        <span className="sr-only">, or focus it and use the left and right arrow keys, to give it a swing</span>
      </p>
    </div>
  );
}
