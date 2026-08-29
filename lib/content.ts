import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Bot,
  Braces,
  ClipboardCheck,
  Database,
  GitBranch,
  MonitorCog,
  Network,
  ServerCog,
  Workflow,
} from 'lucide-react';
import { asset } from './site';

/**
 * Every word on the site comes from this file, and every fact in it comes from
 * Adarsh's resume (public/Adarsh_Patro_SDET_Resume.docx). Keep the two in sync.
 */

export const profile = {
  name: 'Adarsh Patro',
  role: 'QA Automation Engineer · SDET',
  tagline: 'A Bug Hunter.',
  summary:
    'SDET with 6+ years in IT and 4+ in test automation — building scalable Playwright, Selenium and API frameworks that catch defects before release.',
  location: 'Kolkata, West Bengal, India',
  phone: '+91 8910873212',
  email: 'adarsh89patro@gmail.com',
  linkedin: 'https://www.linkedin.com/in/adarsh-patro-08528a210',
  github: 'https://github.com/Adarsh89P',
  // asset() keeps the link correct under a GitHub Pages base path.
  resume: asset('/resume.pdf'),
  resumeDocx: asset('/Adarsh_Patro_SDET_Resume.docx'),
} as const;

export const navSections = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
] as const;

export const about = {
  lead: 'Quality Assurance / Software Development Engineer in Test with 6+ years of IT experience, including 4+ years in manual and automation testing, CI/CD pipeline integration, and quality engineering across web, mobile, and API layers.',
  more: [
    'Skilled in building and maintaining scalable automation frameworks using Selenium WebDriver, Playwright (JavaScript/TypeScript), and Appium, applying the Page Object Model (POM) and data-driven testing patterns. Experienced across the full Software Test Life Cycle (STLC): test planning, test case design, execution, defect tracking, and reporting.',
    'Proficient in performance and load testing (Apache JMeter, Gatling), API test automation (Postman, Rest Assured, SoapUI), and backend data validation using SQL. Contributes to CI/CD delivery pipelines with Jenkins, Git, and GitHub Actions within Agile/Scrum teams.',
  ],
} as const;

export type Focus = { label: string; icon: LucideIcon; description: string };

export const focusAreas: Focus[] = [
  {
    label: 'Automation Testing',
    icon: Bot,
    description: 'Selenium WebDriver, Playwright and Appium suites built on the Page Object Model.',
  },
  {
    label: 'API Testing',
    icon: Network,
    description: 'REST and SOAP coverage with Postman, Rest Assured and SoapUI.',
  },
  {
    label: 'Performance Testing',
    icon: Activity,
    description: 'Load, stress and scalability profiles in Apache JMeter and Gatling.',
  },
  {
    label: 'CI/CD Integration',
    icon: GitBranch,
    description: 'Continuous test execution on every build through Jenkins and GitHub Actions.',
  },
  {
    label: 'Database Testing',
    icon: Database,
    description: 'Backend data validation with SQL across MySQL and PostgreSQL.',
  },
];

export type SkillGroup = { name: string; icon: LucideIcon; items: string[] };

/** Mirrors the Core Skills section of the resume, category for category. */
export const skillGroups: SkillGroup[] = [
  {
    name: 'Automation Testing',
    icon: Bot,
    items: [
      'Selenium WebDriver',
      'Playwright (JavaScript/TypeScript)',
      'Appium',
      'TestNG',
      'JUnit',
      'Page Object Model (POM)',
      'Data-Driven Testing',
      'Cross-Browser Testing',
    ],
  },
  {
    name: 'Programming / Scripting',
    icon: Braces,
    items: ['Java', 'JavaScript', 'TypeScript', 'SQL'],
  },
  {
    name: 'API Testing',
    icon: Network,
    items: [
      'Postman',
      'Rest Assured',
      'SoapUI',
      'RESTful API Testing',
      'SOAP API Testing',
      'Contract Testing',
      'Payload Validation',
    ],
  },
  {
    name: 'Performance Testing',
    icon: Activity,
    items: ['Apache JMeter', 'Gatling', 'Load Testing', 'Stress Testing', 'Scalability Testing'],
  },
  {
    name: 'CI/CD & Version Control',
    icon: GitBranch,
    items: ['Jenkins', 'GitHub Actions', 'Git', 'GitHub'],
  },
  {
    name: 'Test Management',
    icon: ClipboardCheck,
    items: [
      'JIRA',
      'Test Plan Authoring',
      'Test Case Design',
      'Traceability Matrix',
      'Defect Lifecycle Management',
    ],
  },
  {
    name: 'Database Testing',
    icon: Database,
    items: ['SQL', 'MySQL', 'PostgreSQL', 'Backend Data Validation'],
  },
  {
    name: 'Methodologies',
    icon: Workflow,
    items: [
      'Agile',
      'Scrum',
      'STLC',
      'Regression Testing',
      'Smoke Testing',
      'Peer Code Review',
      'Sprint Planning',
    ],
  },
  {
    name: 'Platforms',
    icon: MonitorCog,
    items: ['Windows', 'Linux'],
  },
];

