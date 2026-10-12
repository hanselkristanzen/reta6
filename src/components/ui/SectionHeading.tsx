import AnimatedContent from "@/components/reactbits/AnimatedContent";
import FadeContent from "@/components/reactbits/FadeContent";
import ScrollFloat from "@/components/reactbits/ScrollFloat";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow: string;
  /** The plain part of the title. */
  title: string;
  /** The closing part of the title, painted with the palette gradient. */
  accent?: string;
  description?: string;
  className?: string;
}

/**
 * The one heading every section opens with: a small eyebrow with a gold rule, a large title whose
 * letters rise into place as it scrolls into view (ScrollFloat, scrubbed to the scroll position), and
 * a short description. Left-aligned, so every section starts from the same edge.
 */
export function SectionHeading({ eyebrow, title, accent, description, className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <FadeContent duration={0.6}>
        <p className="type-eyebrow flex items-center gap-3">
          <span className="h-0.5 w-8 rounded-full bg-accent" aria-hidden="true" />
          {eyebrow}
        </p>
      </FadeContent>
      <ScrollFloat as="h2" accent={accent} className="type-h2 mt-4">
        {title}
      </ScrollFloat>
      {description && (
        <AnimatedContent delay={0.1} distance={16}>
          <p className="type-lead mt-5 max-w-2xl text-ink-2">{description}</p>
        </AnimatedContent>
      )}
    </div>
  );
}
