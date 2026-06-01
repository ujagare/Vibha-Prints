import React from "react";
import {
  MessageCircle as FaWhatsapp,
} from "lucide-react";

const PHONE_NUMBER = "918624948046";
const BASE_TEXT =
  "Hello! I'm contacting you from your website. I want to place an order.";

const buildWhatsAppUrl = (message) =>
  `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;

const WhatsAppOrderWidget = () => {
  return (
    <>
      <div className="group fixed bottom-6 left-6 z-[70] flex flex-col items-start gap-2">
        <span className="pointer-events-none rounded-full bg-black px-3 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
          Order on WhatsApp
        </span>
        <a
          href={buildWhatsAppUrl(BASE_TEXT)}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition hover:scale-110 hover:bg-[#128C7E]"
          aria-label="Order on WhatsApp"
        >
          <FaWhatsapp size={28} />
        </a>
      </div>
    </>
  );
};

export default WhatsAppOrderWidget;
