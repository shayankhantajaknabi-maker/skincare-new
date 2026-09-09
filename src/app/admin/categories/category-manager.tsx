"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import AdminShell from "../admin-shell";

type Category = {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
};

const initialForm = {
  name: "",
  isActive: true,
  sortOrder: "0",
};

export default function CategoryManager() {
  const [
    categories,
    setCategories,
  ] = useState<
    Category[]
  >([]);

  const [
    form,
    setForm,
  ] = useState(
    initialForm
  );

  const [
    editingId,
    setEditingId,
  ] = useState<
    string | null
  >(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  async function loadCategories() {
    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/admin/categories",
          {
            cache:
              "no-store",
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        setMessage(
          data.message ||
            "Unable to load categories."
        );

        return;
      }

      setCategories(
        data.categories ||
          []
      );
    } catch {
      setMessage(
        "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return categories;
      }

      return categories.filter(
        (
          category
        ) =>
          category.name
            .toLowerCase()
            .includes(
              query
            ) ||
          category.slug
            .toLowerCase()
            .includes(
              query
            )
      );
    }, [
      categories,
      search,
    ]);

  function resetForm() {
    setEditingId(null);

    setForm(
      initialForm
    );
  }

  function editCategory(
    category: Category
  ) {
    setEditingId(
      category._id
    );

    setForm({
      name:
        category.name,

      isActive:
        category.isActive,

      sortOrder:
        String(
          category.sortOrder ||
            0
        ),
    });

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior:
        "smooth",
    });
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/admin/categories",
          {
            method:
              editingId
                ? "PATCH"
                : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  ...(editingId
                    ? {
                        id:
                          editingId,
                      }
                    : {}),

                  name:
                    form.name,

                  isActive:
                    form.isActive,

                  sortOrder:
                    Number(
                      form.sortOrder ||
                        0
                    ),
                }
              ),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        setMessage(
          data.message ||
            "Unable to save category."
        );

        return;
      }

      setMessage(
        editingId
          ? "Category updated successfully."
          : "Category created successfully."
      );

      resetForm();

      await loadCategories();
    } catch {
      setMessage(
        "Unable to save category."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(
    category: Category
  ) {
    const confirmed =
      window.confirm(
        `Delete "${category.name}"? This only works when no products are using it.`
      );

    if (!confirmed) {
      return;
    }

    setMessage("");

    try {
      const response =
        await fetch(
          `/api/admin/categories?id=${encodeURIComponent(
            category._id
          )}`,
          {
            method:
              "DELETE",
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        setMessage(
          data.message ||
            "Unable to delete category."
        );

        return;
      }

      setMessage(
        "Category deleted successfully."
      );

      await loadCategories();
    } catch {
      setMessage(
        "Unable to delete category."
      );
    }
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-10">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a9a86]">
              Catalogue Management
            </p>

            <h1 className="mt-2 font-serif text-4xl font-semibold sm:text-5xl">
              Categories
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#68716d]">
              Build a clean store
              structure for serum,
              shoes, apparel and any
              future product line.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/products"
              className="rounded-xl border border-[#123529]/15 bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-[#faf8f2]"
            >
              Manage Products
            </Link>

            <Link
              href="/shop"
              target="_blank"
              className="rounded-xl bg-[#073c31] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#073c31]/10 transition hover:bg-[#123529]"
            >
              View Store ↗
            </Link>
          </div>
        </header>

        {message ? (
          <div className="mt-6 rounded-2xl border border-[#d4af37]/25 bg-[#fffaf0] px-5 py-4 text-sm text-[#765a18]">
            {message}
          </div>
        ) : null}

        <div className="mt-7 grid gap-6 xl:grid-cols-[420px_1fr]">

          {/* CATEGORY EDITOR */}

          <form
            onSubmit={
              handleSubmit
            }
            className="h-fit overflow-hidden rounded-[26px] border border-[#123529]/10 bg-white shadow-[0_16px_50px_rgba(18,53,41,0.05)]"
          >
            <div className="border-b border-[#123529]/10 bg-[#fbfaf6] px-6 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
                Category Editor
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold">
                {editingId
                  ? "Edit Category"
                  : "Add Category"}
              </h2>
            </div>

            <div className="space-y-5 p-6">
              <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                Category Name

                <input
                  required
                  value={
                    form.name
                  }
                  onChange={(
                    event
                  ) =>
                    setForm(
                      (
                        current
                      ) => ({
                        ...current,

                        name:
                          event
                            .target
                            .value,
                      })
                    )
                  }
                  placeholder="e.g. Shoes"
                  className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal normal-case tracking-normal outline-none transition placeholder:text-[#a6aca9] focus:border-[#1b4d3e] focus:bg-white focus:ring-4 focus:ring-[#1b4d3e]/5"
                />
              </label>

              <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                Display Order

                <input
                  type="number"
                  min="0"
                  max="9999"
                  value={
                    form.sortOrder
                  }
                  onChange={(
                    event
                  ) =>
                    setForm(
                      (
                        current
                      ) => ({
                        ...current,

                        sortOrder:
                          event
                            .target
                            .value,
                      })
                    )
                  }
                  className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal outline-none transition focus:border-[#1b4d3e] focus:bg-white focus:ring-4 focus:ring-[#1b4d3e]/5"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#123529]/10 bg-[#fbfaf7] p-4">
                <div>
                  <p className="text-sm font-semibold">
                    Active Category
                  </p>

                  <p className="mt-1 text-xs text-[#8a938f]">
                    Available when
                    assigning products.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={
                    form.isActive
                  }
                  onChange={(
                    event
                  ) =>
                    setForm(
                      (
                        current
                      ) => ({
                        ...current,

                        isActive:
                          event
                            .target
                            .checked,
                      })
                    )
                  }
                  className="h-5 w-5 accent-[#073c31]"
                />
              </label>

              <button
                type="submit"
                disabled={
                  saving
                }
                className="w-full rounded-2xl bg-[#073c31] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(7,60,49,0.16)] transition hover:bg-[#123529] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Category Changes"
                    : "Create Category"}
              </button>

              {editingId ? (
                <button
                  type="button"
                  onClick={
                    resetForm
                  }
                  className="w-full rounded-2xl border border-[#123529]/15 bg-white px-5 py-3.5 text-sm font-semibold transition hover:bg-[#f7f4ed]"
                >
                  Cancel Editing
                </button>
              ) : null}
            </div>
          </form>

          {/* CATEGORY LIST */}

          <section className="overflow-hidden rounded-[26px] border border-[#123529]/10 bg-white shadow-[0_16px_50px_rgba(18,53,41,0.05)]">

            <div className="border-b border-[#123529]/10 bg-[#fbfaf6] px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
                    Store Structure
                  </p>

                  <h2 className="mt-1 font-serif text-2xl font-semibold">
                    All Categories
                  </h2>
                </div>

                <span className="w-fit rounded-full bg-[#edf3ef] px-3 py-1.5 text-xs font-semibold text-[#073c31]">
                  {
                    categories.length
                  }{" "}
                  Categories
                </span>
              </div>

              <div className="relative mt-5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a938f]"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                  />

                  <path d="m20 20-3.5-3.5" />
                </svg>

                <input
                  value={
                    search
                  }
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Search categories..."
                  className="w-full rounded-2xl border border-[#123529]/12 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#a1a7a4] focus:border-[#073c31] focus:ring-4 focus:ring-[#073c31]/5"
                />
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {loading ? (
                <div className="rounded-2xl bg-[#fbfaf7] p-8 text-center text-sm text-[#8a938f]">
                  Loading
                  categories...
                </div>
              ) : filteredCategories
                  .length ===
                0 ? (
                <div className="rounded-[22px] border border-dashed border-[#123529]/15 bg-[#fbfaf7] p-10 text-center">
                  <h3 className="font-serif text-2xl font-semibold">
                    No categories
                    found
                  </h3>

                  <p className="mt-2 text-sm text-[#8a938f]">
                    Add your first
                    category to
                    organise the
                    store.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {filteredCategories.map(
                    (
                      category
                    ) => (
                      <article
                        key={
                          category._id
                        }
                        className="rounded-[20px] border border-[#123529]/10 bg-[#fbfaf7] p-5 transition hover:border-[#d4af37]/40 hover:bg-white hover:shadow-[0_12px_30px_rgba(18,53,41,0.06)]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-serif text-xl font-semibold">
                                {
                                  category.name
                                }
                              </h3>

                              <span
                                className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${
                                  category.isActive
                                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                                    : "border-neutral-200 bg-neutral-100 text-neutral-600"
                                }`}
                              >
                                {category.isActive
                                  ? "Active"
                                  : "Hidden"}
                              </span>
                            </div>

                            <p className="mt-2 text-xs text-[#8a938f]">
                              /shop/category/
                              {
                                category.slug
                              }
                            </p>

                            <p className="mt-3 text-xs text-[#737c78]">
                              Display
                              order:{" "}
                              {category.sortOrder ||
                                0}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2 border-t border-[#123529]/8 pt-4">
                          <button
                            type="button"
                            onClick={() =>
                              editCategory(
                                category
                              )
                            }
                            className="rounded-xl border border-[#123529]/15 bg-white px-4 py-2.5 text-xs font-semibold transition hover:border-[#073c31] hover:bg-[#073c31] hover:text-white"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteCategory(
                                category
                              )
                            }
                            className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                          >
                            Delete
                          </button>

                          <Link
                            href={`/shop/category/${category.slug}`}
                            target="_blank"
                            className="rounded-xl border border-[#123529]/15 bg-white px-4 py-2.5 text-xs font-semibold transition hover:bg-[#f7f4ed]"
                          >
                            View ↗
                          </Link>
                        </div>
                      </article>
                    )
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}