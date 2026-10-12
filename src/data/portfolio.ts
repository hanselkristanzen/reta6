import certCisco from "@/assets/images/cert-cisco-cybersecurity.webp";
import certHiletMentor from "@/assets/images/cert-hilet-mentor.webp";
import certLdkcpChairman from "@/assets/images/cert-ldkcp-chairman.webp";
import certTechnoCoordinator from "@/assets/images/cert-techno-coordinator.webp";
import photoCodeavourExperienceZone from "@/assets/images/photo-codeavour-experience-zone.webp";
import photoCodeavourJakartaCommittee from "@/assets/images/photo-codeavour-jakarta-committee.webp";
import photoHiletCommittee from "@/assets/images/photo-hilet-committee.webp";
import photoIcpcCommittee from "@/assets/images/photo-icpc-committee.webp";
import photoLdkcpEvent from "@/assets/images/photo-ldkcp-event.webp";
import photoSesventCommittee from "@/assets/images/photo-sesvent-committee.webp";
import photoTechnoCommittee from "@/assets/images/photo-techno-committee.webp";
import profilePortrait from "@/assets/images/profile-portrait.webp";
import projectDigitwoDashboard from "@/assets/images/project-digitwo-dashboard.webp";
import projectDigitwoLanding from "@/assets/images/project-digitwo-landing.webp";
import projectDigitwoLearning from "@/assets/images/project-digitwo-learning.webp";
import projectDigitwoPractice from "@/assets/images/project-digitwo-practice.webp";
import recognitionSesvent from "@/assets/images/recognition-sesvent-bestnoble.webp";
import type {
  AdditionalInvolvement,
  Certification,
  EducationEntry,
  LanguageEntry,
  OrganizationRole,
  Profile,
  Project,
  ResumeInfo,
  SkillGroup,
} from "@/types/portfolio";

export const profile: Profile = {
  fullName: "Margareta Nadya Roselani Bramanjaya",
  displayName: "Margareta Nadya Roselani Bramanjaya",
  positioning: "Cyber Security Student · Penetration Testing · SIEM and Log Analysis · Secure Web Development",
  summary:
    "Cyber Security student at BINUS University with hands-on experience in penetration testing, security monitoring, and secure web application development through technical projects. Experienced in mobile application security testing, SIEM and log analysis, Python-based threat detection, and security-focused web development, complemented by leadership and project coordination experience.",
  university: "BINUS University",
  program: "Cyber Security",
  gpa: "3.51 / 4.0",
  contact: {
    email: "margareta.nadya@gmail.com",
    phone: "+62 812-9699-3400",
    linkedin: "https://linkedin.com/in/margareta-nadya",
    linkedinHandle: "margareta-nadya",
    github: "https://github.com/Mayhem127",
    githubHandle: "Mayhem127",
    location: "Bekasi, Jawa Barat",
  },
};

export const profilePhoto = profilePortrait;

/**
 * The one resume PDF the site links to (Hero, navigation, Contact). Every link
 * downloads it. To replace it, overwrite the file in /public and keep its name;
 * `fileName` is only the name the visitor's browser saves it under.
 */
export const resume: ResumeInfo = {
  href: `${import.meta.env.BASE_URL}Margareta-Nadya-Bramanjaya-Resume.pdf`,
  fileName: "Margareta-Resume.pdf",
};

export const education: EducationEntry[] = [
  {
    id: "binus",
    school: "BINUS University",
    credential: "Bachelor, Cyber Security",
    dateRange: "August 2024 – Present",
    gpa: "Cumulative GPA: 3.51 / 4.0",
    coursework: [
      "Computer Security Fundamentals",
      "Network Penetration Testing",
      "Software Security",
      "Server and Network Administration",
      "Computer Forensics",
      "Secure Programming",
      "Android Security",
      "Data Structures and Algorithms",
    ],
    emphasis: true,
  },
  {
    id: "santa-ursula",
    school: "SMA Santa Ursula",
    credential: "High School, Natural Sciences",
    dateRange: "July 2021 – June 2024",
  },
];

