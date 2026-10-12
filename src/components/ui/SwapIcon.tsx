import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SwapIconProps {
  /** Show `to` instead of `from`. */
  swapped: boolean;
  from: ReactNode;
  to: ReactNode;
  className?: string;
}

/**
 * Two icons stacked in one grid cell that trade places in place (opacity, a small scale,
 * and 2px of blur to bridge the two shapes). Used for confirmations such as "copied" and
 * "download started", so every control confirms itself the same way. Decorative: the
 * state is announced through a live region by the component that owns it.
 */
export function SwapIcon({ swapped, from, to, className }: SwapIconProps) {
  return (
    <span className={cn("swap-icon", className)} data-swapped={swapped || undefined} aria-hidden="true">
      <span className="swap-icon-from">{from}</span>
      <span className="swap-icon-to">{to}</span>
    </span>
  );
}
