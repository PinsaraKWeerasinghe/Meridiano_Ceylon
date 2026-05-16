import Image from "next/image";

/** Files live in `public/SocialMediaLogs/` (social + review badges for the homepage strip). */
const SOCIAL_MEDIA_ASSETS = "/SocialMediaLogs";

const TRUSTPILOT_LOGO = `${SOCIAL_MEDIA_ASSETS}/Trustpilot_Logo.svg.png`;
const TRIPADVISOR_LOGO = `${SOCIAL_MEDIA_ASSETS}/TripAdvisor_Logo.svg.png`;

function trustpilotHref(): string {
  const fromEnv = process.env.NEXT_PUBLIC_TRUSTPILOT_REVIEW_PAGE_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : "https://www.trustpilot.com";
}

function tripAdvisorHref(): string {
  const fromEnv = process.env.NEXT_PUBLIC_TRIPADVISOR_LISTING_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : "https://www.tripadvisor.com";
}

const REVIEW_PLATFORM_LINKS = [
  {
    href: trustpilotHref(),
    label: "Meridiano Ceylon on Trustpilot",
    src: TRUSTPILOT_LOGO,
    unoptimized: true as const,
    imageClassName:
      "h-12 max-h-12 w-auto max-w-[9.5rem] object-contain sm:h-14 sm:max-h-14 sm:max-w-[11rem]",
  },
  {
    href: tripAdvisorHref(),
    label: "Meridiano Ceylon on TripAdvisor",
    src: TRIPADVISOR_LOGO,
    unoptimized: true as const,
    imageClassName:
      "h-12 max-h-12 w-auto max-w-[10.5rem] object-contain sm:h-14 sm:max-h-14 sm:max-w-[12rem]",
  },
] as const;

const LINKS = [
  {
    href: "https://www.facebook.com/share/1GUFfQ5r1p/?mibextid=wwXIfr",
    label: "Meridiano Ceylon on Facebook",
    src: `${SOCIAL_MEDIA_ASSETS}/facebook-logo-facebook-icon-transparent-free-png.webp`,
  },
  {
    href: "https://www.tiktok.com/@meridiano.ceylon?_r=1&_t=ZS-96LfTGNZqHF",
    label: "Meridiano Ceylon on TikTok",
    src: `${SOCIAL_MEDIA_ASSETS}/tiktok-logo-tikok-icon-transparent-tikok-app-logo-free-png.webp`,
  },
  {
    href: "https://www.instagram.com/meridiano_ceylon?igsh=MW1mOHB0dDNjdTl4bQ==",
    label: "Meridiano Ceylon on Instagram",
    src: `${SOCIAL_MEDIA_ASSETS}/instagram-logo-instagram-icon-transparent-free-png.webp`,
  },
] as const;

export function HomeSocialLinks() {
  return (
    <section
      className="border-t border-lagoon/15 bg-lagoon/10 px-4 py-10 sm:px-6"
      aria-label="Social media"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3">
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-forest/80">
          Follow Meridiano Ceylon
        </p>
        <div className="flex w-full flex-col items-center gap-5">
          <ul
            className="flex flex-wrap items-center justify-center gap-5"
            aria-label="Review platforms"
          >
            {REVIEW_PLATFORM_LINKS.map(
              ({ href, label, src, unoptimized, imageClassName }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex items-center justify-center p-1.5 transition hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-lagoon/50 focus-visible:ring-offset-2"
                  >
                    <Image
                      src={src}
                      alt=""
                      width={176}
                      height={56}
                      unoptimized={unoptimized}
                      className={imageClassName}
                    />
                  </a>
                </li>
              ),
            )}
          </ul>
          <ul
            className="flex flex-wrap items-center justify-center gap-5"
            aria-label="Social networks"
          >
            {LINKS.map(({ href, label, src }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex items-center justify-center p-1.5 transition hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-lagoon/50 focus-visible:ring-offset-2"
                >
                  <Image
                    src={src}
                    alt=""
                    width={72}
                    height={72}
                    className="h-[4.5rem] w-[4.5rem] object-contain sm:h-20 sm:w-20"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
