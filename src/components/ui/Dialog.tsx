import type { ReactNode } from "react";
import { X } from "lucide-react";
import { useDialogBehavior } from "@/hooks/useDialogBehavior";
import { usePresence } from "@/hooks/usePresence";
import { cn } from "@/lib/cn";

/** Matches the 140ms exit animation in index.css. */
const EXIT_MS = 140;

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  children: ReactNode;
  panelClassName?: string;
}

/**
 * Accessible dialog shell: focus trap, ESC to close, click-outside to
 * close, background scroll lock, and focus restore, all via
 * useDialogBehavior. Shared by ProjectCaseStudyModal and Lightbox so
 * both get identical, single-source a11y behavior. After `isOpen` turns
 * false it stays mounted for a short exit (faster than the entrance), then unmounts.
 */
export function Dialog({ isOpen, onClose, titleId, children, panelClassName }: DialogProps) {
  const containerRef = useDialogBehavior(isOpen, onClose);
  const { mounted, closing } = usePresence(isOpen, EXIT_MS);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="dialog-scrim absolute inset-0 bg-[color-mix(in_oklab,var(--oblivion)_72%,transparent)] backdrop-blur-sm"
        data-closing={closing || undefined}
        aria-hidden="true"
      />
      <div
        ref={containerRef}
        data-closing={closing || undefined}
        inert={closing}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "dialog-panel relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-surface border border-line-strong bg-surface shadow-lift",
          panelClassName,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="press-feedback absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full border border-line bg-bg/80 text-ink-2 backdrop-blur-sm can-hover:border-line-strong can-hover:text-ink"
        >
          <X size={18} aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}
