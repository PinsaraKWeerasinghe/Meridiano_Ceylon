import Link from "next/link";
import { heroSlides } from "@/data/hero-slides";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";

export function Hero() {
  return (
    <section className="relative -mt-[var(--navbar-h)] overflow-hidden bg-forest px-4 pb-16 pt-[calc(var(--navbar-h)+4rem)] text-cream sm:px-6 sm:pb-24 sm:pt-[calc(var(--navbar-h)+6rem)]">
      <HeroSlideshow slides={heroSlides} intervalMs={6500} />
      <div
        className="absolute inset-0 z-[2] bg-gradient-to-b from-black/45 via-black/38 to-black/50"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-goldMint">
          Luxury Sri Lanka Tours
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
          Your island,{" "}
          <span className="text-goldMint">your rhythm</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-stone-300">
          Tailor-made journeys across hill country, safari, coast, and culture
          — crafted with local expertise and uncompromising care.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#build-your-journey"
            className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold text-cream transition hover:bg-[#1d5349]"
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
