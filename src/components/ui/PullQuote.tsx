import { cn } from "@/lib/cn";

interface PullQuoteProps {
  children: string;
  className?: string;
}

/** A short reflective statement from the project, set off by a gold rule rather than a card. */
export function PullQuote({ children, className }: PullQuoteProps) {
  return (
    <p className={cn("max-w-md border-l-2 border-accent pl-4 font-display text-lg leading-snug text-ink sm:text-xl", className)}>
      “{children}”
    </p>
  );
}
