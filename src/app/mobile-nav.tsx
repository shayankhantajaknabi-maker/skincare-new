"use client";

import Link from "next/link";
import { useState } from "react";

export default function MobileNav({ productHref }: { productHref: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="rounded-xl border border-[#1b4d3e]/20 bg-white px-4 py-3 text-sm font-semibold"
        aria-expanded={open}
      >
        {open ? "Close" : "Menu"}
      </button>

      {open ? (
        <div className="absolute left-5 right-5 top-[76px] z-50 rounded-2xl border border-[#1b4d3e]/10 bg-white p-4 shadow-xl">
          <div className="grid gap-2">
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 font-semibold hover:bg-[#f5f2eb]"
            >
              Shop
            </Link>

            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 font-semibold hover:bg-[#f5f2eb]"
            >
              Cart
            </Link>

            <Link
              href="/track-order"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 font-semibold hover:bg-[#f5f2eb]"
            >
              Track order
            </Link>

            <Link
              href="/faq"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 font-semibold hover:bg-[#f5f2eb]"
            >
              FAQ
            </Link>

            <Link
              href={productHref}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-[#1b4d3e] px-4 py-3 text-center font-semibold text-white"
            >
              Order now
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}