import Image from "next/image";

/**
 * Same outer box for Trustpilot and TripAdvisor — each logo scales inside
 * with object-contain (no differing widths from aspect ratio alone).
 */
const LOGO_BOX =
  "relative h-20 w-[min(100%,280px)] shrink-0 sm:h-28 sm:w-[min(100%,320px)]";

type ReviewPanelLogoProps = {
  src: string;
  /** Palette / indexed PNGs can fail in Next’s optimizer; pass true to serve the file as-is */
  unoptimized?: boolean;
};

export function ReviewPanelLogo({
  src,
  unoptimized = false,
}: ReviewPanelLogoProps) {
  return (
    <div className="mb-10 flex justify-center">
      <div className={LOGO_BOX}>
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width:640px) min(92vw,280px), 320px"
          unoptimized={unoptimized}
          className="object-contain object-center"
        />
      </div>
    </div>
  );
}
