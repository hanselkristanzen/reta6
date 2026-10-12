import { useId } from "react";
import { CheckCircle2, Lightbulb, ShieldAlert, Target, Wrench } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { GitHubLink } from "@/components/ui/GitHubLink";
import { useLastDefined } from "@/hooks/usePresence";
import type { Project } from "@/types/portfolio";

interface ProjectCaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

const BODY = "text-sm leading-relaxed text-ink-2 sm:text-[0.95rem]";

function CaseStudySection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Target;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="flex items-center gap-2 text-sm font-medium text-link">
        <Icon size={13} aria-hidden="true" />
        {title}
      </h3>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

export function ProjectCaseStudyModal({ project: openProject, onClose }: ProjectCaseStudyModalProps) {
  const titleId = useId();
  // Content stays on screen while the dialog plays its exit, after the parent has cleared the project.
  const project = useLastDefined(openProject);
  const study = project?.caseStudy;

  return (
    <Dialog isOpen={openProject !== null} onClose={onClose} titleId={titleId} panelClassName="max-w-2xl">
      {project && study && (
        <div className="p-6 sm:p-8">
          <p className="type-meta flex flex-wrap gap-x-3 pr-10">
            <span>{project.category}</span>
            <span>{project.projectType}</span>
          </p>
          <h2 id={titleId} className="type-h3 mt-2 pr-10 text-ink">
            {project.codename ?? project.title}
          </h2>
          {project.codename && project.title !== project.category && <p className="mt-1 text-sm text-ink-2">{project.title}</p>}

          {project.quote && (
            <p className="mt-5 border-l-2 border-accent pl-4 font-display text-lg leading-snug text-ink">
              “{project.quote}”
            </p>
          )}

          <div className="mt-6 flex flex-col gap-6">
            <CaseStudySection icon={Target} title="Overview">
              <p className={BODY}>{study.overview}</p>
            </CaseStudySection>

            <CaseStudySection icon={CheckCircle2} title="Role">
              <p className={BODY}>{study.role}</p>
            </CaseStudySection>

            <CaseStudySection icon={Wrench} title="Methodology & Tools">
              <ul className="flex flex-col gap-2">
                {study.methodology.map((step) => (
                  <li key={step} className={`flex gap-2.5 ${BODY}`}>
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-line-strong" aria-hidden="true" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tools">
                {study.tools.map((tool) => (
                  <li key={tool}>
                    <Badge>{tool}</Badge>
                  </li>
                ))}
              </ul>
            </CaseStudySection>

            {study.findings.length > 0 && (
              <CaseStudySection icon={ShieldAlert} title={study.findingsLabel ?? "Findings"}>
                <ul className="flex flex-col gap-2">
                  {study.findings.map((finding) => (
                    <li key={finding} className={`flex gap-2.5 ${BODY}`}>
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </CaseStudySection>
            )}

            {(study.impact || study.mitigation) && (
              <div className={study.impact && study.mitigation ? "grid gap-6 sm:grid-cols-2" : undefined}>
                {study.impact && (
                  <CaseStudySection icon={ShieldAlert} title="Impact">
                    <p className={BODY}>{study.impact}</p>
                  </CaseStudySection>
                )}
                {study.mitigation && (
                  <CaseStudySection icon={Wrench} title="Mitigation">
                    <p className={BODY}>{study.mitigation}</p>
                  </CaseStudySection>
                )}
              </div>
            )}

            {study.takeaway && (
              <CaseStudySection icon={Lightbulb} title="Key Takeaway">
                <p className="text-sm leading-relaxed text-ink sm:text-[0.95rem]">{study.takeaway}</p>
              </CaseStudySection>
            )}

            {project.github && (
              <div className="border-t border-line pt-6">
                <GitHubLink href={project.github} project={project.codename ?? project.title} />
              </div>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}
