"use client";

import {
  getWhatsAppNumber,
  MERIDIANO_INQUIRY_MAILTO,
  openWhatsAppWithText,
  WHATSAPP_TEXT_BACKPACKER_HELP,
} from "@/utils/whatsapp";

const BTN =
  "inline-flex min-w-[220px] items-center justify-center rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-cream shadow-sm transition hover:bg-[#1d5349] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";

export function FreePlanningWhatsAppButton() {
  function handleClick() {
    const text = WHATSAPP_TEXT_BACKPACKER_HELP;

    if (getWhatsAppNumber()) {
      openWhatsAppWithText(text);
      return;
    }

    window.location.href = `${MERIDIANO_INQUIRY_MAILTO}&body=${encodeURIComponent(text)}`;
  }

  return (
    <div className="mt-10 flex justify-center sm:mt-12">
      <button type="button" onClick={handleClick} className={BTN}>
        Free planning
      </button>
    </div>
  );
}
