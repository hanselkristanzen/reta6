import { Maximize2 } from "lucide-react";
import { cn } from "@/lib/cn";
import type { MediaItem } from "@/types/portfolio";

interface CertificateThumbProps {
  image: MediaItem;
  onOpen: (image: MediaItem) => void;
  className?: string;
}

/**
 * Certificate-specific image treatment: object-fit: contain (never
 * crops the document), click or Enter/Space to open the full-size
 * lightbox view. The "View Certificate" label is a hover and focus hint for pointer devices;
 * the button itself always has an accessible name from the image alt text.
 */
export function CertificateThumb({ image, onOpen, className }: CertificateThumbProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(image)}
      className={cn(
        "press-feedback group relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-control border border-line bg-bg-soft p-2 can-hover:border-line-strong",
        className,
      )}
    >
      <img src={image.src} alt={image.alt} loading="lazy" className="h-full w-full object-contain" />
      <span className="absolute inset-0 flex items-center justify-center bg-[color-mix(in_oklab,var(--oblivion)_0%,transparent)] opacity-0 transition-[opacity,background-color] duration-200 group-focus-visible:bg-[color-mix(in_oklab,var(--oblivion)_55%,transparent)] group-focus-visible:opacity-100 group-can-hover:bg-[color-mix(in_oklab,var(--oblivion)_55%,transparent)] group-can-hover:opacity-100">
        <span className="flex items-center gap-2 rounded-full bg-abalone px-3.5 py-1.5 text-xs font-semibold text-oblivion">
          <Maximize2 size={13} aria-hidden="true" />
          View Certificate
        </span>
      </span>
    </button>
  );
}
