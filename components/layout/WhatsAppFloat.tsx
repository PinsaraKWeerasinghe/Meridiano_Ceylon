"use client";

import Image from "next/image";
import { getWhatsAppNumber, MERIDIANO_INQUIRY_MAILTO } from "@/utils/whatsapp";

const WHATSAPP_LOGO = "/SiteInfo/whatsapp-logo.png";

const defaultPrefill =
  "Hi Meridiano Ceylon — I'd like to plan a luxury tour. Can you help?";

export function WhatsAppFloat() {
  const num = getWhatsAppNumber();
  const href = num
    ? `https://wa.me/${num}?text=${encodeURIComponent(defaultPrefill)}`
    : MERIDIANO_INQUIRY_MAILTO;
  const isWhatsApp = Boolean(num);

  return (
    <a
      href={href}
      target={isWhatsApp ? "_blank" : undefined}
      rel={isWhatsApp ? "noopener noreferrer" : undefined}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-transparent p-0 transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest md:z-50"
      aria-label={
        isWhatsApp
          ? "Chat on WhatsApp"
          : "Email Meridiano Ceylon (set NEXT_PUBLIC_WHATSAPP_NUMBER for WhatsApp)"
      }
      title={
        isWhatsApp
          ? "WhatsApp us"
          : "WhatsApp number not set — opens email. Add NEXT_PUBLIC_WHATSAPP_NUMBER to .env.local"
      }
    >
      <Image
        src={WHATSAPP_LOGO}
        alt=""
        width={56}
        height={56}
        className="h-14 w-14 object-contain object-center drop-shadow-lg"
        sizes="56px"
      />
    </a>
  );
}
