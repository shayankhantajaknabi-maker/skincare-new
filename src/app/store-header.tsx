"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./cart-provider";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Product", href: "/shop#products" },
  { label: "Reviews", href: "/#reviews" },
  { label: "FAQ", href: "/#faq" },
];

export default function StoreHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();

  function active(href: string) {
    if (href === "/") return pathname === "/";

    if (href === "/shop") {
      return (
        pathname === "/shop" ||
        pathname.startsWith("/products/")
      );
    }

    return false;
  }

  return (
    <header className="nm-header">
      <nav className="nm-nav nm-wrap">
        <Link
          href="/"
          className="nm-logo"
          onClick={() => setMobileOpen(false)}
        >
          <span className="nm-logo-main">
            ORINOCA
          </span>

          <span className="nm-logo-sub">
            NATURAL
          </span>
        </Link>

        <div className="nm-nav-links">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={
                active(link.href)
                  ? "nm-active"
                  : ""
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nm-nav-cta">
          <Link
            href="/cart"
            className="nm-cart-icon"
            aria-label="Cart"
          >
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

            <span className="nm-cart-count">
              {itemCount}
            </span>
          </Link>

          <Link
            href="/shop"
            className="nm-btn nm-btn-primary nm-desktop-shop"
          >
            Shop Now
          </Link>

          <button
            type="button"
            className="nm-burger"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() =>
              setMobileOpen(
                (value) => !value
              )
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="nm-mobile-menu">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() =>
                setMobileOpen(false)
              }
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/shop"
            className="nm-btn nm-btn-primary"
            onClick={() =>
              setMobileOpen(false)
            }
          >
            Shop Now
          </Link>
        </div>
      ) : null}
    </header>
  );
}