export const organizationRoles: OrganizationRole[] = [
  {
    id: "ldkcp-chairperson",
    title: "Chairperson of LDK-CP HIMTI 2026",
    org: "HIMTI BINUS University",
    dateRange: "April 2026 – June 2026",
    achievements: [
      "Led end-to-end planning of LDK-CP HIMTI 2026, delivering the main event and a follow-up session for 150+ participants.",
      "Coordinated 40 committee members across 8 BINUS regions, overseeing logistics, budgeting, and administration.",
    ],
    certificate: {
      src: certLdkcpChairman,
      alt: "Certificate of Appreciation naming Margareta Nadya Roselani Bramanjaya as Chairman of LDK-CP HIMTI 2026",
      caption: "Certificate of Appreciation: Chairman, LDK-CP 2026",
    },
    photos: [
      {
        src: photoLdkcpEvent,
        alt: "Margareta with two teammates on stage holding recognition plaques at an LDK-CP HIMTI event",
        caption: "LDK-CP HIMTI 2026",
      },
    ],
  },
  {
    id: "pubmar-manager",
    title: "Manager of the Publication and Marketing Division | Commission 2",
    org: "HIMTI BINUS University",
    dateRange: "February 2026 – November 2026",
    achievements: [
      "Managed 50+ team members across 4 Greater Jakarta regions, overseeing campaign execution and brand consistency.",
      "Secured 5+ media partners and oversaw legally binding MoAs, maintaining stakeholder trust and organizational growth.",
      "Directed and produced 20+ content pieces using Figma and Canva, driving 500,000+ social media reach.",
    ],
  },
  {
    id: "hilet-mentor",
    title: "Mentor of HIMTI Leadership Training (HILET) 2026",
    org: "HIMTI BINUS University",
    dateRange: "November 2025 – December 2025",
    achievements: [
      "Onboarded newly recruited publication and marketing members via a simulated event, guiding branding, marketing, and content workflows.",
    ],
    certificate: {
      src: certHiletMentor,
      alt: "E-Certificate naming Nadya Roselani Bramanjaya as Staff of Mentor Division in HILET 2026: Interstellar Leadership Mission",
      caption: "E-Certificate: Staff of Mentor Division, HILET 2026",
    },
    photos: [
      {
        src: photoHiletCommittee,
        alt: "Large group photo of the HILET26 Interstellar Leadership Mission committee posing indoors with the event banner",
        caption: "HILET 2026 committee",
      },
    ],
  },
  {
    id: "techno-coordinator",
    title: "Coordinator of Publication and Marketing Division TECHNO 2025",
    org: "HIMTI BINUS University",
    dateRange: "March 2025 – September 2025",
    achievements: [
      "Led publication and marketing across 8 SOCS regions, attracting 500+ participants.",
      "Generated 100,000+ engagements across multiple social media platforms.",
      "Led recruitment initiatives that attracted 1,300+ new students to HIMTI Activist 2026/2027.",
      "Developed promotional materials, branding assets, and social media content, ensuring a consistent brand experience across campaigns.",
    ],
    certificate: {
      src: certTechnoCoordinator,
      alt: "Certificate of Appreciation naming Margareta Nadya Roselani Bramanjaya as Coordinator of Buram (Publication and Marketing) Division in TECHNO 2025",
      caption: "Certificate of Appreciation: TECHNO 2025",
    },
    photos: [
      {
        src: photoTechnoCommittee,
        alt: "Very large group photo of the TECHNO 2025 organizing committee in an auditorium",
        caption: "TECHNO 2025 committee",
      },
    ],
  },
];

/**
 * Community and event involvement beyond the CV's named organizational roles.
 * Deliberately minimal: photographic evidence only, no invented titles,
 * responsibilities, or dates, per direct instruction.
 */
