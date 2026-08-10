"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
        <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
      </svg>
    ),
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M6 8h12l1 13H5L6 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </svg>
    ),
  },
  {
    label: "Promo Codes",
    href: "/admin/promos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
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

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

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
            className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm transition-all ${
              active
                ? "bg-[#d4af37]/16 font-semibold text-[#f5e5af] ring-1 ring-[#d4af37]/35"
                : "text-white/68 hover:bg-white/8 hover:text-white"
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
      <div className="flex min-h-screen">
        {/* DESKTOP SIDEBAR */}
        <aside className="sticky top-0 hidden h-screen w-[270px] shrink-0 flex-col overflow-hidden bg-[#073c31] px-5 py-7 text-white lg:flex">
          {/* subtle decorative glow */}
          <div className="pointer-events-none absolute left-[-130px] top-[-110px] h-72 w-72 rounded-full bg-[#d4af37]/5 blur-3xl" />

          <div className="relative border-b border-white/10 pb-7">
            <Link href="/admin" className="inline-block">
              <p className="font-serif text-[28px] font-semibold leading-none tracking-wide text-[#f0d79b]">
                    ORINOCA
              </p>

              <p className="mt-2 text-[10px] uppercase tracking-[0.32em] text-white/60">
                NATURAL
              </p>
            </Link>

            <div className="mt-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#d4af37]">
                Admin Workspace
              </p>
            </div>
          </div>

          <div className="relative mt-7">
            <p className="mb-3 px-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/30">
              Management
            </p>

            <Navigation />
          </div>

          <div className="relative mt-auto space-y-3 border-t border-white/10 pt-6">
            <div className="rounded-[18px] border border-[#d4af37]/15 bg-[#d4af37]/7 p-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
                Product
              </p>

              <p className="mt-2 font-serif text-lg font-semibold text-white">
                ORINOCA NATURAL
              </p>

              <p className="mt-1 text-[11px] leading-5 text-white/40">
                Premium skincare management
              </p>
            </div>

            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between rounded-2xl border border-white/12 px-4 py-3 text-sm text-white/65 transition hover:bg-white/8 hover:text-white"
            >
              <span>View Store</span>
              <span>↗</span>
            </Link>

            {adminEmail ? (
              <div className="rounded-2xl bg-white/5 px-4 py-3">
                <p className="text-xs font-semibold text-white/80">
                  NM Admin
                </p>

                <p className="mt-1 truncate text-[10px] text-white/35">
                  {adminEmail}
                </p>
              </div>
            ) : null}

            <LogoutButton />
          </div>
        </aside>

        {/* MAIN AREA */}
        <div className="min-w-0 flex-1">
          {/* MOBILE HEADER */}
          <header className="sticky top-0 z-40 flex h-[68px] items-center justify-between border-b border-[#123529]/10 bg-[#faf8f2]/95 px-4 backdrop-blur-xl sm:px-5 lg:hidden">
            <Link href="/admin">
              <p className="font-serif text-xl font-semibold leading-none text-[#123529]">
                NM
              </p>

              <p className="mt-1 text-[8px] uppercase tracking-[0.28em] text-[#8a9a86]">
                Skin Care Admin
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
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#073c31] text-white shadow-lg shadow-[#073c31]/10"
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
        className={`fixed bottom-0 right-0 top-0 z-[90] flex w-[min(88vw,350px)] flex-col bg-[#073c31] p-5 text-white shadow-[-20px_0_60px_rgba(0,0,0,0.22)] transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between border-b border-white/10 pb-5">
          <div>
            <p className="font-serif text-2xl font-semibold text-[#f0d79b]">
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

        <div className="mt-6">
          <Navigation />
        </div>

        <div className="mt-auto space-y-3 border-t border-white/10 pt-5">
          <div className="rounded-[18px] bg-[#d4af37]/8 p-4">
            <p className="text-[9px] uppercase tracking-[0.16em] text-[#d4af37]">
              Featured
            </p>

            <p className="mt-2 font-serif text-xl font-semibold">
              ORINOCA NATURAL
            </p>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-2xl border border-white/12 px-4 py-3 text-sm text-white/70"
          >
            <span>View Store</span>
            <span>↗</span>
          </Link>

          <LogoutButton />
        </div>
      </aside>
    </main>
  );
}