import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container flex min-h-[70svh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        404
      </p>
      <h1 className="section-heading mt-6">This bug got away.</h1>
      <p className="mt-4 max-w-md text-muted">
        The page you were looking for does not exist — or it was already patched.
      </p>
      <Link href="/" className="btn-primary mt-9">
        Back to the hunt
      </Link>
    </section>
  );
}
