import Link from "next/link";
import { heroSlides } from "@/data/hero-slides";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";

export function Hero() {
  return (
    <section className="relative -mt-[var(--navbar-h)] overflow-hidden bg-forest px-4 pb-16 pt-[calc(var(--navbar-h)+4rem)] text-cream sm:px-6 sm:pb-24 sm:pt-[calc(var(--navbar-h)+6rem)]">
      <HeroSlideshow slides={heroSlides} intervalMs={6500} />
      <div
        className="absolute inset-0 z-[2] bg-gradient-to-b from-forest/88 via-forest/78 to-[#0d2420]/92"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
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
