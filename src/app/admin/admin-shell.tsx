"use client";

import Link from "next/link";
import {
  ReactNode,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";

import LogoutButton from "./logout-button";

type AdminShellProps = {
  children: ReactNode;
  adminEmail?: string;
};

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </svg>
    ),
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
        <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
      </svg>
    ),
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="M6 8h12l1 13H5L6 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </svg>
    ),
  },
  {
    label: "Promo Codes",
    href: "/admin/promos",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="M20 13 13 20a2 2 0 0 1-3 0l-6-6a2 2 0 0 1 0-3l7-7h7a2 2 0 0 1 2 2v7Z" />
        <circle cx="15.5" cy="8.5" r="1" />
      </svg>
    ),
  },
];

export default function AdminShell({
  children,
  adminEmail,
}: AdminShellProps) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow =
      mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  }

  const Navigation = () => (
    <nav className="space-y-1.5">
      {navItems.map((item) => {
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all ${
              active
                ? "bg-[#d4af37]/16 font-semibold text-[#f5e5af] ring-1 ring-[#d4af37]/35"
                : "text-white/70 hover:bg-white/8 hover:text-white"
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                active
                  ? "bg-[#d4af37] text-[#073c31]"
                  : "bg-white/7 text-white/65 group-hover:bg-white/12 group-hover:text-white"
              }`}
            >
              <span className="h-[18px] w-[18px]">
                {item.icon}
              </span>
            </span>

            <span>{item.label}</span>

            {active ? (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#123529]">
      {/* FIXED DESKTOP SIDEBAR */}

      <aside className="fixed bottom-0 left-0 top-0 z-50 hidden h-[100dvh] w-[270px] flex-col overflow-hidden bg-[#073c31] text-white lg:flex">
        <div className="pointer-events-none absolute left-[-130px] top-[-110px] h-72 w-72 rounded-full bg-[#d4af37]/5 blur-3xl" />

        {/* HEADER */}

        <div className="relative shrink-0 px-5 pt-5">
          <div className="border-b border-white/10 pb-5">
            <Link href="/admin" className="inline-block">
              <p className="text-[28px] font-semibold leading-none tracking-wide text-[#f0d79b]">
                ORINOCA
              </p>

              <p className="mt-2 text-[10px] uppercase tracking-[0.32em] text-white/60">
                NATURAL
              </p>
            </Link>

            <div className="mt-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#d4af37]">
                Admin Workspace
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}

        <div className="relative min-h-0 flex-1 overflow-y-auto px-5 py-5 [scrollbar-width:thin]">
          <p className="mb-3 px-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/30">
            Management
          </p>

          <Navigation />
        </div>

        {/* FOOTER */}

        <div className="relative shrink-0 border-t border-white/10 bg-[#073c31] px-5 pb-5 pt-4">
          <div className="space-y-2.5">
            <div className="rounded-[16px] border border-[#d4af37]/16 bg-[#d4af37]/7 px-4 py-3">
              <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
                Product
              </p>

              <p className="mt-1.5 text-[15px] font-semibold leading-tight text-white">
                ORINOCA NATURAL
              </p>

              <p className="mt-1 text-[10px] leading-4 text-white/40">
                Premium skincare management
              </p>
            </div>

            <Link
              href="/"
              target="_blank"
              className="flex h-[44px] items-center justify-between rounded-2xl border border-white/20 bg-white/[0.035] px-4 text-sm font-medium text-white/85 transition hover:border-[#d4af37]/40 hover:bg-white/8 hover:text-white"
            >
              <span>View Store</span>

              <span className="text-[#d4af37]">
                ↗
              </span>
            </Link>

            {adminEmail ? (
              <div className="rounded-2xl bg-white/5 px-4 py-2.5">
                <p className="text-xs font-semibold text-white/80">
                  ORINOCA Admin
                </p>

                <p className="mt-1 truncate text-[10px] text-white/35">
                  {adminEmail}
                </p>
              </div>
            ) : null}

            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <div className="min-h-screen min-w-0 lg:ml-[270px]">
        {/* MOBILE HEADER */}

        <header className="sticky top-0 z-40 flex h-[68px] items-center justify-between border-b border-[#123529]/10 bg-[#faf8f2]/95 px-4 backdrop-blur-xl sm:px-5 lg:hidden">
          <Link href="/admin">
            <p className="text-xl font-semibold leading-none text-[#123529]">
              ORINOCA
            </p>

            <p className="mt-1 text-[8px] uppercase tracking-[0.28em] text-[#8a9a86]">
              Admin
            </p>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden rounded-xl border border-[#123529]/12 bg-white px-3 py-2 text-[11px] font-semibold sm:block"
            >
              View Store ↗
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open admin navigation"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#073c31] text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </header>

        {children}
      </div>

      {/* MOBILE OVERLAY */}

      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-[80] bg-[#061e19]/55 backdrop-blur-[3px] transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* MOBILE DRAWER */}

      <aside
        className={`fixed bottom-0 right-0 top-0 z-[90] flex w-[min(88vw,350px)] flex-col overflow-hidden bg-[#073c31] text-white shadow-[-20px_0_60px_rgba(0,0,0,0.22)] transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="shrink-0 px-5 pt-5">
          <div className="flex items-start justify-between border-b border-white/10 pb-5">
            <div>
              <p className="text-2xl font-semibold text-[#f0d79b]">
                ORINOCA
              </p>

              <p className="mt-1 text-[9px] uppercase tracking-[0.28em] text-white/55">
                NATURAL
              </p>

              <p className="mt-3 text-[9px] uppercase tracking-[0.2em] text-[#d4af37]">
                Admin Workspace
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <Navigation />
        </div>

        <div className="shrink-0 border-t border-white/10 bg-[#073c31] p-5">
          <div className="space-y-3">
            <div className="rounded-[16px] bg-[#d4af37]/8 p-4">
              <p className="text-[9px] uppercase tracking-[0.16em] text-[#d4af37]">
                Product
              </p>

              <p className="mt-2 text-lg font-semibold">
                ORINOCA NATURAL
              </p>
            </div>

            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between rounded-2xl border border-white/12 px-4 py-3 text-sm text-white/75"
            >
              <span>View Store</span>
              <span>↗</span>
            </Link>

            <LogoutButton />
          </div>
        </div>
      </aside>
    </main>
  );
}