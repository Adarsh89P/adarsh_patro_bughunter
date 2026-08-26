import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Bot,
  Braces,
  Bug,
  CircleCheckBig,
  Database,
  FileCode2,
  GitBranch,
  Gauge,
  Layers,
  Network,
  ShieldCheck,
  TerminalSquare,
  Workflow,
} from 'lucide-react';

export const profile = {
  name: 'Adarsh Patro',
  role: 'Automation QA Engineer',
  tagline: 'A Bug Hunter.',
  summary:
    'Automation QA Engineer building reliable, scalable, and efficient testing solutions.',
  location: 'India',
  email: 'adarsh89patro@gmail.com',
  linkedin: 'https://www.linkedin.com/in/adarsh-patro',
  github: 'https://github.com/Adarsh89P',
  resume: '/resume.pdf',
} as const;

export const navSections = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
] as const;

export type Focus = { label: string; icon: LucideIcon; description: string };

export const focusAreas: Focus[] = [
  {
    label: 'Automation Testing',
    icon: Bot,
    description: 'End-to-end suites that run unattended on every build.',
  },
  {
    label: 'UI Testing',
    icon: Layers,
    description: 'Stable selectors, resilient waits, zero flake tolerance.',
  },
  {
    label: 'API Testing',
    icon: Network,
    description: 'Contract, integration and data-driven service coverage.',
  },
  {
    label: 'Framework Design',
    icon: Workflow,
    description: 'Reusable, page-object driven architecture teams can extend.',
  },
  {
    label: 'Performance Testing',
    icon: Gauge,
    description: 'Load profiles and thresholds tied to real release gates.',
  },
];

export type Skill = {
  name: string;
  icon: LucideIcon;
  blurb: string;
  level: 'Primary' | 'Core' | 'Working';
};

export const skills: Skill[] = [
  { name: 'Playwright', icon: Bug, blurb: 'Parallel E2E across Chromium, WebKit and Firefox.', level: 'Primary' },
  { name: 'Selenium', icon: Bot, blurb: 'Grid-based cross-browser regression at scale.', level: 'Primary' },
  { name: 'Java', icon: FileCode2, blurb: 'Primary language for framework and utility layers.', level: 'Primary' },
  { name: 'JavaScript', icon: Braces, blurb: 'Test scripting, tooling and browser automation.', level: 'Core' },
  { name: 'TypeScript', icon: TerminalSquare, blurb: 'Typed Playwright fixtures and shared test models.', level: 'Core' },
  { name: 'API Testing', icon: Network, blurb: 'REST Assured, Postman and schema validation.', level: 'Primary' },
  { name: 'TestNG', icon: CircleCheckBig, blurb: 'Suites, groups, retries and parallel execution.', level: 'Core' },
  { name: 'JMeter', icon: Activity, blurb: 'Load, stress and soak profiles with clear SLAs.', level: 'Working' },
  { name: 'Git', icon: GitBranch, blurb: 'Trunk-based flow, reviews and clean history.', level: 'Core' },
  { name: 'CI/CD', icon: ShieldCheck, blurb: 'Jenkins and GitHub Actions quality gates.', level: 'Core' },
  { name: 'SQL', icon: Database, blurb: 'Backend assertions and test data preparation.', level: 'Core' },
];

export type Experience = {
  role: string;
  company: string;
  period: string;
  summary: string;
  points: string[];
  stack: string[];
};

export const experiences: Experience[] = [
  {
    role: 'QA Automation Engineer',
    company: 'LEROI | LHG',
    period: '2023 — Present',
    summary: 'Own the automation strategy for a multi-product insurance platform.',
    points: [
      'Designed and maintain a Playwright + TypeScript framework covering critical customer journeys.',
      'Cut regression cycles from days to hours by parallelising suites across CI runners.',
      'Introduced API-level test layers that catch contract breaks before UI runs start.',
      'Report release readiness with trend dashboards the whole delivery team reads.',
    ],
    stack: ['Playwright', 'TypeScript', 'Java', 'REST Assured', 'GitHub Actions'],
  },
  {
    role: 'Automation Engineer',
    company: 'Sundew Solutions',
    period: '2022 — 2023',
    summary: 'Built reusable automation assets across several client engagements.',
    points: [
      'Migrated legacy record-and-playback scripts to a maintainable page-object framework.',
      'Added data-driven coverage so one test body validates dozens of business permutations.',
      'Wired suites into Jenkins with fail-fast gates and rich HTML reporting.',
    ],
    stack: ['Selenium', 'Java', 'TestNG', 'Maven', 'Jenkins'],
  },
  {
    role: 'Software Test Engineer',
    company: 'Sundew Solutions',
    period: '2021 — 2022',
    summary: 'Manual and exploratory testing foundation that shaped the automation work.',
    points: [
      'Authored structured test cases and traceability for core product modules.',
      'Ran exploratory sessions that surfaced high-severity defects ahead of release.',
      'Partnered with developers on root-cause analysis and regression prevention.',
    ],
    stack: ['Jira', 'Postman', 'SQL', 'Test Design'],
  },
];

