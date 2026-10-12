import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

const BASE = "press-feedback inline-flex items-center justify-center gap-2 rounded-control font-semibold whitespace-nowrap";

const VARIANT: Record<Variant, string> = {
  /** Lush Aqua in light, River of Gold in dark (see the role tokens). */
  primary: "bg-btn text-on-btn shadow-card can-hover:bg-btn-hover",
  secondary: "border border-line-strong bg-transparent text-ink can-hover:bg-surface-2",
  ghost: "text-ink-2 underline-offset-4 can-hover:text-ink can-hover:underline",
};

/** Sizes carry the padding, so a call site never has to override one (utility order would decide the winner). */
const SIZE: Record<Size, string> = {
  md: "min-h-11 px-5 py-3 text-sm",
  sm: "min-h-10 px-4 py-2 text-sm",
};

/** One place for the button look, applied to links and buttons alike. */
export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string): string {
  return cn(BASE, VARIANT[variant], SIZE[size], className);
}
