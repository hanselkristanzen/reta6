import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "default" | "brand" | "accent" | "high" | "medium" | "low";

/**
 * Every tone is a tint of a palette colour over the page, with text from the ink side of the
 * palette so contrast holds in both themes. Severity tones always print their word as well
 * (see Projects), so colour is never the only signal.
 */
const TONE_CLASSES: Record<BadgeTone, string> = {
  default: "border-line bg-surface-2/60 text-ink-2",
  brand:
    "border-[color-mix(in_oklab,var(--c-link)_30%,transparent)] bg-[color-mix(in_oklab,var(--c-link)_10%,transparent)] text-link",
  accent:
    "border-[color-mix(in_oklab,var(--gold)_55%,transparent)] bg-[color-mix(in_oklab,var(--gold)_22%,transparent)] text-ink",
  high: "border-[color-mix(in_oklab,var(--c-sev-high)_45%,transparent)] bg-[color-mix(in_oklab,var(--c-sev-high)_12%,transparent)] text-sev-high-ink",
  medium:
    "border-[color-mix(in_oklab,var(--c-sev-medium)_55%,transparent)] bg-[color-mix(in_oklab,var(--c-sev-medium)_22%,transparent)] text-sev-medium-ink",
  low: "border-[color-mix(in_oklab,var(--c-sev-low)_70%,transparent)] bg-[color-mix(in_oklab,var(--c-sev-low)_28%,transparent)] text-sev-low-ink",
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export function Badge({ children, tone = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1.5 text-[0.8125rem] leading-none font-medium whitespace-nowrap",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
