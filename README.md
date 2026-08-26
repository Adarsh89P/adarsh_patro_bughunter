# A Bug Hunter's Journey

Interactive portfolio for **Adarsh Patro**, Automation QA Engineer.

A premium, minimal portfolio that opens as a scroll-driven cinematic: the hunter
waves hello, spots a bug, chases it, takes the shot — and the exploding bug's
particles resolve into the portfolio itself.

```
🧑🏹 → 🐛 → 🏹 → 💥 → ✨ → PORTFOLIO
```

## Stack

| Concern | Tool |
| --- | --- |
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Scroll storytelling | GSAP + ScrollTrigger |
| UI motion | Framer Motion |
| Smooth scrolling | Lenis |
| Theming | next-themes (light default, polished dark mode) |
| Icons | lucide-react |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
npm run typecheck
```

## How the cinematic works

The hero is one pinned section whose scroll progress drives a single GSAP
timeline. `components/hero/HeroTimeline.tsx` owns the choreography:

- `BEATS` maps each story moment to a position on the 0 → 1 timeline.
- The same table drives the character and bug **state machines**
  (`CHARACTER_BY_PHASE`, `BUG_BY_PHASE`), so poses and tweens can never drift apart.
- The timeline's length is pinned to exactly `1` so every beat lines up with
  scroll progress.

The character (`components/hero/Character.tsx`) is an inline SVG with a
Framer Motion variant per limb. Its states are:

```
IDLE → WAVE → LOOK → ALERT → RUN → STOP → AIM → PULL_ARROW → SHOOT → CELEBRATE
```

`WAVE` is the opening beat — the character waves while the greeting is on
screen, and again on hover. It ends on a timer or on the first scroll.

> Framer Motion always writes `transform-origin` itself, so limb pivots are
> passed as `originX`/`originY` (see the `pivot()` helper). A plain
> `transformOrigin` in `style` gets silently replaced and every joint rotates
> around the SVG's centre.

## Responsive and reduced motion

- **Desktop** gets the full pinned sequence with a camera pan and parallax.
- **Mobile** runs the same story with far less horizontal travel and fewer
  explosion particles.
- **`prefers-reduced-motion`** disables the pin, Lenis and the cinematic
  entirely; the hero becomes a static composition and sections simply fade in.

## Content

All copy, skills, experience and case studies live in `lib/content.ts` — one
file to edit, no markup changes required. Case study pages are generated from
the same data at `/projects/[slug]`.

Add your `resume.pdf` to `public/` — it is linked from the navigation, the hero's
**View Resume** button and the contact section. Or point `profile.resume` at an
external URL instead; either way `asset()` in `lib/site.ts` keeps the link correct
under the GitHub Pages base path.

## Deployment

The site is a fully static export (`output: 'export'`), published to **GitHub
Pages** by `.github/workflows/deploy.yml` on every push to `main` or the feature
branch.

Enable it once, in the repository: **Settings → Pages → Build and deployment →
Source: GitHub Actions**. The workflow then builds and deploys on its own.

A Pages *project* site is served from `https://<user>.github.io/<repo>/`, so the
build needs that prefix. CI passes it as `NEXT_PUBLIC_BASE_PATH` (from
`actions/configure-pages`); locally it stays empty and the site runs at the root.
To reproduce the deployed build:

```bash
NEXT_PUBLIC_BASE_PATH=/adarsh_patro_bughunter npm run build   # → ./out
```

Moving to a custom domain later means dropping `NEXT_PUBLIC_BASE_PATH` and
setting `NEXT_PUBLIC_SITE_URL` — no code changes.

## Structure

```
app/
├── layout.tsx           # metadata, JSON-LD, theme + smooth scroll providers
├── page.tsx             # hero + all sections
├── projects/[slug]/     # generated case studies
├── sitemap.ts, robots.ts
│
├── components/
│   ├── hero/            # BugHunterHero, Character, Bug, BugBoss, Arrow, HeroTimeline
│   ├── navigation/      # Navbar, Footer
│   ├── sections/        # About, Skills, Experience, Projects, Contact
│   └── ui/              # Reveal, SectionHeading, ThemeToggle/Provider, SmoothScroll
│
├── hooks/               # useScrollProgress, useReducedMotion, useMediaQuery, useActiveSection
└── lib/                 # animations.ts (easing + variants), content.ts (all copy)
```
