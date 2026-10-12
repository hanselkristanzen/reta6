import { Moon, Sun } from "lucide-react";
import { SwapIcon } from "@/components/ui/SwapIcon";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/cn";

/**
 * Light and dark switch. The icon trades places in 160ms (SwapIcon), and the page itself changes
 * through a circle that grows from this button (see lib/theme). The accessible name states the
 * action, so it needs no pressed state.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "press-feedback grid size-11 place-items-center rounded-full border border-line bg-bg text-ink-2 can-hover:border-line-strong can-hover:text-ink sm:size-10",
        className,
      )}
    >
      <SwapIcon swapped={dark} from={<Sun size={18} />} to={<Moon size={18} />} />
    </button>
  );
}