export type Experience = {
  role: string;
  company: string;
  period: string;
  points: string[];
  stack: string[];
};

export const experiences: Experience[] = [
  {
    role: 'QA Automation Engineer – Technical Associate',
    company: 'Sundew Solutions Pvt Ltd',
    period: 'Mar 2024 — Present',
    points: [
      'Architected and maintained Playwright (JavaScript/TypeScript) end-to-end automation scripts for enterprise web platforms, reducing manual regression effort by approximately 35%.',
      'Converted 1000+ manual test cases into automated functional and regression test flows, increasing sprint automation coverage by approximately 40% and accelerating release cycles.',
      'Integrated automated test suites into the CI/CD delivery pipeline using Jenkins, enabling continuous test execution on every build and early defect detection.',
      'Partnered with developers, product owners, and DevOps engineers across Agile sprints to align test strategy with product requirements, reducing rework from misaligned acceptance criteria.',
      'Owned the end-to-end defect lifecycle in JIRA — logging, triage, prioritization, and resolution tracking with detailed reproduction steps — improving fix turnaround time.',
      'Enforced coding standards through peer code reviews of automation scripts, improving framework maintainability and reducing flaky test failures.',
    ],
    stack: ['Playwright', 'JavaScript', 'TypeScript', 'Jenkins', 'JIRA', 'Agile'],
  },
  {
    role: 'QA Associate – Automation & Manual Testing',
    company: 'Qolaris Data Ltd',
    period: 'Nov 2023 — Mar 2024',
    points: [
      'Designed and executed UI automation scripts using Selenium WebDriver (Java) with the Page Object Model (POM), ensuring scalable and maintainable test architecture.',
      'Implemented mobile automation testing using Appium for Android, validating functional flows and UI interactions across multiple device and OS configurations.',
      'Validated RESTful endpoints, payloads, authentication flows, and error-handling scenarios in Postman, catching integration defects before release.',
      'Authored SQL queries to verify backend data integrity, cross-referencing application behavior against database state to identify discrepancies.',
      'Drove sprint planning and backlog grooming discussions with test case reviews, closing coverage gaps across user stories and acceptance criteria.',
    ],
    stack: ['Selenium WebDriver', 'Java', 'Appium', 'Postman', 'SQL', 'POM'],
  },
  {
    role: 'QA & Service Desk Associate',
    company: 'Minosha India Ltd',
    period: 'Mar 2020 — Oct 2023',
    points: [
      'Built and maintained a Selenium WebDriver (Java) automated regression suite, cutting manual testing cycle time by approximately 30% and improving defect detection rates across releases.',
      'Planned and executed functional, regression, integration, and performance test cycles; used JMeter for load and stress testing to verify system scalability and performance SLAs.',
      'Validated RESTful and SOAP-based services using Postman and SoapUI, ensuring contract compliance, payload accuracy, and correct error handling ahead of release.',
      'Authored and maintained test plans, test cases, and test scripts aligned to product requirements, forming the baseline for the team’s regression suite.',
      'Ran SQL queries to verify backend data integrity and identify anomalies, accelerating root-cause analysis and defect resolution for developers.',
      'Logged and tracked defects in JIRA with reproducible steps and severity classifications, driving a structured fix-and-verify process across releases.',
    ],
    stack: ['Selenium WebDriver', 'Java', 'JMeter', 'Postman', 'SoapUI', 'SQL', 'JIRA'],
  },
  {
    role: 'Help Desk Associate',
    company: 'Writer Information Service Pvt Ltd',
    period: 'Nov 2018 — Mar 2020',
    points: [
      'Resolved Tier-1 and Tier-2 software and hardware issues, sustaining a high first-contact resolution rate.',
      'Documented issues, resolutions, and escalation paths in an ITSM ticketing system, improving handoff clarity across support tiers.',
      'Created onboarding and training materials for new employees, standardizing support procedures and cutting ramp-up time.',
    ],
    stack: ['ITSM', 'Troubleshooting', 'Documentation'],
  },
];

