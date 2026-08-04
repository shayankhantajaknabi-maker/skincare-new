"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./cart-provider";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Product", href: "/shop" },
  { label: "Reviews", href: "/#reviews" },
  { label: "FAQ", href: "/faq" },
];

export default function StoreHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items } = useCart();

  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href === "/shop") {
      return pathname === "/shop" || pathname.startsWith("/products/");
    }
    return false;
  }

  return (
    <header className="nm-header">
      <nav className="nm-nav">
        <Link
          href="/"
          className="nm-logo"
          onClick={() => setMobileOpen(false)}
        >
          NM <span>Skin Care</span>
        </Link>

        <div className="nm-nav-links">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={isActive(link.href) ? "nm-active" : ""}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nm-nav-cta">
          <Link href="/cart" className="nm-cart-icon" aria-label="Open cart">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L21 7H6" />
            </svg>

            {cartCount > 0 ? (
              <span className="nm-cart-count">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            ) : null}
          </Link>

          <Link href="/shop" className="nm-btn nm-btn-primary">
            View Product
          </Link>

          <button
            type="button"
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#1b4d3e]/20 bg-transparent lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4 text-[#123529]"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="border-t border-[#1b4d3e]/10 bg-[#fafafa] px-5 py-4 lg:hidden">
          <div className="mx-auto grid max-w-[1180px] gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm text-[#123529] hover:bg-[#f5f2eb]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}