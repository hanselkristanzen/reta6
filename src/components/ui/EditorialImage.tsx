import { Maximize2 } from "lucide-react";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import GlareHover from "@/components/reactbits/GlareHover";
import { cn } from "@/lib/cn";
import type { MediaItem } from "@/types/portfolio";

interface EditorialImageProps {
  photo: MediaItem;
  onOpen: (photo: MediaItem) => void;
  /** Tailwind aspect utilities, e.g. "aspect-[4/3] md:aspect-[3/2]". */
  aspect?: string;
  /** Focal point for object-cover cropping. */
  position?: string;
  showCaption?: boolean;
  className?: string;
}

/**
 * A click-to-enlarge photograph in a rounded frame. It rises into view when it scrolls in
 * (AnimatedContent), a light glare sweeps across it on hover (GlareHover, mouse only), the picture
 * zooms 4% on hover (pointer devices only), and a small enlarge hint shows on hover and keyboard
 * focus. The caption is static text so it exists on touch screens too. The image is never
 * stretched: object-cover crops, and `aspect` decides how much.
 */
export function EditorialImage({
  photo,
  onOpen,
  aspect = "aspect-[16/10]",
  position = "object-center",
  showCaption = true,
  className,
}: EditorialImageProps) {
  return (
    <AnimatedContent className={className}>
      <figure>
        <GlareHover className="rounded-surface" glareColor="#e1ded9" glareOpacity={0.32} transitionDuration={800}>
          <button
            type="button"
            onClick={() => onOpen(photo)}
            aria-label={`Enlarge: ${photo.caption ?? photo.alt}`}
            className="photo-frame relative block w-full overflow-hidden rounded-surface bg-bg-soft"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              className={cn("w-full object-cover", aspect, position)}
            />
            <span
              className="photo-hint absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-abalone text-oblivion shadow-card"
              aria-hidden="true"
            >
              <Maximize2 size={15} />
            </span>
          </button>
        </GlareHover>
        {showCaption && photo.caption && <figcaption className="type-meta mt-3">{photo.caption}</figcaption>}
      </figure>
    </AnimatedContent>
  );
}