export type Highlight = { value: string; label: string };

export type Project = {
  slug: string;
  name: string;
  repo: string;
  tagline: string;
  summary: string;
  features: string[];
  stack: string[];
  highlights: Highlight[];
  detail: {
    overview: string;
    goals: string[];
    architecture: string[];
    flow: string[];
    practices: string[];
  };
};

/**
 * Open-source automation frameworks, as described on the resume. These are
 * personal repositories rather than client engagements, so they are presented
 * as framework write-ups — no client metrics are claimed for them.
 */
export const projects: Project[] = [
  {
    slug: 'playwright-automation-framework',
    name: 'Playwright Automation Framework',
    repo: 'https://github.com/Adarsh89P/playrightframework',
    tagline: 'End-to-end web automation built with Playwright and the Page Object Model.',
    summary:
      'End-to-end web automation framework built with Playwright (JavaScript/TypeScript) using the Page Object Model design pattern. Features cross-browser test execution, reusable component abstractions, data-driven test support, and integrated HTML reporting, designed for CI/CD pipeline integration.',
    features: [
      'Cross-browser test execution',
      'Reusable component abstractions',
      'Data-driven test support',
      'Integrated HTML reporting',
      'Designed for CI/CD pipeline integration',
    ],
    stack: ['Playwright', 'JavaScript', 'TypeScript', 'Page Object Model', 'CI/CD'],
    highlights: [
      { value: 'JS/TS', label: 'Language' },
      { value: 'POM', label: 'Architecture' },
      { value: 'Cross-browser', label: 'Execution' },
    ],
    detail: {
      overview:
        'A Playwright-based end-to-end framework for web applications, structured so that tests read as business intent and the selectors live in one place per screen.',
      goals: [
        'Keep tests readable by engineers who are not automation specialists.',
        'Isolate every selector behind a page object, so a UI change touches one file.',
        'Run the same suite across browsers without per-browser test code.',
        'Produce a report that explains a failure without a re-run.',
      ],
      architecture: [
        'Page objects — one per screen, exposing intent-level methods rather than raw selectors.',
        'Reusable component abstractions for elements shared across pages.',
        'Data-driven layer so one test body covers many input permutations.',
        'Cross-browser configuration handled by the runner, not duplicated in tests.',
        'HTML reporting wired in, ready to publish from a pipeline.',
      ],
      flow: ['Trigger', 'Setup', 'Execute', 'Assert', 'Report'],
      practices: [
        'Wait on application state, never on fixed sleeps.',
        'One assertion intent per test, so a failure names its own cause.',
        'Test data prepared per run so suites can execute in parallel.',
        'Structured for CI/CD, so the suite runs on every build rather than on demand.',
      ],
    },
  },
  {
    slug: 'selenium-automation-framework',
    name: 'Selenium Automation Framework',
    repo: 'https://github.com/Adarsh89P/selenium-automation-framework',
    tagline: 'Scalable UI automation in Selenium WebDriver and Java, structured around POM.',
    summary:
      'Scalable UI test automation framework built with Selenium WebDriver and Java, structured around the Page Object Model (POM). Includes TestNG integration for parallel test execution, data-driven testing, and detailed test reporting.',
    features: [
      'Page Object Model architecture',
      'TestNG integration',
      'Parallel test execution',
      'Data-driven testing',
      'Detailed test reporting',
    ],
    stack: ['Selenium WebDriver', 'Java', 'TestNG', 'Page Object Model'],
    highlights: [
      { value: 'Java', label: 'Language' },
      { value: 'TestNG', label: 'Runner' },
      { value: 'Parallel', label: 'Execution' },
    ],
    detail: {
      overview:
        'A Java and Selenium WebDriver framework built for teams that need a maintainable regression suite rather than a pile of recorded scripts.',
      goals: [
        'Give every screen one page object and one owner.',
        'Make adding a case a matter of data, not of new plumbing.',
        'Cut wall-clock runtime through parallel execution.',
        'Report results in enough detail to triage without re-running.',
      ],
      architecture: [
        'Driver management isolated from tests, so browser setup never leaks into a case.',
        'Page objects per screen following the Page Object Model.',
        'TestNG suites, groups and parallel configuration.',
        'Data-driven inputs supplied to shared test bodies.',
        'Reporting layer capturing per-test outcomes.',
      ],
      flow: ['Suite', 'Driver', 'Page objects', 'Assertions', 'Report'],
      practices: [
        'Explicit waits on element state instead of implicit global waits.',
        'Isolated test data so parallel threads never collide.',
        'Groups separating smoke from full regression.',
        'Peer-reviewed page objects to keep the framework consistent.',
      ],
    },
  },
  {
    slug: 'api-automation-suite',
    name: 'API Automation Suite',
    repo: 'https://github.com/Adarsh89P/APIautomation',
    tagline: 'Contract-first REST coverage with Rest Assured and Postman.',
    summary:
      'API test automation project using Rest Assured and Postman, covering RESTful endpoint validation, authentication flows, response schema assertions, and error-handling scenarios, supporting CI/CD integration.',
    features: [
      'RESTful endpoint validation',
      'Authentication flow coverage',
      'Response schema assertions',
      'Error-handling scenarios',
      'CI/CD integration support',
    ],
    stack: ['Rest Assured', 'Postman', 'Java', 'JSON Schema'],
    highlights: [
      { value: 'Rest Assured', label: 'Library' },
      { value: 'REST', label: 'Endpoints' },
      { value: 'Schema', label: 'Assertions' },
    ],
    detail: {
      overview:
        'A service-level suite that validates endpoints directly, so contract breaks surface in minutes instead of inside a long UI run.',
      goals: [
        'Assert structure and types, not just status codes.',
        'Cover the failure paths as deliberately as the happy ones.',
        'Stay fast enough to gate every build.',
        'Name the service and field in a failure, so triage is immediate.',
      ],
      architecture: [
        'Request builders per service with shared authentication handling.',
        'Schema assertions validating response shape and types.',
        'Scenario coverage across happy path, validation errors and auth failures.',
        'Postman collections alongside the automated suite for exploratory checks.',
      ],
      flow: ['Request', 'Auth', 'Response', 'Schema', 'Report'],
      practices: [
        'Every endpoint carries at least one contract test and one negative test.',
        'Authentication treated as a first-class scenario, not setup noise.',
        'Kept fast so nobody is tempted to skip the gate.',
        'Structured to run inside a CI/CD pipeline.',
      ],
    },
  },
];

