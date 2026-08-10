import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./cart-provider";
import FloatingWhatsApp from "./floating-whatsapp";

export const metadata: Metadata = {
  title: "ORINOCA NATURAL",
  description: "Pure and natural skin care products in Pakistan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}