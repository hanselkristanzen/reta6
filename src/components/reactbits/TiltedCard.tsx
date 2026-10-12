/**
 * TiltedCard, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Components/TiltedCard).
 * MIT + Commons Clause, see ./LICENSE.md.
 *
 * Changes for this site:
 * - Takes `children` as well as `imageSrc`, so the tilt can carry a whole card (photo and details),
 *   not only a single image. The tilt maths and spring settings are the upstream ones.
 * - Sized by the caller (`className`) instead of fixed pixel props.
 * - The cursor tooltip and the "not optimized for mobile" notice are removed. Tilt follows a real mouse
 *   only (`pointerType === "mouse"`, `hover: hover` and `pointer: fine`); touch visitors drag the
 *   badge instead (see HeroBadge).
 * - Pointer position is no longer kept in React state, so moving the mouse does not re-render.
 * - `prefers-reduced-motion`: no tilt.
 */
import { motion, useSpring, type SpringOptions } from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { useCanHover } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TiltedCardProps {
  imageSrc?: string;
  altText?: string;
  children?: ReactNode;
  className?: string;
  imageClassName?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  disabled?: boolean;
}

const springValues: SpringOptions = { damping: 30, stiffness: 100, mass: 2 };

export default function TiltedCard({
  imageSrc,
  altText = "",
  children,
  className = "",
  imageClassName = "",
  scaleOnHover = 1.03,
  rotateAmplitude = 10,
  disabled = false,
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, springValues);
  const rotateY = useSpring(0, springValues);
  const scale = useSpring(1, springValues);
  const canHover = useCanHover();
  const reduced = useReducedMotion();
  const active = !disabled && canHover && !reduced;

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (!active || !ref.current || event.pointerType !== "mouse") return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
  }

  function handleEnter(event: PointerEvent<HTMLDivElement>) {
    if (active && event.pointerType === "mouse") scale.set(scaleOnHover);
  }

  function handleLeave() {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div
      ref={ref}
      className={`relative [perspective:900px] ${className}`}
      onPointerMove={handleMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
    >
      <motion.div className="relative size-full [transform-style:preserve-3d]" style={{ rotateX, rotateY, scale }}>
        {imageSrc && (
          <img
            src={imageSrc}
            alt={altText}
            className={`absolute inset-0 size-full object-cover will-change-transform ${imageClassName}`}
          />
        )}
        {children}
      </motion.div>
    </div>
  );
}
