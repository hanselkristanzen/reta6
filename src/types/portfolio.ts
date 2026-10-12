/**
 * Central type definitions for portfolio content.
 * Every field here is sourced from the resume (or, where noted, from
 * certificates, photos, and project case studies supplied directly).
 * See src/data/portfolio.ts for the content itself.
 */

export interface MediaItem {
  src: string;
  alt: string;
  caption?: string;
}

export interface EducationEntry {
  id: string;
  school: string;
  credential: string;
  dateRange: string;
  gpa?: string;
  coursework?: string[];
  emphasis?: boolean;
}

export interface OrganizationRole {
  id: string;
  title: string;
  org: string;
  dateRange: string;
  achievements: string[];
  photos?: MediaItem[];
  certificate?: MediaItem;
}

export interface AdditionalInvolvement {
  id: string;
  event: string;
  role: string;
  recognition?: { label: string; image: MediaItem };
  photos: MediaItem[];
}

export type Severity = "high" | "medium" | "low";

export type ProjectType = "Group Project" | "Individual Project";

/**
 * Optional fields are left out when the resume gives no basis for them, so a
 * case study never carries an invented outcome or takeaway.
 */
export interface CaseStudySection {
  overview: string;
  role: string;
  methodology: string[];
  tools: string[];
  /** Heading for `findings`: "Findings", "What it detects", and so on. */
  findingsLabel?: string;
  findings: string[];
  impact?: string;
  mitigation?: string;
  takeaway?: string;
}

export interface Project {
  id: string;
  category: string;
  title: string;
  codename?: string;
  projectType: ProjectType;
  summary: string;
  tools: string[];
  /** Short, resume-sourced facts shown on the card. */
  metrics?: { label: string; value: string }[];
  severityBreakdown?: { severity: Severity; count: number }[];
  quote?: string;
  gallery?: MediaItem[];
  /**
   * Public repository URL. Only set where the repo link already exists in the source
   * material; projects without one get no GitHub button (never a placeholder).
   */
  github?: string;
  /** Projects not on the current resume; shown in a compact secondary row. */
  additional?: boolean;
  caseStudy: CaseStudySection;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  certificateImage?: MediaItem;
}

export interface LanguageEntry {
  language: string;
  level: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  linkedin: string;
  linkedinHandle: string;
  github: string;
  githubHandle: string;
  location: string;
}

export interface ResumeInfo {
  /** Public URL of the PDF. */
  href: string;
  /** File name offered when the visitor downloads it. */
  fileName: string;
}

export interface Profile {
  fullName: string;
  displayName: string;
  positioning: string;
  summary: string;
  university: string;
  program: string;
  gpa: string;
  contact: ContactInfo;
}
