/** Home hero backgrounds — every image in `public/images/hero/`, paths from site root `/`. */
export const heroSlides = [
  ...Array.from({ length: 23 }, (_, i) => ({
    src: `/images/hero/image_${i + 1}.jpg`,
    alt: "Sri Lanka travel",
  })),
] as const;
