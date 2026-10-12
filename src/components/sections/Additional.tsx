import { Trophy } from "lucide-react";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { GlowCard } from "@/components/ui/GlowCard";
import { useLightbox } from "@/components/ui/LightboxProvider";
import { additionalInvolvement } from "@/data/portfolio";

/**
 * Events and recognition that have photographic evidence but no resume entry,
 * rendered inside Leadership. Event, role label, and images only: no
 * invented titles, dates, or responsibilities. The award slide keeps its own 16:9 frame,
 * because it is text and cropping it would cut words off.
 */
export function Additional() {
  const openLightbox = useLightbox();

  return (
    <div id="additional" className="mt-20 md:mt-28">
      <h3 className="type-h3">Other events and recognition.</h3>
      <ul className="mt-8 flex flex-col gap-6">
        {additionalInvolvement.map((entry, index) => {
          const slide = entry.recognition?.image;
          const count = entry.photos.length + (slide ? 1 : 0);
          return (
            <li key={entry.id}>
              <AnimatedContent delay={index * 0.05} distance={24}>
                <GlowCard className="grid gap-6 p-6 sm:p-8 lg:grid-cols-12 lg:gap-8">
                  <div className="lg:col-span-4">
                    <h4 className="font-display text-2xl leading-tight font-semibold tracking-[-0.02em]">{entry.event}</h4>
                    <p className="mt-1.5 text-ink-2">{entry.role}</p>
                    {entry.recognition && (
                      <p className="mt-4 inline-flex items-start gap-2 rounded-control border border-[color-mix(in_oklab,var(--gold)_55%,transparent)] bg-[color-mix(in_oklab,var(--gold)_22%,transparent)] px-3 py-2 text-sm leading-snug font-medium text-ink">
                        <Trophy size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                        {entry.recognition.label}
                      </p>
                    )}
                  </div>
                  <div className={count > 1 ? "grid gap-4 sm:grid-cols-2 lg:col-span-8" : "lg:col-span-8"}>
                    {entry.photos.map((photo) => (
                      <EditorialImage
                        key={photo.src}
                        photo={photo}
                        onOpen={openLightbox}
                        aspect="aspect-[5/4] sm:aspect-[3/2]"
                        position="object-[center_40%]"
                      />
                    ))}
                    {slide && <EditorialImage photo={slide} onOpen={openLightbox} aspect="aspect-[16/9]" />}
                  </div>
                </GlowCard>
              </AnimatedContent>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