export const additionalInvolvement: AdditionalInvolvement[] = [
  {
    id: "sesvent-2025",
    event: "SESVENT 2025",
    role: "Organizing Committee",
    recognition: {
      label: "2nd Place: Best Noble, House Highspire",
      image: {
        src: recognitionSesvent,
        alt: "Recognition slide reading Best Noble 2nd, Second Place, Nadya Margareta R. B., House Highspire",
        caption: "Best Noble: 2nd Place, House Highspire (SESVENT 2025)",
      },
    },
    photos: [
      {
        src: photoSesventCommittee,
        alt: "Large group photo of the SESVENT 2025 organizing committee posing outdoors",
        caption: "SESVENT 2025 organizing committee",
      },
    ],
  },
  {
    id: "icpc-asia-jakarta",
    event: "ICPC Asia Jakarta 2025",
    role: "Organizing Committee",
    photos: [
      {
        src: photoIcpcCommittee,
        alt: "Group photo of the ICPC Asia Jakarta 2025 organizing committee in a university lobby",
        caption: "ICPC Asia Jakarta 2025 organizing committee",
      },
    ],
  },
  {
    id: "codeavour-7",
    event: "Codeavour 7.0",
    role: "Experience Zone Team & Jakarta Committee",
    photos: [
      {
        src: photoCodeavourExperienceZone,
        alt: "Small group photo of the Codeavour 7.0 Experience Zone team",
        caption: "Experience Zone team",
      },
      {
        src: photoCodeavourJakartaCommittee,
        alt: "Large group photo of the Codeavour 7.0 International Jakarta committee on stage",
        caption: "Jakarta committee, final stage",
      },
    ],
  },
];

