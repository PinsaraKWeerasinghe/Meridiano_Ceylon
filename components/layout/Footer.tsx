import Image from "next/image";
import Link from "next/link";
import { LOGO_ALT, LOGO_SRC } from "@/lib/branding";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link href="/" className="inline-flex">
              <Image
                src={LOGO_SRC}
                alt={LOGO_ALT}
                width={200}
                height={56}
                className="h-10 w-auto max-w-[200px] object-contain object-left"
              />
            </Link>
            <p className="mt-2 max-w-sm text-sm text-stone-600">
              Tailor-made Sri Lankan journeys with local expertise and premium
              care.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Trust
            </p>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              <li>
                SLTDA license:{" "}
                <span className="text-stone-400">[Your license number]</span>
              </li>
              <li>
                <Link href="/terms" className="text-forest underline-offset-4 hover:underline">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/care" className="text-forest underline-offset-4 hover:underline">
                  Meridiano Care Promise
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Explore
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/packages" className="text-stone-600 hover:text-forest">
                  Packages &amp; tours
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-stone-600 hover:text-forest">
                  Guest reviews
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} Meridiano Ceylon. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
