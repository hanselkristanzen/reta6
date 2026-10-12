import { Check, GraduationCap, School } from "lucide-react";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import { GlowCard } from "@/components/ui/GlowCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { education } from "@/data/portfolio";
import { cn } from "@/lib/cn";

export function Education() {
  return (
    <section id="education" className="section-y bg-bg-soft">
      <div className="container-page">
        <SectionHeading eyebrow="Education" title="Academic" accent="Background" />

        <ul className="mt-12 grid gap-5 lg:grid-cols-5">
          {education.map((entry, index) => {
            const Icon = entry.emphasis ? GraduationCap : School;
            return (
              <li key={entry.id} className={cn(entry.emphasis ? "lg:col-span-3" : "lg:col-span-2 lg:self-start")}>
                <AnimatedContent delay={index * 0.08} distance={24} className="h-full">
                  <GlowCard className="h-full p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid size-12 place-items-center rounded-control bg-[color-mix(in_oklab,var(--c-link)_12%,transparent)] text-link">
                        <Icon size={22} aria-hidden="true" />
                      </span>
                      {entry.gpa && (
                        <span className="rounded-full border border-[color-mix(in_oklab,var(--gold)_55%,transparent)] bg-[color-mix(in_oklab,var(--gold)_22%,transparent)] px-3 py-1.5 text-[0.8125rem] leading-none font-semibold text-ink tabular-nums">
                          {entry.gpa}
                        </span>
                      )}
                    </div>

                    <p className="type-meta mt-6">{entry.dateRange}</p>
                    <h3 className={cn("mt-1.5", entry.emphasis ? "type-h3" : "font-display text-xl font-semibold tracking-[-0.02em]")}>
                      {entry.school}
                    </h3>
                    <p className="mt-1 text-ink-2">{entry.credential}</p>

                    {entry.coursework && (
                      <>
                        <p className="type-eyebrow mt-7">Coursework</p>
                        <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                          {entry.coursework.map((course) => (
                            <li key={course} className="flex items-start gap-2.5 text-sm text-ink-2">
                              <Check size={15} className="mt-0.5 shrink-0 text-link" aria-hidden="true" />
                              {course}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </GlowCard>
                </AnimatedContent>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