export type Metric = { value: string; label: string };

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  challenge: string;
  solution: string;
  impact: string[];
  stack: string[];
  metrics: Metric[];
  caseStudy: {
    overview: string;
    problem: string;
    challenge: string;
    solution: string;
    architecture: string[];
    strategy: string[];
    results: string[];
    lessons: string[];
  };
};

export const projects: Project[] = [
  {
    slug: 'automation-test-suite',
    name: 'Automation Test Suite',
    tagline: 'End-to-end insurance automation suite with 1600+ test cases.',
    challenge: 'Manual regression testing was time-consuming and error-prone.',
    solution:
      'Built a scalable automation framework using modern testing tools and a reusable, page-object driven architecture.',
    impact: [
      '1600+ automated test cases',
      '70% faster release regression',
      '90% regression coverage',
      'Manual effort reduced to exploratory work only',
    ],
    stack: ['Playwright', 'Java', 'TestNG', 'REST Assured', 'Jenkins'],
    metrics: [
      { value: '1600+', label: 'Test cases' },
      { value: '70%', label: 'Faster execution' },
      { value: '90%', label: 'Regression coverage' },
    ],
    caseStudy: {
      overview:
        'A full regression automation programme for an insurance platform spanning quoting, policy administration and claims.',
      problem:
        'Every release needed a multi-day manual regression pass. Coverage varied by tester, defects leaked into production, and the team could not release more than once a month with confidence.',
      challenge:
        'The application spans several modules with deep, stateful flows and heavy backend dependency. Test data had to be created per run, and the suite needed to stay readable for engineers who were not automation specialists.',
      solution:
        'A layered framework: a driver/fixture layer, page objects per module, a business-flow layer that reads like the test plan, and an API layer used both for assertions and for fast test-data setup.',
      architecture: [
        'Fixture layer — browser context, auth state and environment configuration.',
        'Page objects — one per screen, exposing intent-level methods, never raw selectors.',
        'Business flows — composable journeys such as "issue a policy" reused across suites.',
        'API utilities — REST Assured helpers seed data and assert backend state.',
        'Reporting — HTML report plus CI annotations with failure screenshots and traces.',
      ],
      strategy: [
        'Risk-based prioritisation: smoke, critical path, then full regression tiers.',
        'API-first setup so UI tests start from a known state instead of clicking through it.',
        'Deterministic waits on application state, never fixed sleeps.',
        'Parallel execution sharded across CI runners with isolated test data.',
        'Quarantine lane for genuinely unstable tests so the main suite stays trustworthy.',
      ],
      results: [
        'Regression cycle reduced from several days to a few hours.',
        '1600+ automated cases running on every candidate build.',
        'Roughly 90% regression coverage of the critical business flows.',
        'Defects found earlier, with traces attached to the failing run.',
      ],
      lessons: [
        'A framework only survives if non-specialists can read and extend it.',
        'Test data setup deserves as much design attention as the assertions.',
        'A small, always-green smoke suite earns more trust than a large flaky one.',
      ],
    },
  },
  {
    slug: 'payment-flow-automation',
    name: 'Payment Flow Automation',
    tagline: 'Automated validation across payment gateways and reconciliation.',
    challenge: 'Manual payment validation was slow, repetitive and easy to get wrong.',
    solution:
      'Built a robust automation framework combining UI journeys with API and database assertions across every payment path.',
    impact: [
      'Full gateway matrix covered on each release',
      'Reconciliation checks automated end to end',
      'Payment defects caught before staging sign-off',
    ],
    stack: ['Playwright', 'API Testing', 'SQL', 'TypeScript'],
    metrics: [
      { value: '6', label: 'Payment paths' },
      { value: '100%', label: 'Critical flow coverage' },
      { value: '3x', label: 'Faster validation' },
    ],
    caseStudy: {
      overview:
        'Automation for the payment and reconciliation journey, from checkout through gateway callback to ledger entry.',
      problem:
        'Payments were validated by hand across several gateways and currencies. Each release needed a long checklist, and reconciliation mismatches were often found only after go-live.',
      challenge:
        'Third-party gateways behave asynchronously, sandbox environments are flaky, and a payment is only correct when the UI, the API response and the database ledger all agree.',
      solution:
        'A three-way assertion model: the UI journey drives the payment, API polling waits for the terminal state, and SQL assertions confirm the ledger entry matches the expected amount and status.',
      architecture: [
        'Journey layer — checkout flows per payment method.',
        'Gateway adapters — sandbox handling isolated behind one interface per provider.',
        'State poller — deterministic waiting on webhook-driven status changes.',
        'Ledger assertions — SQL checks on amount, currency, status and reference.',
      ],
      strategy: [
        'Every payment method exercised on both success and failure paths.',
        'Idempotency and retry behaviour covered explicitly.',
        'Currency and rounding edge cases driven from a data table.',
        'Isolated test accounts so parallel runs never collide.',
      ],
      results: [
        'The full gateway matrix runs unattended on every release candidate.',
        'Reconciliation mismatches surface in CI instead of in production.',
        'Validation time reduced roughly threefold against the manual checklist.',
      ],
      lessons: [
        'Asynchronous flows need state polling, not longer sleeps.',
        'A payment test that only asserts the UI proves very little.',
        'Sandbox instability must be isolated, or it becomes framework instability.',
      ],
    },
  },
  {
    slug: 'api-regression-shield',
    name: 'API Regression Shield',
    tagline: 'Contract-first service coverage that fails fast in CI.',
    challenge: 'Backend contract changes broke the UI suite long after the fact.',
    solution:
      'Introduced a fast API regression layer that runs before UI suites and blocks the pipeline on contract drift.',
    impact: [
      'Contract breaks caught in minutes, not hours',
      'UI suite noise reduced significantly',
      'Clear ownership of backend defects',
    ],
    stack: ['REST Assured', 'Java', 'TestNG', 'JSON Schema'],
    metrics: [
      { value: '<5 min', label: 'Suite runtime' },
      { value: '200+', label: 'Endpoint checks' },
      { value: '1st', label: 'Gate in the pipeline' },
    ],
    caseStudy: {
      overview:
        'A fast, deterministic API regression layer positioned as the first quality gate in the delivery pipeline.',
      problem:
        'Service contract changes were discovered by long UI runs. Failures looked like UI defects, triage was slow, and ownership was unclear.',
      challenge:
        'The suite had to be fast enough to gate every commit, strict enough to catch schema drift, and readable enough that backend engineers would maintain it themselves.',
      solution:
        'Schema-validated request/response tests per endpoint, grouped by service, executing in parallel and reporting failures in the language of the API rather than the UI.',
      architecture: [
        'Client layer — one typed client per service with shared auth handling.',
        'Schema registry — JSON Schema definitions versioned alongside the tests.',
        'Scenario layer — happy path, validation errors, auth failures and edge cases.',
        'Pipeline gate — runs before UI suites and stops the build on failure.',
      ],
      strategy: [
        'Every endpoint carries at least one contract test and one negative test.',
        'Schemas assert structure and types, not just status codes.',
        'Failures name the service and field, so triage is immediate.',
        'The suite is kept under five minutes so nobody is tempted to skip it.',
      ],
      results: [
        'Contract drift surfaces within minutes of a commit.',
        'UI suite failures now overwhelmingly indicate real UI defects.',
        'Backend teams took ownership of their own contract tests.',
      ],
      lessons: [
        'Speed is a feature: a slow gate gets bypassed.',
        'Error messages are part of the test design.',
        'Testing at the lowest useful layer keeps the pyramid honest.',
      ],
    },
  },
];

export const stats = [
  { value: '1600+', label: 'Automated test cases' },
  { value: '70%', label: 'Faster regression cycles' },
  { value: '90%', label: 'Regression coverage' },
  { value: '4+', label: 'Years hunting bugs' },
] as const;
