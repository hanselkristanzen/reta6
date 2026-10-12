import type { CSSProperties, HTMLAttributes } from "react";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/cn";

/** Spotlight tints, as literal colours (the component builds canvas-free gradients from a hex value). */
const SPOTLIGHT = { light: "#004466", dark: "#a9c4c4" } as const;

/**
 * The page's interactive card: React Bits SpotlightCard dressed in the site's surface, border and
 * shadow tokens, with a soft Lush Aqua glow (Blende Blue in dark) that follows a mouse across it.
 * Radius and padding come from the call site.
 */
export function GlowCard({ className, style, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { theme } = useTheme();
  return (
    <SpotlightCard
      theme={theme}
      spotlightColor={SPOTLIGHT[theme]}
      intensity={0.16}
      spotlightSize={260}
      borderGlow={0.7}
      flare={false}
      className={cn("rounded-surface", className)}
      style={
        {
          "--spotlight-card-surface": "var(--c-surface)",
          "--spotlight-card-border": "var(--c-line)",
          "--spotlight-card-shadow": "var(--shadow-card)",
          ...style,
        } as CSSProperties
      }
      {...props}
    />
  );
}
