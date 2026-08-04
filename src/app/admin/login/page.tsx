"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to sign in");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f2eb] px-5 py-12 text-[#123529]">
      <div className="mx-auto max-w-md rounded-3xl border border-[#1b4d3e]/10 bg-white p-8 shadow-xl shadow-[#1b4d3e]/10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
          NM Skin Care
        </p>

        <h1 className="mt-3 text-3xl font-semibold">
          Admin sign in
        </h1>

        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Manage products, stock and customer orders securely.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-medium">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-[#1b4d3e]"
              placeholder="admin@example.com"
            />
          </label>

          <label className="block text-sm font-medium">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-[#1b4d3e]"
              placeholder="••••••••"
            />
          </label>

          {message ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#1b4d3e] px-4 py-3 font-semibold text-white transition hover:bg-[#123529] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in securely"}
          </button>
        </form>
      </div>
    </main>
  );
}