export const projects: Project[] = [
  {
    id: "mobile-pentest",
    category: "Mobile Application Security",
    title: "Mobile Application Penetration Tester",
    projectType: "Group Project",
    summary:
      "Static and dynamic security analysis of a Flutter-based hospital app using JADX, Apktool, ADB, and HTTP Toolkit, identifying 6 vulnerabilities across authentication, storage, and API security.",
    tools: ["JADX", "Apktool", "ADB", "HTTP Toolkit", "CVSS v4.0", "JWT analysis"],
    metrics: [
      { label: "Vulnerabilities identified", value: "6" },
      { label: "Scoring standard", value: "CVSS v4.0" },
    ],
    severityBreakdown: [
      { severity: "high", count: 1 },
      { severity: "medium", count: 2 },
      { severity: "low", count: 3 },
    ],
    quote: "It's never the lock. It's the parameter.",
    caseStudy: {
      overview:
        "A Flutter-based hospital mobile application was assessed for authentication, storage, and API security flaws. The scope covered account registration, login, OTP-based password reset, and patient family data management, combining static decompilation with dynamic runtime and traffic analysis.",
      role: "Group project. Lead on dynamic analysis, plus vulnerability scoring and report documentation.",
      methodology: [
        "Static analysis with JADX and Apktool for decompilation and source review",
        "Dynamic analysis with ADB and HTTP Toolkit to observe runtime behavior and intercept traffic",
        "Severity scoring of every finding with CVSS v4.0",
        "JWT claim analysis, scripted in Python",
      ],
      tools: ["JADX", "Apktool", "ADB", "HTTP Toolkit", "CVSS v4.0", "JWT analysis"],
      findings: [
        "6 vulnerabilities identified: 1 High, 2 Medium, 3 Low",
        "Sensitive authentication data (password, OTP, Firebase token) exposed through URL query parameters",
        "Bearer tokens stored in plaintext in local storage",
      ],
      impact:
        "The exposed credentials and insecure token storage were scored across the High to Low range with CVSS v4.0, reflecting their relative risk to user accounts and sensitive medical data.",
      mitigation: "Impact and remediation guidance for each finding was documented in a penetration testing report.",
      takeaway:
        "Structured vulnerability scoring (CVSS v4.0) alongside hands-on static and dynamic analysis turned technical findings into a report suitable for stakeholder review.",
    },
  },
  {
    id: "soc-log-analyzer",
    category: "Defensive Security",
    title: "SOC Log Analyzer",
    projectType: "Individual Project",
    summary:
      "A Python-based defensive security tool that analyzes Linux authentication logs and detects suspicious SSH activity using rule-based detection and sliding time windows.",
    tools: ["Python", "pytest", "MITRE ATT&CK", "Linux auth logs", "CSV reporting"],
    metrics: [
      { label: "Test coverage", value: "94%" },
      { label: "pytest tests", value: "28" },
    ],
    caseStudy: {
      overview:
        "A Python-based defensive security tool that analyzes Linux authentication logs and detects suspicious SSH activity. Detection combines rule-based checks with sliding time windows, and related alerts are correlated across multiple stages.",
      role: "Individual project.",
      methodology: [
        "Rule-based detection over sliding time windows to flag suspicious SSH activity in Linux authentication logs",
        "Multi-stage alert correlation, with MITRE ATT&CK mapping",
        "CLI and CSV incident reporting, with configurable thresholds and IP/CIDR whitelisting",
        "Automated testing with pytest: 94% coverage across 28 tests",
      ],
      tools: ["Python", "pytest", "MITRE ATT&CK", "Linux auth logs", "CSV reporting"],
      findingsLabel: "What it detects",
      findings: ["Brute-force attacks", "User enumeration", "Suspicious logins", "Privilege escalation"],
    },
  },
  {
    id: "splunk-siem-lab",
    category: "SIEM and Threat Detection",
    title: "Splunk Enterprise SIEM & Threat Intel Lab",
    projectType: "Individual Project",
    summary:
      "A local SIEM environment built with Splunk Enterprise and Microsoft Sysmon to ingest and analyze Windows security event logs, with SPL detections and threat intelligence lookups.",
    tools: ["Splunk Enterprise", "Sysmon", "SPL", "Splunk Lookups", "MITRE ATT&CK", "CTI feeds"],
    metrics: [
      { label: "Brute Force", value: "T1110" },
      { label: "Abuse Elevation Control Mechanism", value: "T1548" },
    ],
    caseStudy: {
      overview:
        "A local SIEM environment built to ingest and analyze Windows security event logs. Detection queries are mapped to MITRE ATT&CK, and threat intelligence feeds are used to flag known malicious indicators.",
      role: "Individual project.",
      methodology: [
        "Built a local SIEM with Splunk Enterprise and Microsoft Sysmon to ingest and analyze Windows security event logs",
        "Wrote SPL detection queries for MITRE ATT&CK techniques T1110 (Brute Force) and T1548 (Abuse Elevation Control Mechanism)",
        "Integrated Cyber Threat Intelligence (CTI) feeds through Splunk Lookups to identify malicious Indicators of Compromise (IoCs)",
        "Built interactive security dashboards that support rapid incident triage and log analysis",
      ],
      tools: ["Splunk Enterprise", "Sysmon", "SPL", "Splunk Lookups", "MITRE ATT&CK", "CTI feeds"],
      findingsLabel: "Dashboards monitor",
      findings: ["Authentication anomalies", "IoC matches", "Failed login spikes"],
    },
  },
  {
    id: "edtech-platform",
    category: "Secure Web Development",
    title: "EdTech Platform Development",
    codename: "Digi+wo",
    projectType: "Group Project",
    summary:
      "A full-stack, game-like math learning platform for Indonesian elementary students (grades 1–6), built with Node.js, Express.js, and MySQL and a security-focused backend.",
    tools: ["Node.js", "Express.js", "MySQL", "bcrypt", "Nodemailer"],
    metrics: [
      { label: "Database tables", value: "9" },
      { label: "Game modes validated server-side", value: "5" },
      { label: "Topics covered", value: "30+" },
    ],
    quote: "Simple isn't the same as easy.",
    github: "https://github.com/Mayhem127/DIGITWO",
    gallery: [
      { src: projectDigitwoLanding, alt: "Digi+wo landing page: 'Learn Math the Fun Way!'", caption: "Landing page" },
      { src: projectDigitwoLearning, alt: "Digi+wo learning materials screen for Kelas 5 SD math topics", caption: "Learning materials" },
      { src: projectDigitwoPractice, alt: "Digi+wo practice game mode selection screen", caption: "Practice game" },
      { src: projectDigitwoDashboard, alt: "Digi+wo admin dashboard showing student leaderboard and performance", caption: "Admin dashboard" },
    ],
    caseStudy: {
      overview:
        "Digi+wo turns math practice for grades 1 to 6 into an interactive, game-like experience. It is a full-stack web application on Node.js, Express.js, and MySQL, with security built into the backend.",
      role: "Group project. Full-stack developer; owned the core learning engine and backend security architecture.",
      methodology: [
        "Implemented bcrypt password hashing and an account lockout policy of 3 attempts",
        "Built a relational database with 9 tables",
        "Added server-side input validation across 5 game modes (Quiz, Drag & Drop, Fill-In, Card Match, and a Dino Jump mini-game) to prevent client-side tampering",
        "Refactored 2,770 lines into 10 modular components, with XSS-safe output sanitization",
        "Developed a Fisher-Yates question randomization engine covering 30+ topics",
        "Built an automated Nodemailer reporting pipeline that sends progress updates to parents",
      ],
      tools: ["Node.js", "Express.js", "MySQL", "bcrypt", "Nodemailer"],
      findingsLabel: "Testing and evaluation",
      findings: [
        "API and unit testing across core flows",
        "Usability evaluated with the System Usability Scale (SUS), targeting a score of ≥ 68",
      ],
      impact: "Server-side validation and output sanitization guard against client-side tampering and XSS.",
      mitigation:
        "Password hashing (bcrypt), a 3-attempt lockout policy, and token-based authentication hardened the platform against brute-force and credential-stuffing attempts.",
      takeaway:
        "Rebuilding a large monolithic script into modular, testable components made the security work (validation, sanitization, hashing) verifiable rather than incidental.",
    },
  },
  {
    id: "threat-modeling",
    category: "Threat Modeling & Risk Analysis",
    title: "Threat Modeling & Risk Analysis",
    codename: "ThreatBlueprint",
    projectType: "Group Project",
    additional: true,
    summary:
      "A threat model of a widely used social media application among university students, mapping trust boundaries and critical assets across authentication, payment, and bot authorization flows.",
    tools: ["STRIDE", "MITRE ATT&CK", "OWASP Top 10"],
    metrics: [
      { label: "Trust boundaries mapped", value: "4" },
      { label: "Threats referenced to MITRE / OWASP", value: "6+" },
    ],
    quote: "Not every leak needs a hacker.",
    caseStudy: {
      overview:
        "A structured threat model of a widely used social media application among university students, identifying trust boundaries and critical assets across authentication, payment, and bot authorization flows.",
      role: "Group project. Threat modeling analyst; trust-boundary analysis, STRIDE threat identification, and mitigation proposals.",
      methodology: [
        "Mapped the full system architecture and identified 4 trust boundaries between users, servers, and third-party integrations",
        "Applied the STRIDE framework across all five threat categories: Spoofing, Tampering, Information Disclosure, Denial of Service, and Elevation of Privilege",
        "Mapped identified threats to MITRE ATT&CK techniques (e.g. T1566: Phishing) and OWASP Top 10 / CWE references (e.g. CWE-307: Improper Restriction of Excessive Authentication Attempts)",
      ],
      tools: ["STRIDE", "MITRE ATT&CK", "OWASP Top 10"],
      findings: ["Insufficient rate limiting on key flows", "Username enumeration risk"],
      impact:
        "Left unaddressed, both findings could ease credential-stuffing or account-enumeration attacks at scale.",
      mitigation:
        "Proposed mitigations included role-based access control (RBAC), rate limiting, and step-up authentication for sensitive actions.",
      takeaway:
        "Applying STRIDE alongside MITRE ATT&CK and OWASP Top 10 surfaced concrete, addressable risks in a system far larger than a typical classroom exercise.",
    },
  },
  {
    id: "wastewise",
    category: "Applied Machine Learning",
    title: "WasteWise",
    projectType: "Group Project",
    additional: true,
    summary:
      "An on-device waste classification model that identifies a waste item's category from a single photo, so no manual sorting knowledge is required.",
    tools: ["Python", "TensorFlow / Keras", "MobileNetV2", "TensorFlow Lite", "Kaggle API", "NumPy"],
    quote: "The model doesn't need to be perfect. It needs to know when it isn't.",
    caseStudy: {
      overview:
        "WasteWise targets sorting, the first bottleneck in recycling, by classifying a waste item's category from a single photo, entirely on-device.",
      role: "Group project. AI/ML engineer; built the full training pipeline.",
      methodology: [
        "Pulled the Garbage Classification Dataset from Kaggle (5,000+ images) and simplified 8 raw classes into 6 usable categories",
        "Split data 80/20 train-validation and normalized all images to 224×224 RGB",
        "Applied transfer learning on a MobileNetV2 backbone pretrained on ImageNet, frozen during training",
        "Trained a lightweight classification head outputting a 6-class probability vector, then converted the final model to TensorFlow Lite for on-device, offline inference",
      ],
      tools: ["Python", "TensorFlow / Keras", "MobileNetV2", "TensorFlow Lite", "Kaggle API", "NumPy"],
      findings: [],
      impact:
        "A frozen, pretrained backbone with a lightweight custom head kept training tractable while reusing ImageNet's learned visual features.",
      takeaway:
        "Confidence scores matter as much as raw accuracy: a model that flags its own uncertainty is more trustworthy than one that guesses wrong with confidence.",
    },
  },
];

