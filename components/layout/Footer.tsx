import Image from "next/image";
import Link from "next/link";
import { LOGO_ALT, LOGO_SRC } from "@/lib/branding";
import { DEVELOPER_SITE_HREF, SITE_VERSION_LABEL } from "@/lib/site-meta";

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
              {/* SLTDA license — add real number later
              <li>
                SLTDA license:{" "}
                <span className="text-cream/50">[Your license number]</span>
              </li>
              */}
              <li>
                <Link
                  href="/legal/terms"
                  className="text-goldMint underline-offset-4 transition hover:text-cream hover:underline"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-goldMint underline-offset-4 transition hover:text-cream hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/refund"
                  className="text-goldMint underline-offset-4 transition hover:text-cream hover:underline"
                >
                  Refund Policy
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
                  href="/digital-buddy"
                  className="text-cream/90 transition hover:text-cream hover:underline"
                >
                  Digital Buddy (backpackers)
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-cream/90 transition hover:text-cream hover:underline"
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center gap-2 border-t border-cream/15 pt-5 text-center">
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 whitespace-nowrap text-[11px] tracking-wide text-cream/65 sm:text-xs">
            <span>
              © {new Date().getFullYear()} Meridiano Ceylon. All rights reserved.
            </span>
            <span aria-hidden className="text-cream/40">·</span>
            <span>
              Powered by{" "}
              <a
                href={DEVELOPER_SITE_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-goldMint underline-offset-2 transition hover:text-cream hover:underline"
              >
                pinsara.com
              </a>
            </span>
          </p>
          <span className="rounded-full border border-cream/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cream/70">
            {SITE_VERSION_LABEL}
          </span>
        </div>
      </div>
    </footer>
  );
}
