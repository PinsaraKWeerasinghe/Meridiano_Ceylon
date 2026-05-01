/** Home hero backgrounds — paths must match files under `public/`. */

export type HeroSlide = {
  src: string;
  alt: string;
  /** When true, headline / CTAs and dimming gradient are hidden for this slide only. */
  hideOverlay?: boolean;
  /** `logo` fills with padding and contain; photos use cover. Default `photo`. */
  fit?: "photo" | "logo";
};

export const heroSlides: readonly HeroSlide[] = [
  {
    src: "/SiteInfo/meridiano_logo.png",
    alt: "Meridiano Ceylon",
    hideOverlay: true,
    fit: "logo",
  },
  { src: "/images/hero/1.jpg", alt: "Sri Lanka travel" },
  { src: "/images/hero/2.jpg", alt: "Sri Lanka travel" },
  { src: "/images/hero/3.jpg", alt: "Sri Lanka travel" },
  { src: "/images/hero/4.jpg", alt: "Sri Lanka travel" },
  { src: "/images/hero/5.jpg", alt: "Sri Lanka travel" },
  { src: "/images/hero/6.jpg", alt: "Sri Lanka travel" },
  { src: "/images/hero/7.jpg", alt: "Sri Lanka travel" },
  { src: "/images/hero/8.jpg", alt: "Sri Lanka travel" },
  { src: "/images/hero/9.jpg", alt: "Sri Lanka travel" },
  { src: "/images/hero/10.jpg", alt: "Sri Lanka travel" },
  { src: "/images/hero/11.jpg", alt: "Sri Lanka travel" },
  { src: "/images/hero/12.jpg", alt: "Sri Lanka travel" },
  { src: "/images/hero/13.jpg", alt: "Sri Lanka travel" },
  { src: "/images/hero/14.jpg", alt: "Sri Lanka travel" },
  { src: "/images/hero/15.jpg", alt: "Sri Lanka travel" },
  { src: "/images/hero/16.jpg", alt: "Sri Lanka travel" },
];
