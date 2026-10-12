import { useRef } from "react";
import { Maximize2 } from "lucide-react";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import { Additional } from "@/components/sections/Additional";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { GlowCard } from "@/components/ui/GlowCard";
import { HighlightNumbers } from "@/components/ui/HighlightNumbers";
import { useLightbox } from "@/components/ui/LightboxProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonClass } from "@/components/ui/Button";
import { organizationRoles } from "@/data/portfolio";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * The leadership timeline. A line runs down the left edge and fills in as the visitor scrolls
 * (scrubbed to the scroll position, so it also runs backwards); each role is a card that rises in as it
 * arrives. The text in this section is content-locked: only its presentation changes.
 */
export function Experience() {
  const openLightbox = useLightbox();
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !listRef.current || !fillRef.current) return;
      gsap.fromTo(
        fillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: listRef.current, start: "top 65%", end: "bottom 65%", scrub: 0.4 },
        },
      );
    },
    { dependencies: [reduced], scope: listRef },
  );

  return (
    <section id="experience" className="section-y bg-bg-soft">
      <div className="container-page">
        <SectionHeading
          eyebrow="Leadership"
          title="Leading people,"
          accent="not just projects."
          description="Cross-team coordination and event leadership within HIMTI, BINUS University's Informatics student association."
        />

        <ol ref={listRef} className="relative mt-12 flex flex-col gap-8 md:mt-16">
          {/* Rail: a base line and the filled part on top of it. */}
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-line-strong" />
          <span ref={fillRef} aria-hidden="true" className="rail-fill absolute top-2 bottom-2 left-[4px] w-[3px] rounded-full bg-accent" />

          {organizationRoles.map((role) => {
            const photo = role.photos?.[0];
            return (
              <li key={role.id} className="relative pl-8 sm:pl-12">
                <span
                  aria-hidden="true"
                  className="absolute top-7 left-0 size-[11px] rounded-full border-2 border-[color:var(--c-bg-soft)] bg-btn ring-2 ring-accent"
                />
                <AnimatedContent distance={28}>
                  <GlowCard className="grid gap-6 p-6 sm:p-8 lg:grid-cols-12 lg:gap-8">
                    <div className={photo ? "lg:col-span-7" : "lg:col-span-12"}>
                      <p className="type-meta">{role.dateRange}</p>
                      <h3 className="type-h3 mt-2">{role.title}</h3>
                      <p className="mt-1 font-medium text-accent-text">{role.org}</p>

                      <ul className="mt-6 flex max-w-xl flex-col gap-3">
                        {role.achievements.map((achievement) => (
                          <li key={achievement} className="flex gap-3 text-ink-2">
                            <span className="mt-[0.7em] h-0.5 w-3 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                            <span>
                              <HighlightNumbers text={achievement} />
                            </span>
                          </li>
                        ))}
                      </ul>

                      {role.certificate && (
                        <button
                          type="button"
                          onClick={() => role.certificate && openLightbox(role.certificate)}
                          className={buttonClass("secondary", "sm", "mt-6")}
                        >
                          <Maximize2 size={14} aria-hidden="true" />
                          View certificate
                        </button>
                      )}
                    </div>

                    {photo && (
                      <div className="lg:col-span-5">
                        <EditorialImage
                          photo={photo}
                          onOpen={openLightbox}
                          aspect="aspect-[5/4]"
                          position="object-[center_40%]"
                        />
                      </div>
                    )}
                  </GlowCard>
                </AnimatedContent>
              </li>
            );
          })}
        </ol>

        <Additional />
      </div>
    </section>
  );
}
