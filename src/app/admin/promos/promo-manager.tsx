"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminShell from "../admin-shell";

type Promo = {
  _id: string;
  code: string;
  discountPercent: number;
  minimumOrderAmount: number;
  isActive: boolean;
  expiresAt: string | null;
};

const initialForm = {
  code: "",
  discountPercent: "10",
  minimumOrderAmount: "0",
  expiresAt: "",
  isActive: true,
};

function PromoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <path d="M20 13 13 20a2 2 0 0 1-3 0l-6-6a2 2 0 0 1 0-3l7-7h7a2 2 0 0 1 2 2v7Z" />
      <circle cx="15.5" cy="8.5" r="1" />
    </svg>
  );
}

export default function PromoManager() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadPromos() {
    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/promos"
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to load promo codes."
        );
        return;
      }

      setPromos(data.promos || []);
    } catch {
      setMessage("Unable to load promo codes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPromos();
  }, []);

  function updateField(
    field: keyof typeof initialForm,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(initialForm);
  }

  function startEditing(promo: Promo) {
    setEditingId(promo._id);
    setMessage("");

    setForm({
      code: promo.code,
      discountPercent: String(
        promo.discountPercent
      ),
      minimumOrderAmount: String(
        promo.minimumOrderAmount
      ),
      expiresAt: promo.expiresAt
        ? promo.expiresAt.slice(0, 10)
        : "",
      isActive: promo.isActive,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    const body = {
      ...(editingId
        ? { id: editingId }
        : {}),
      code: form.code.trim().toUpperCase(),
      discountPercent: Number(
        form.discountPercent
      ),
      minimumOrderAmount: Number(
        form.minimumOrderAmount
      ),
      expiresAt: form.expiresAt,
      isActive: form.isActive,
    };

    try {
      const response = await fetch(
        "/api/admin/promos",
        {
          method: editingId
            ? "PATCH"
            : "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to save promo code."
        );
        return;
      }

      setMessage(
        editingId
          ? "Promo code updated successfully."
          : "Promo code created successfully."
      );

      resetForm();
      await loadPromos();
    } catch {
      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePromo(promo: Promo) {
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/promos",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id: promo._id,
            code: promo.code,
            discountPercent:
              promo.discountPercent,
            minimumOrderAmount:
              promo.minimumOrderAmount,
            expiresAt: promo.expiresAt
              ? promo.expiresAt.slice(0, 10)
              : "",
            isActive: !promo.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to update promo code."
        );
        return;
      }

      setMessage(
        promo.isActive
          ? "Promo code disabled."
          : "Promo code activated."
      );

      await loadPromos();
    } catch {
      setMessage(
        "Unable to update promo code."
      );
    }
  }

  const activePromos = promos.filter(
    (promo) => promo.isActive
  ).length;

  const expiredPromos = promos.filter(
    (promo) => {
      if (!promo.expiresAt) {
        return false;
      }

      return (
        new Date(
          promo.expiresAt
        ).getTime() < Date.now()
      );
    }
  ).length;

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-10">
        {/* HEADER */}
        <header className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a9a86]">
              Marketing
            </p>

            <h1 className="mt-2 font-serif text-4xl font-semibold sm:text-5xl">
              Promo Codes
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#68716d]">
              Create elegant discount campaigns and
              control exactly when customers can use
              them.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              target="_blank"
              className="rounded-xl border border-[#123529]/15 bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-[#faf8f2]"
            >
              View Store ↗
            </a>

            <a
              href="/admin"
              className="rounded-xl bg-[#073c31] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#073c31]/10 transition hover:bg-[#123529]"
            >
              Dashboard
            </a>
          </div>
        </header>

        {/* STATS */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5 shadow-[0_10px_35px_rgba(18,53,41,0.04)]">
            <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
              Total Codes
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {promos.length}
            </p>
          </article>

          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5 shadow-[0_10px_35px_rgba(18,53,41,0.04)]">
            <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
              Active
            </p>

            <p className="mt-3 text-3xl font-semibold text-emerald-700">
              {activePromos}
            </p>
          </article>

          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5 shadow-[0_10px_35px_rgba(18,53,41,0.04)]">
            <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
              Expired
            </p>

            <p className="mt-3 text-3xl font-semibold text-[#9a741a]">
              {expiredPromos}
            </p>
          </article>
        </section>

        {message ? (
          <div className="mt-6 rounded-2xl border border-[#d4af37]/25 bg-[#fffaf0] px-5 py-4 text-sm text-[#765a18]">
            {message}
          </div>
        ) : null}

        {/* MAIN */}
        <div className="mt-6 grid gap-6 2xl:grid-cols-[0.82fr_1.18fr]">
          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-[26px] border border-[#123529]/10 bg-white shadow-[0_16px_50px_rgba(18,53,41,0.05)]"
          >
            <div className="flex items-center justify-between border-b border-[#123529]/10 bg-[#fbfaf6] px-5 py-5 sm:px-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
                  Campaign Editor
                </p>

                <h2 className="mt-1 font-serif text-2xl font-semibold">
                  {editingId
                    ? "Edit Promo Code"
                    : "Create Promo Code"}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff4d1] text-[#987117]">
                <PromoIcon />
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                Promo Code

                <input
                  required
                  maxLength={30}
                  value={form.code}
                  onChange={(event) =>
                    updateField(
                      "code",
                      event.target.value.toUpperCase()
                    )
                  }
                  placeholder="EID20"
                  className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.1em] outline-none transition placeholder:text-[#a6aca9] focus:border-[#1b4d3e] focus:bg-white focus:ring-4 focus:ring-[#1b4d3e]/5"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                  Discount Percentage

                  <div className="relative mt-2">
                    <input
                      required
                      type="number"
                      min="1"
                      max="90"
                      value={
                        form.discountPercent
                      }
                      onChange={(event) =>
                        updateField(
                          "discountPercent",
                          event.target.value
                        )
                      }
                      className="w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 pr-12 text-sm font-normal tracking-normal outline-none transition focus:border-[#1b4d3e] focus:bg-white focus:ring-4 focus:ring-[#1b4d3e]/5"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#8a938f]">
                      %
                    </span>
                  </div>
                </label>

                <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                  Minimum Order

                  <div className="relative mt-2">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8a938f]">
                      Rs.
                    </span>

                    <input
                      required
                      type="number"
                      min="0"
                      value={
                        form.minimumOrderAmount
                      }
                      onChange={(event) =>
                        updateField(
                          "minimumOrderAmount",
                          event.target.value
                        )
                      }
                      className="w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] py-3.5 pl-12 pr-4 text-sm font-normal tracking-normal outline-none transition focus:border-[#1b4d3e] focus:bg-white focus:ring-4 focus:ring-[#1b4d3e]/5"
                    />
                  </div>
                </label>
              </div>

              <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                Expiry Date

                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(event) =>
                    updateField(
                      "expiresAt",
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal tracking-normal outline-none transition focus:border-[#1b4d3e] focus:bg-white focus:ring-4 focus:ring-[#1b4d3e]/5"
                />

                <p className="mt-2 text-[11px] font-normal normal-case tracking-normal text-[#929995]">
                  Leave empty if this promo should not
                  expire automatically.
                </p>
              </label>

              {/* LIVE PREVIEW */}
              <div className="overflow-hidden rounded-[20px] border border-[#d4af37]/20 bg-[#073c31] p-5 text-white">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                  Campaign Preview
                </p>

                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-serif text-2xl font-semibold tracking-wide text-[#f3dda5]">
                      {form.code || "YOURCODE"}
                    </p>

                    <p className="mt-1 text-xs text-white/50">
                      Minimum order Rs.{" "}
                      {Number(
                        form.minimumOrderAmount ||
                          0
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="w-fit rounded-2xl bg-[#d4af37] px-5 py-3 text-[#073c31]">
                    <span className="text-2xl font-bold">
                      {form.discountPercent ||
                        "0"}
                      %
                    </span>

                    <span className="ml-1 text-xs font-semibold">
                      OFF
                    </span>
                  </div>
                </div>
              </div>

              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#123529]/10 bg-[#fbfaf7] p-4">
                <div>
                  <p className="text-sm font-semibold">
                    Promo Status
                  </p>

                  <p className="mt-1 text-xs text-[#8a938f]">
                    Allow customers to use this code
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    updateField(
                      "isActive",
                      event.target.checked
                    )
                  }
                  className="h-5 w-5 shrink-0 accent-[#073c31]"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-2xl bg-[#073c31] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(7,60,49,0.16)] transition hover:bg-[#123529] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Promo Code"
                      : "Create Promo Code"}
                </button>

                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-2xl border border-[#123529]/15 bg-white px-5 py-4 text-sm font-semibold transition hover:bg-[#f7f4ed]"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </div>
          </form>

          {/* PROMO LIST */}
          <section className="overflow-hidden rounded-[26px] border border-[#123529]/10 bg-white shadow-[0_16px_50px_rgba(18,53,41,0.05)]">
            <div className="flex flex-col gap-3 border-b border-[#123529]/10 bg-[#fbfaf6] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
                  Marketing Campaigns
                </p>

                <h2 className="mt-1 font-serif text-2xl font-semibold">
                  All Promo Codes
                </h2>
              </div>

              <span className="w-fit rounded-full bg-[#fff4d1] px-3 py-1.5 text-xs font-semibold text-[#987117]">
                {promos.length} Codes
              </span>
            </div>

            <div className="p-4 sm:p-5">
              {loading ? (
                <div className="rounded-2xl bg-[#fbfaf7] p-8 text-center text-sm text-[#8a938f]">
                  Loading promo codes...
                </div>
              ) : promos.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-[#123529]/15 bg-[#fbfaf7] p-8 text-center sm:p-10">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff4d1] text-[#987117]">
                    <PromoIcon />
                  </div>

                  <h3 className="mt-5 font-serif text-2xl font-semibold">
                    No campaigns yet
                  </h3>

                  <p className="mt-2 text-sm text-[#8a938f]">
                    Create your first promotional
                    campaign.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {promos.map((promo) => {
                    const expired =
                      Boolean(
                        promo.expiresAt
                      ) &&
                      new Date(
                        promo.expiresAt as string
                      ).getTime() < Date.now();

                    return (
                      <article
                        key={promo._id}
                        className="rounded-[20px] border border-[#123529]/10 bg-[#fbfaf7] p-4 transition hover:border-[#d4af37]/45 hover:bg-white hover:shadow-[0_12px_30px_rgba(18,53,41,0.05)] sm:p-5"
                      >
                        <div className="flex flex-col gap-5">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="break-all font-serif text-xl font-semibold tracking-wide">
                                  {promo.code}
                                </h3>

                                <span
                                  className={`rounded-full border px-3 py-1 text-[10px] font-semibold ${
                                    expired
                                      ? "border-red-100 bg-red-50 text-red-700"
                                      : promo.isActive
                                        ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                                        : "border-neutral-200 bg-neutral-100 text-neutral-600"
                                  }`}
                                >
                                  {expired
                                    ? "Expired"
                                    : promo.isActive
                                      ? "Active"
                                      : "Disabled"}
                                </span>
                              </div>

                              <p className="mt-2 text-xs text-[#8a938f]">
                                Customer discount
                                campaign
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  startEditing(
                                    promo
                                  )
                                }
                                className="rounded-xl border border-[#123529]/15 bg-white px-4 py-2.5 text-xs font-semibold transition hover:border-[#073c31] hover:bg-[#073c31] hover:text-white"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  togglePromo(promo)
                                }
                                className="rounded-xl bg-[#f1ecdf] px-4 py-2.5 text-xs font-semibold transition hover:bg-[#e8dfc7]"
                              >
                                {promo.isActive
                                  ? "Disable"
                                  : "Activate"}
                              </button>
                            </div>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-[#123529]/8 bg-white p-4">
                              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8a938f]">
                                Discount
                              </p>

                              <p className="mt-2 font-serif text-2xl font-semibold text-[#073c31]">
                                {
                                  promo.discountPercent
                                }
                                %
                              </p>
                            </div>

                            <div className="rounded-2xl border border-[#123529]/8 bg-white p-4">
                              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8a938f]">
                                Minimum Order
                              </p>

                              <p className="mt-2 text-sm font-semibold">
                                Rs.{" "}
                                {promo.minimumOrderAmount.toLocaleString()}
                              </p>
                            </div>

                            <div className="rounded-2xl border border-[#123529]/8 bg-white p-4">
                              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8a938f]">
                                Expiry
                              </p>

                              <p className="mt-2 text-sm font-semibold">
                                {promo.expiresAt
                                  ? new Date(
                                      promo.expiresAt
                                    ).toLocaleDateString()
                                  : "No expiry"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}