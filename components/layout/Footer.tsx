import Image from "next/image";
import Link from "next/link";
import { LOGO_ALT, LOGO_SRC } from "@/lib/branding";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-gold text-cream">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link href="/" className="inline-flex">
              <Image
                src={LOGO_SRC}
                alt={LOGO_ALT}
                width={200}
                height={56}
                className="h-10 w-auto max-w-[200px] object-contain object-left brightness-0 invert"
              />
            </Link>
            <p className="mt-2 max-w-sm text-sm text-cream/85">
              Tailor-made Sri Lankan journeys with local expertise and premium
              care.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-goldMint/90">
              Trust
            </p>
            <ul className="mt-3 space-y-2 text-sm text-cream/90">
              <li>
                SLTDA license:{" "}
                <span className="text-cream/50">[Your license number]</span>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-goldMint underline-offset-4 transition hover:text-cream hover:underline"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/care"
                  className="text-goldMint underline-offset-4 transition hover:text-cream hover:underline"
                >
                  Meridiano Care Promise
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-goldMint/90">
              Explore
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/packages"
                  className="text-cream/90 transition hover:text-cream hover:underline"
                >
                  Packages &amp; tours
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="text-cream/90 transition hover:text-cream hover:underline"
                >
                  Guest reviews
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-cream/60">
          © {new Date().getFullYear()} Meridiano Ceylon. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