export const skillGroups: SkillGroup[] = [
  {
    label: "Cybersecurity",
    items: [
      "Penetration Testing",
      "Application Security",
      "SIEM",
      "Log Analysis",
      "Security Monitoring",
      "Threat Detection",
      "Security Analysis",
      "MITRE ATT&CK",
    ],
  },
  { label: "Programming Languages", items: ["Python", "JavaScript", "SQL", "C"] },
  { label: "Web Development", items: ["Node.js", "Express.js", "React", "HTML", "CSS"] },
  {
    label: "Security Tools",
    items: [
      "Splunk",
      "Sysmon",
      "Nmap",
      "Burp Suite",
      "Wireshark",
      "JADX",
      "Apktool",
      "ADB",
      "HTTP Toolkit",
      "Wazuh",
      "Kali Linux",
    ],
  },
  {
    label: "Development Tools",
    items: ["Git", "GitHub", "Docker", "Visual Studio Code", "Android Studio"],
  },
  {
    label: "Soft Skills",
    items: [
      "Leadership",
      "Project Management",
      "Teamwork",
      "Communication",
      "Problem Solving",
      "Stakeholder Communication",
    ],
  },
];

export const certifications: Certification[] = [
  {
    id: "cisco-cybersecurity",
    title: "Introduction to Cybersecurity",
    issuer: "CISCO",
    date: "01 July 2026",
    certificateImage: {
      src: certCisco,
      alt: "CISCO Networking Academy Certificate of Course Completion for Introduction to Cybersecurity",
      caption: "CISCO Networking Academy: Certificate of Course Completion",
    },
  },
  {
    id: "cambridge-fce",
    title: "Cambridge English: B2 First (FCE)",
    issuer: "Cambridge University Press & Assessment",
    date: "01 May 2023",
  },
];

export const languages: LanguageEntry[] = [
  { language: "English", level: "Proficient" },
  { language: "Indonesian", level: "Native" },
];
