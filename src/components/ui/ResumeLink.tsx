import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Download, FileText } from "lucide-react";
import { SwapIcon } from "@/components/ui/SwapIcon";
import { resume } from "@/data/portfolio";

interface ResumeLinkProps {
  children: ReactNode;
  /** Styling stays with the call site, so each placement keeps its own look. */
  className?: string;
  icon?: "file" | "download";
  iconSize?: number;
  /** Where the icon sits relative to the label. */
  iconPlacement?: "start" | "end";
  iconClassName?: string;
  /** Runs on activation, e.g. to close the mobile menu. */
  onActivate?: () => void;
}

/**
 * The one way to get the resume: a same-origin link with `download`, so the browser saves
 * the PDF as `resume.fileName` instead of opening a viewer, on desktop and on phones.
 * Activation swaps the icon for a check and announces "Resume download started".
 */
export function ResumeLink({
  children,
  className,
  icon = "file",
  iconSize = 16,
  iconPlacement = "start",
  iconClassName,
  onActivate,
}: ResumeLinkProps) {
  const [started, setStarted] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleClick = () => {
    setStarted(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStarted(false), 2000);
    onActivate?.();
  };

  const Icon = icon === "download" ? Download : FileText;
  const mark = (
    <SwapIcon
      className={iconClassName}
      swapped={started}
      from={<Icon size={iconSize} aria-hidden="true" />}
      to={<Check size={iconSize} aria-hidden="true" />}
    />
  );

  return (
    <>
      <a href={resume.href} download={resume.fileName} onClick={handleClick} className={className}>
        {iconPlacement === "start" && mark}
        {children}
        <span className="sr-only"> (PDF download)</span>
        {iconPlacement === "end" && mark}
      </a>
      <span className="sr-only" role="status">
        {started ? "Resume download started" : ""}
      </span>
    </>
  );
}
