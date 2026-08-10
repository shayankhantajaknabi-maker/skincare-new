"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to sign in"
        );
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f4ed] text-[#123529]">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        {/* LEFT BRAND PANEL */}
        <section className="relative hidden min-h-screen overflow-hidden bg-[#073c31] px-10 py-10 text-white lg:flex lg:flex-col xl:px-14 xl:py-12">
          {/* decorative background */}
          <div className="pointer-events-none absolute -left-40 -top-36 h-[450px] w-[450px] rounded-full border border-[#d4af37]/10" />
          <div className="pointer-events-none absolute -left-24 -top-20 h-[330px] w-[330px] rounded-full border border-[#d4af37]/10" />

          <div className="pointer-events-none absolute -bottom-44 -right-32 h-[500px] w-[500px] rounded-full border border-white/5" />

          <div className="pointer-events-none absolute right-[10%] top-[22%] h-48 w-48 rounded-full bg-[#d4af37]/5 blur-3xl" />

          {/* LOGO */}
          <div className="relative z-10">
            <p className="font-serif text-[42px] font-semibold leading-none tracking-wide text-[#f1d898]">
              NM
            </p>

            <p className="mt-2 text-[10px] uppercase tracking-[0.42em] text-white/60">
              Skin Care
            </p>

            <div className="mt-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[#d4af37]">
                Admin Workspace
              </span>
            </div>
          </div>

          {/* CENTER CONTENT */}
          <div className="relative z-10 my-auto max-w-[540px] py-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d4af37]">
              Store Management
            </p>

            <h1 className="mt-5 font-serif text-[46px] font-semibold leading-[1.08] xl:text-[56px]">
              Everything your store needs,
              <span className="block italic text-[#f1d898]">
                beautifully managed.
              </span>
            </h1>

            <p className="mt-6 max-w-[470px] text-[15px] leading-7 text-white/55">
              Manage your products, customer orders and
              promotional campaigns from one secure
              premium workspace.
            </p>

            {/* FEATURED PRODUCT */}
            <div className="mt-10 max-w-[470px] rounded-[26px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#d4af37]/12 text-[#d4af37]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-6 w-6"
                  >
                    <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
                    <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
                  </svg>
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                    Featured Product
                  </p>

                  <h2 className="mt-1 font-serif text-xl font-semibold">
                    ORINOCA NATURAL
                  </h2>

                  <p className="mt-1 text-xs text-white/40">
                    Premium skincare management
                  </p>
                </div>
              </div>
            </div>

            {/* TRUST FEATURES */}
            <div className="mt-7 grid max-w-[470px] grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <p className="mt-3 text-xs font-semibold">
                  Secure
                </p>

                <p className="mt-1 text-[10px] text-white/35">
                  Admin access
                </p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                <div className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />

                <p className="mt-3 text-xs font-semibold">
                  Live
                </p>

                <p className="mt-1 text-[10px] text-white/35">
                  Store data
                </p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                <div className="h-1.5 w-1.5 rounded-full bg-white/70" />

                <p className="mt-3 text-xs font-semibold">
                  Simple
                </p>

                <p className="mt-1 text-[10px] text-white/35">
                  Management
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[10px] text-white/25">
            <span>© 2026 ORINOCA NATURAL</span>

            <span>Admin System</span>
          </div>
        </section>

        {/* LOGIN AREA */}
        <section className="relative flex min-h-screen items-center justify-center p-4 sm:p-7 lg:p-10">
          {/* mobile decorative circle */}
          <div className="pointer-events-none absolute -right-32 -top-36 h-80 w-80 rounded-full border border-[#d4af37]/15 lg:hidden" />

          <div className="relative z-10 w-full max-w-[480px]">
            {/* MOBILE BRAND */}
            <div className="mb-8 flex items-start justify-between lg:hidden">
              <div>
                <p className="font-serif text-3xl font-semibold leading-none text-[#123529]">
                  NM
                </p>

                <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-[#8a9a86]">
                  Skin Care Admin
                </p>
              </div>

              <Link
                href="/"
                className="rounded-xl border border-[#123529]/12 bg-white px-3 py-2 text-[11px] font-semibold shadow-sm"
              >
                Store ↗
              </Link>
            </div>

            {/* CARD */}
            <div className="rounded-[30px] border border-[#123529]/10 bg-white p-6 shadow-[0_30px_90px_rgba(18,53,41,0.09)] sm:p-9 lg:p-10">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf3ef] text-[#073c31]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-5 w-5"
                  >
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="11"
                      rx="3"
                    />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </div>

                <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8a9a86]">
                  Secure Access
                </p>

                <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-[42px]">
                  Welcome back.
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#747d78]">
                  Sign in to manage ORINOCA NATURAL.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                {/* EMAIL */}
                <label className="block">
                  <span className="text-xs font-semibold text-[#394b44]">
                    Email Address
                  </span>

                  <div className="relative mt-2">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9ba29f]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="h-[18px] w-[18px]"
                      >
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="3"
                        />
                        <path d="m4 7 8 6 8-6" />
                      </svg>
                    </span>

                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="admin@example.com"
                      className="w-full rounded-2xl border border-[#123529]/12 bg-[#fbfaf7] py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-[#afb4b1] focus:border-[#1b4d3e] focus:bg-white focus:ring-4 focus:ring-[#1b4d3e]/5"
                    />
                  </div>
                </label>

                {/* PASSWORD */}
                <label className="block">
                  <span className="text-xs font-semibold text-[#394b44]">
                    Password
                  </span>

                  <div className="relative mt-2">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9ba29f]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="h-[18px] w-[18px]"
                      >
                        <rect
                          x="5"
                          y="10"
                          width="14"
                          height="11"
                          rx="3"
                        />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                    </span>

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      placeholder="Enter your password"
                      className="w-full rounded-2xl border border-[#123529]/12 bg-[#fbfaf7] py-3.5 pl-12 pr-14 text-sm outline-none transition placeholder:text-[#afb4b1] focus:border-[#1b4d3e] focus:bg-white focus:ring-4 focus:ring-[#1b4d3e]/5"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#718078] transition hover:text-[#073c31]"
                    >
                      {showPassword
                        ? "Hide"
                        : "Show"}
                    </button>
                  </div>
                </label>

                {/* ERROR */}
                {message ? (
                  <div className="flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[11px] font-bold">
                      !
                    </div>

                    <p>{message}</p>
                  </div>
                ) : null}

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#073c31] px-5 py-4 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(7,60,49,0.18)] transition hover:-translate-y-0.5 hover:bg-[#123529] hover:shadow-[0_18px_40px_rgba(7,60,49,0.22)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in to Admin Panel
                      <span className="transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* FOOTER */}
              <div className="mt-7 border-t border-[#123529]/8 pt-6">
                <div className="flex items-center justify-center gap-2 text-[10px] text-[#929995]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>

                  <span>
                    Protected ORINOCA NATURAL administration
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-[10px] leading-5 text-[#999f9c] lg:hidden">
              ORINOCA NATURAL · ORINOCA NATURAL
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}