/**
 * The one engagement told as a story: challenge → solution → impact.
 *
 * Every figure here is taken verbatim from the Sundew Solutions bullets in
 * `experiences` above — the same numbers the resume claims, and nothing more.
 */
export const missionHighlight = {
  eyebrow: 'Mission report',
  name: 'Regression Suite Automation',
  context: 'Sundew Solutions — enterprise web platforms',
  challenge:
    'Regression was manual. Over a thousand cases had to be re-run by hand before every release, which made the suite slow to run, expensive to repeat, and easy to cut short under deadline pressure.',
  solution:
    'Built a Playwright end-to-end framework in JavaScript/TypeScript, converted the manual cases into automated functional and regression flows, and wired the suite into Jenkins so it runs on every build rather than on request.',
  impact:
    'Regression stopped being a release bottleneck: defects surface on the build that introduced them instead of during a hand-run pass at the end of the sprint.',
  metrics: [
    { value: '1000+', label: 'Manual cases automated' },
    { value: '~35%', label: 'Manual regression effort saved' },
    { value: '~40%', label: 'Sprint automation coverage gained' },
  ],
  stack: ['Playwright', 'TypeScript', 'Jenkins', 'CI/CD'],
} as const;

/** Career figures — these come from the professional experience, not the repos. */
export const stats = [
  { value: '6+', label: 'Years in IT' },
  { value: '4+', label: 'Years in testing' },
  { value: '1000+', label: 'Manual cases automated' },
  { value: '~40%', label: 'Automation coverage gained' },
] as const;

export const education = [
  {
    qualification: 'Bachelor of Computer Application (BCA)',
    institution: 'West Bengal State University, Kolkata',
    year: '2017',
  },
  {
    qualification: 'Higher Secondary Education (Science)',
    institution: 'Titagarh Upendra Bhanja Vidya Pith',
    year: '2014',
  },
] as const;

export const certifications = [
  { name: 'Playwright JS/TS Automation Testing', issuer: 'Udemy Certificate of Completion' },
] as const;
