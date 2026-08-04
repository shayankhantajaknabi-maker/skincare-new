"use client";

import { FormEvent, useEffect, useState } from "react";

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

export default function PromoManager() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadPromos() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/promos");
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load promo codes.");
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
    setForm((current) => ({ ...current, [field]: value }));
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
      discountPercent: String(promo.discountPercent),
      minimumOrderAmount: String(promo.minimumOrderAmount),
      expiresAt: promo.expiresAt ? promo.expiresAt.slice(0, 10) : "",
      isActive: promo.isActive,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    const body = {
      ...(editingId ? { id: editingId } : {}),
      code: form.code.trim().toUpperCase(),
      discountPercent: Number(form.discountPercent),
      minimumOrderAmount: Number(form.minimumOrderAmount),
      expiresAt: form.expiresAt,
      isActive: form.isActive,
    };

    try {
      const response = await fetch("/api/admin/promos", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to save promo code.");
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
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePromo(promo: Promo) {
    setMessage("");

    try {
      const response = await fetch("/api/admin/promos", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: promo._id,
          code: promo.code,
          discountPercent: promo.discountPercent,
          minimumOrderAmount: promo.minimumOrderAmount,
          expiresAt: promo.expiresAt
            ? promo.expiresAt.slice(0, 10)
            : "",
          isActive: !promo.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to update promo code.");
        return;
      }

      setMessage(
        promo.isActive ? "Promo code disabled." : "Promo code activated."
      );

      await loadPromos();
    } catch {
      setMessage("Unable to update promo code.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f2eb] px-5 py-10 text-[#123529]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
              NM Skin Care Admin
            </p>
            <h1 className="mt-2 text-4xl font-semibold">Promo codes</h1>
            <p className="mt-2 text-neutral-600">
              Create and control discounts shown in the customer cart.
            </p>
          </div>

          <a
            href="/admin"
            className="rounded-xl border border-[#1b4d3e]/20 bg-white px-4 py-3 text-sm font-semibold"
          >
            Back to dashboard
          </a>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 shadow-sm"
          >
            <h2 className="text-2xl font-semibold">
              {editingId ? "Edit promo code" : "Create promo code"}
            </h2>

            <div className="mt-6 space-y-4">
              <label className="block text-sm font-semibold">
                Promo code
                <input
                  required
                  maxLength={30}
                  value={form.code}
                  onChange={(event) =>
                    updateField("code", event.target.value.toUpperCase())
                  }
                  placeholder="e.g. EID20"
                  className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 uppercase outline-none focus:border-[#1b4d3e]"
                />
              </label>

              <label className="block text-sm font-semibold">
                Discount percentage
                <input
                  required
                  type="number"
                  min="1"
                  max="90"
                  value={form.discountPercent}
                  onChange={(event) =>
                    updateField("discountPercent", event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-[#1b4d3e]"
                />
              </label>

              <label className="block text-sm font-semibold">
                Minimum order amount (PKR)
                <input
                  required
                  type="number"
                  min="0"
                  value={form.minimumOrderAmount}
                  onChange={(event) =>
                    updateField("minimumOrderAmount", event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-[#1b4d3e]"
                />
              </label>

              <label className="block text-sm font-semibold">
                Expiry date (optional)
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(event) =>
                    updateField("expiresAt", event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-[#1b4d3e]"
                />
              </label>

              <label className="flex items-center gap-3 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    updateField("isActive", event.target.checked)
                  }
                />
                Keep this promo code active
              </label>

              {message ? (
                <p className="rounded-xl bg-[#f5f2eb] px-4 py-3 text-sm">
                  {message}
                </p>
              ) : null}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-[#1b4d3e] px-4 py-3 font-semibold text-white disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update promo"
                      : "Create promo"}
                </button>

                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-neutral-200 px-4 py-3 font-semibold"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </div>
          </form>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">All promo codes</h2>

            <div className="mt-6 space-y-3">
              {loading ? (
                <p className="text-neutral-500">Loading promo codes...</p>
              ) : promos.length === 0 ? (
                <p className="text-neutral-500">
                  No promo codes created yet.
                </p>
              ) : (
                promos.map((promo) => (
                  <article
                    key={promo._id}
                    className="rounded-2xl border border-neutral-100 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{promo.code}</h3>
                        <p className="mt-1 text-sm text-neutral-600">
                          {promo.discountPercent}% off · Minimum Rs.{" "}
                          {promo.minimumOrderAmount.toLocaleString()}
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          {promo.expiresAt
                            ? `Expires: ${new Date(
                                promo.expiresAt
                              ).toLocaleDateString()}`
                            : "No expiry date"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          promo.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {promo.isActive ? "Active" : "Disabled"}
                      </span>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => startEditing(promo)}
                        className="rounded-xl border border-[#1b4d3e]/20 px-4 py-2 text-sm font-semibold"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => togglePromo(promo)}
                        className="rounded-xl bg-[#f5f2eb] px-4 py-2 text-sm font-semibold"
                      >
                        {promo.isActive ? "Disable" : "Activate"}
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}