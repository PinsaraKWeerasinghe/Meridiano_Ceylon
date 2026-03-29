import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-forest to-[#142e29] px-4 py-16 text-cream sm:px-6 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-gold">
          Luxury Sri Lanka Tours
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
          Your island,{" "}
          <span className="text-gold">your rhythm</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-stone-300">
          Tailor-made journeys across hill country, safari, coast, and culture
          — crafted with local expertise and uncompromising care.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#build-your-journey"
            className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold text-forest transition hover:bg-[#c9a066]"
          >
            Build your journey
          </a>
          <Link
            href="/packages"
            className="inline-flex min-w-[200px] items-center justify-center rounded-full border border-stone-400/60 px-8 py-3 text-sm font-semibold text-cream transition hover:border-cream hover:bg-white/5"
          >
            View packages
          </Link>
        </div>
      </div>
    </section>
  );
}
