"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./cart-provider";

const links = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Shop",
    href: "/shop",
  },
  {
    label: "Reviews",
    href: "/#reviews",
    isHashLink: true,
  },
  {
    label: "FAQ",
    href: "/faq",
  },
];

export default function StoreHeader() {
  const pathname = usePathname();

  const isProductPage = pathname.startsWith("/products/");

  const [mobileOpen, setMobileOpen] = useState(false);

  const { itemCount } = useCart();

  function active(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    if (href === "/shop") {
      return (
        pathname === "/shop" ||
        pathname.startsWith("/shop/") ||
        pathname.startsWith("/category/") ||
        pathname.startsWith("/products/")
      );
    }

    if (href === "/faq") {
      return pathname === "/faq";
    }

    return false;
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="nm-header">

      {/* SHIPPING BAR */}
      <div className="nm-shipping-bar">
        <div className="nm-shipping-track">
          <span>FREE SHIPPING ALL OVER PAKISTAN</span>
          <span>FREE SHIPPING ALL OVER PAKISTAN</span>
          <span>FREE SHIPPING ALL OVER PAKISTAN</span>
          <span>FREE SHIPPING ALL OVER PAKISTAN</span>
        </div>
      </div>


      <nav className="nm-nav nm-wrap">

        {/* LOGO */}
        <Link
          href="/"
          className="orinoca-brand"
          onClick={closeMobileMenu}
          aria-label="ORINOCA NATURAL Home"
        >
          <Image
            src="/orinoca-logo.jpg"
            alt="ORINOCA NATURAL"
            width={900}
            height={350}
            priority
            className="orinoca-header-logo"
          />
        </Link>


        {/* DESKTOP NAV */}
        <div className="nm-nav-links">

          {(isProductPage
            ? [
              {
                label: "Shop",
                href: "/shop",
              },
              {
                label: "Benefits",
                href: "#benefits",
              },
              {
                label: "Ingredients",
                href: "#ingredients",
              },
              {
                label: "How To Use",
                href: "#how-to-use",
              },
              {
                label: "Our Story",
                href: "#our-story",
              },
            ]
            : links
          ).map((link) => {

            if (link.href.startsWith("#")) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                >
                  {link.label}
                </a>
              );
            }

            return (
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
            );

          })}

        </div>



        {/* RIGHT ACTIONS */}
        <div className="nm-nav-cta">

          <Link
            href="/cart"
            className="nm-cart-icon"
            aria-label={`Cart with ${itemCount} ${itemCount === 1 ? "item" : "items"
              }`}
            onClick={closeMobileMenu}
          >

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >

              <circle cx="9" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L21 7H6" />

            </svg>


            {itemCount > 0 && (
              <span className="nm-cart-count">
                {itemCount}
              </span>
            )}

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
            aria-label={
              mobileOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={mobileOpen}
            onClick={() =>
              setMobileOpen(
                (current) => !current
              )
            }
          >

            {mobileOpen ? (

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>

            ) : (

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>

            )}

          </button>


        </div>


      </nav>




      {/* MOBILE MENU */}

      {mobileOpen && (

        <div className="nm-mobile-menu">

          {links.map((link) => (

            link.isHashLink ? (

              <a
                key={link.label}
                href={link.href}
                onClick={closeMobileMenu}
              >
                {link.label}
              </a>

            ) : (

              <Link
                key={link.label}
                href={link.href}
                className={
                  active(link.href)
                    ? "nm-active"
                    : ""
                }
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>

            )

          ))}


          <Link
            href="/shop"
            className="nm-btn nm-btn-primary"
            onClick={closeMobileMenu}
          >
            Shop Now
          </Link>


        </div>

      )}


    </header>
  );
}