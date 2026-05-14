import Image from "next/image";

const LINKS = [
  {
    href: "https://www.facebook.com/share/1GUFfQ5r1p/?mibextid=wwXIfr",
    label: "Meridiano Ceylon on Facebook",
    src: "/SocialMediaLogs/facebook-logo-facebook-icon-transparent-free-png.webp",
  },
  {
    href: "https://www.tiktok.com/@meridiano.ceylon?_r=1&_t=ZS-96LfTGNZqHF",
    label: "Meridiano Ceylon on TikTok",
    src: "/SocialMediaLogs/tiktok-logo-tikok-icon-transparent-tikok-app-logo-free-png.webp",
  },
  {
    href: "https://www.instagram.com/meridiano_ceylon?igsh=MW1mOHB0dDNjdTl4bQ==",
    label: "Meridiano Ceylon on Instagram",
    src: "/SocialMediaLogs/instagram-logo-instagram-icon-transparent-free-png.webp",
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
        <ul className="flex flex-wrap items-center justify-center gap-5">
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
    </section>
  );
}
