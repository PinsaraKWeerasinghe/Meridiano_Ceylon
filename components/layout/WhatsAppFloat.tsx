"use client";

import { MessageCircle } from "lucide-react";
import { getWhatsAppNumber } from "@/utils/whatsapp";

const defaultPrefill =
  "Hi Meridiano Ceylon — I'd like to plan a luxury tour. Can you help?";

export function WhatsAppFloat() {
  const num = getWhatsAppNumber();
  if (!num) return null;

  const href = `https://wa.me/${num}?text=${encodeURIComponent(defaultPrefill)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-stone-900/20 transition hover:scale-105 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
      aria-label="Chat on WhatsApp"
      title="WhatsApp us"
    >
      <MessageCircle className="h-7 w-7" strokeWidth={2} />
    </a>
  );
}
