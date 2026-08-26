import Link from 'next/link';
import { navSections, profile } from '@/lib/content';

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="container flex flex-col items-center justify-between gap-6 text-sm text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with Next.js, GSAP and Framer Motion.
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {navSections.map((section) => (
            <li key={section.id}>
              <Link href={`/#${section.id}`} className="transition-colors hover:text-accent">
                {section.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
