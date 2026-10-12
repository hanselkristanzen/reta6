import { ArrowUpRight } from "lucide-react";
import { GitHubMark } from "@/components/ui/BrandIcons";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

interface GitHubLinkProps {
  href: string;
  /** Project name, read out after the visible label so several GitHub links stay distinguishable. */
  project: string;
  className?: string;
}

/**
 * A bordered control, so the repository is easy to spot next to the quieter text link for the
 * case study. The arrow nudges toward the corner on hover (pointer devices only); pressing scales it
 * by 3%. `relative z-10` lifts it above the stretched case-study button that makes a whole project
 * card clickable.
 */
export function GitHubLink({ href, project, className }: GitHubLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(buttonClass("secondary", "sm", "group/github relative z-10"), className)}
    >
      <GitHubMark size={16} />
      GitHub
      <span className="sr-only">: {project} repository (opens in a new tab)</span>
      <ArrowUpRight
        size={14}
        className="text-ink-3 transition-transform duration-200 ease-out group-can-hover/github:translate-x-0.5 group-can-hover/github:-translate-y-0.5"
        aria-hidden="true"
      />
    </a>
  );
}
