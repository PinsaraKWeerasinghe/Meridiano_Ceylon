"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";
import { ReviewPanelLogo } from "@/components/home/ReviewPanelLogo";
import { homeReviewPanelClass } from "@/lib/home-review-panels";

declare global {
  interface Window {
    Trustpilot?: {
      loadFromElement?: (element: HTMLElement, forceReload?: boolean) => void;
    };
  }
}

const BOOTSTRAP =
  "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";

/** Default: TrustBox Carousel — override with `NEXT_PUBLIC_TRUSTPILOT_TEMPLATE_ID` if your embed uses another template. */
const DEFAULT_TEMPLATE_ID = "54ad501d-baf0-4835-afd4-067b32f7f831";

const TRUSTPILOT_LOGO_SRC = "/SiteInfo/Trustpilot_Logo.svg.png";

function TrustpilotLogoTop({ className }: { className?: string }) {
  return (
    <ReviewPanelLogo
      src={TRUSTPILOT_LOGO_SRC}
      unoptimized
      variant="trustpilot"
      className={className}
    />
  );
}

export function TrustPilotTrustBox() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const businessUnitId =
    process.env.NEXT_PUBLIC_TRUSTPILOT_BUSINESS_UNIT_ID ?? "";
  const templateId =
    process.env.NEXT_PUBLIC_TRUSTPILOT_TEMPLATE_ID ?? DEFAULT_TEMPLATE_ID;
  const locale = process.env.NEXT_PUBLIC_TRUSTPILOT_LOCALE ?? "en-US";
  const reviewPageUrlEnv = process.env.NEXT_PUBLIC_TRUSTPILOT_REVIEW_PAGE_URL;
  const reviewPageUrl = reviewPageUrlEnv?.trim() ?? "";
  const styleHeight =
    process.env.NEXT_PUBLIC_TRUSTPILOT_STYLE_HEIGHT ?? "260px";
  const styleWidth = process.env.NEXT_PUBLIC_TRUSTPILOT_STYLE_WIDTH ?? "100%";
  const theme =
    process.env.NEXT_PUBLIC_TRUSTPILOT_THEME === "dark" ? "dark" : "light";

  const configured = Boolean(businessUnitId.trim());

  const loadWidget = useCallback(() => {
    const el = widgetRef.current;
    if (!el || !configured) return;
    window.Trustpilot?.loadFromElement?.(el, true);
  }, [configured]);

  useEffect(() => {
    loadWidget();
  }, [loadWidget]);

  if (!configured) {
    return (
      <div className={homeReviewPanelClass}>
        <TrustpilotLogoTop className="mb-0" />
      </div>
    );
  }

  const fallbackHref = reviewPageUrl || "https://www.trustpilot.com";

  return (
    <div className="min-w-0">
      <Script src={BOOTSTRAP} strategy="lazyOnload" onLoad={loadWidget} />

      <div className={homeReviewPanelClass}>
        <TrustpilotLogoTop />

        <div
          ref={widgetRef}
          className="trustpilot-widget w-full [&_.tp-widget-wrapper]:rounded-lg"
          data-locale={locale}
          data-template-id={templateId}
          data-businessunit-id={businessUnitId}
          data-theme={theme}
          data-style-height={styleHeight}
          data-style-width={styleWidth}
        >
          <a
            href={fallbackHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone-600 underline-offset-4 hover:text-lagoon hover:underline"
          >
            Trustpilot
          </a>
        </div>
      </div>
    </div>
  );
}
