import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * TripAdvisor PNGs usually include lots of transparent padding — use a larger
 * cap than Trustpilot so the visible mark reads similar. Trustpilot artwork
 * fills the file more, so it stays on a smaller slot with a slight scale-down.
 */
const TRIPADVISOR_BOX =
  "flex min-h-[7rem] w-[min(100%,280px)] shrink-0 items-center justify-center sm:min-h-[9rem] sm:w-[min(100%,320px)]";

const TRIPADVISOR_IMAGE =
  "max-h-[7rem] w-auto max-w-full object-contain object-center sm:max-h-[9rem]";

const TRUSTPILOT_BOX =
  "flex min-h-[5.75rem] w-[min(100%,280px)] shrink-0 items-center justify-center sm:min-h-[7.5rem] sm:w-[min(100%,320px)]";

const TRUSTPILOT_IMAGE = cn(
  "max-h-[5.75rem] w-auto max-w-full object-contain object-center sm:max-h-[7.5rem]",
  "origin-center scale-[0.64] sm:scale-[0.68]",
);

const LOGO_VARIANT = {
  default: {
    slot: TRIPADVISOR_BOX,
    image: TRIPADVISOR_IMAGE,
  },
  tripadvisor: {
    slot: TRIPADVISOR_BOX,
    image: TRIPADVISOR_IMAGE,
  },
  trustpilot: {
    slot: TRUSTPILOT_BOX,
    image: TRUSTPILOT_IMAGE,
  },
} as const;

type LogoVariant = keyof typeof LOGO_VARIANT;

type ReviewPanelLogoProps = {
  src: string;
  /** Palette / indexed PNGs can fail in Next’s optimizer; pass true to serve the file as-is */
  unoptimized?: boolean;
  /** Merged onto the outer wrapper (e.g. `mb-0` when nothing follows the logo). */
  className?: string;
  /** TripAdvisor: larger cap for padded PNGs. Trustpilot: tighter slot + scale. */
  variant?: LogoVariant;
};

export function ReviewPanelLogo({
  src,
  unoptimized = false,
  className,
  variant = "default",
}: ReviewPanelLogoProps) {
  const v = LOGO_VARIANT[variant];
  return (
    <div className={cn("mb-10 flex justify-center", className)}>
      <div className={v.slot}>
        <Image
          src={src}
          alt=""
          width={320}
          height={120}
          sizes="(max-width:640px) min(92vw,280px), 320px"
          unoptimized={unoptimized}
          className={v.image}
        />
      </div>
    </div>
  );
}
