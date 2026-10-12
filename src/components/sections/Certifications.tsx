import { Award } from "lucide-react";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import { CertificateThumb } from "@/components/ui/CertificateThumb";
import { GlowCard } from "@/components/ui/GlowCard";
import { useLightbox } from "@/components/ui/LightboxProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { certifications, languages } from "@/data/portfolio";

export function Certifications() {
  const openLightbox = useLightbox();

  return (
    <section id="certifications" className="section-y bg-bg-soft">
      <div className="container-page">
        <SectionHeading eyebrow="Credentials" title="Certifications &" accent="Languages" />

        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, index) => (
            <li key={cert.id}>
              <AnimatedContent delay={index * 0.07} distance={24} className="h-full">
                <GlowCard className="flex h-full flex-col p-5 sm:p-6">
                  {cert.certificateImage ? (
                    <CertificateThumb image={cert.certificateImage} onOpen={openLightbox} />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="grid aspect-[4/3] w-full place-items-center rounded-control border border-line bg-[color-mix(in_oklab,var(--c-link)_8%,transparent)] text-link"
                    >
                      <Award size={40} strokeWidth={1.5} />
                    </div>
                  )}
                  <h3 className="mt-5 font-display text-lg leading-snug font-semibold tracking-[-0.015em]">{cert.title}</h3>
                  <p className="mt-1 text-ink-2">{cert.issuer}</p>
                  <p className="type-meta mt-auto pt-3">{cert.date}</p>
                </GlowCard>
              </AnimatedContent>
            </li>
          ))}

          <li className="md:col-span-2 lg:col-span-1">
            <AnimatedContent delay={certifications.length * 0.07} distance={24} className="h-full">
              <GlowCard className="h-full p-5 sm:p-6">
                <h3 className="font-display text-lg font-semibold tracking-[-0.015em]">Languages</h3>
                <ul className="mt-4">
                  {languages.map((entry) => (
                    <li
                      key={entry.language}
                      className="flex items-baseline justify-between border-t border-line py-3 first:border-t-0"
                    >
                      <span className="font-medium">{entry.language}</span>
                      <span className="type-meta">{entry.level}</span>
                    </li>
                  ))}
                </ul>
              </GlowCard>
            </AnimatedContent>
          </li>
        </ul>
      </div>
    </section>
  );
}
