"use client";

import { usePathname } from "next/navigation";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  if (!whatsappNumber || pathname.startsWith("/admin")) {
    return null;
  }

  const message = encodeURIComponent(
    "Assalam-o-Alaikum, mujhe NM Skin Care product ke bare mein maloomat chahiye."
  );

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Contact NM Skin Care on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#1b4d3e] px-5 py-4 text-sm font-semibold text-white shadow-xl transition hover:scale-105"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-[#1b4d3e]">
        ✓
      </span>
      WhatsApp us
    </a>
  );
}