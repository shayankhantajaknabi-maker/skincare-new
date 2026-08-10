"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import AdminShell from "../admin-shell";

type PackType = "single" | "twin" | "family";

type Product = {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  isActive: boolean;
  featured: boolean;
  images: string[];
  packType?: PackType;
  units?: number;
  badge?: string;
};

const initialForm = {
  name: "",
  shortDescription: "",
  description: "",
  price: "",
  compareAtPrice: "",
  stock: "0",
  imageUrl: "",
  isActive: true,
  featured: false,
  packType: "single" as PackType,
  units: "1",
  badge: "",
};

function ProductIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="9" cy="10" r="2" />
      <path d="m4 17 4-4 3 3 3-4 6 6" />
    </svg>
  );
}

function PriceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 9.5c0-1.2 1.2-2 3.3-2 1.9 0 3.2.7 3.2 2 0 3-6.5 1.2-6.5 4.8 0 1.4 1.4 2.2 3.6 2.2 2.1 0 3.5-.8 3.5-2.2M12 5.5v13" />
    </svg>
  );
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(
    null
  );
  const [imageFile, setImageFile] =
    useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loadingProducts, setLoadingProducts] =
    useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadProducts() {
    setLoadingProducts(true);

    try {
      const response = await fetch(
        "/api/admin/products"
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to load products."
        );
        return;
      }

      setProducts(data.products || []);
    } catch {
      setMessage("Unable to load products.");
    } finally {
      setLoadingProducts(false);
    }
  }

  useEffect(() => {
    loadProducts();
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
    setImageFile(null);
    setImagePreview("");
    setMessage("");
  }

  function startEditing(product: Product) {
    const currentImage =
      product.images?.[0] || "";

    setEditingId(product._id);
    setImageFile(null);
    setImagePreview(currentImage);
    setMessage("");

    setForm({
      name: product.name || "",
      shortDescription:
        product.shortDescription || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      compareAtPrice:
        product.compareAtPrice !== null &&
        product.compareAtPrice !== undefined
          ? String(product.compareAtPrice)
          : "",
      stock: String(product.stock ?? 0),
      imageUrl: currentImage,
      isActive: product.isActive,
      featured: product.featured,
      packType: product.packType || "single",
      units: String(product.units || 1),
      badge: product.badge || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] || null;

    if (!file) {
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadImage() {
    if (!imageFile) {
      return form.imageUrl;
    }

    const uploadData = new FormData();

    uploadData.append("image", imageFile);

    const response = await fetch(
      "/api/admin/uploads",
      {
        method: "POST",
        body: uploadData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Image upload failed."
      );
    }

    const url =
      data.url ||
      data.imageUrl ||
      data.secure_url;

    if (!url) {
      throw new Error(
        "Image upload did not return a URL."
      );
    }

    return url as string;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const uploadedImageUrl =
        await uploadImage();

      const payload = {
        ...(editingId
          ? { id: editingId }
          : {}),
        name: form.name,
        shortDescription:
          form.shortDescription,
        description: form.description,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice
          ? Number(form.compareAtPrice)
          : null,
        stock: Number(form.stock),
        imageUrl: uploadedImageUrl,
        isActive: form.isActive,
        featured: form.featured,
        packType: form.packType,
        units: Number(form.units),
        badge: form.badge,
      };

      const response = await fetch(
        "/api/admin/products",
        {
          method: editingId
            ? "PATCH"
            : "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to save product."
        );
        return;
      }

      setMessage(
        editingId
          ? "Product updated successfully."
          : "Product created successfully."
      );

      resetForm();
      await loadProducts();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  const activeProducts = products.filter(
    (product) => product.isActive
  ).length;

  const featuredProducts = products.filter(
    (product) => product.featured
  ).length;

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.stock || 0),
    0
  );

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1540px] p-4 sm:p-6 lg:p-10">
        {/* HEADER */}
        <header className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a9a86]">
              Catalogue Management
            </p>

            <h1 className="mt-2 font-serif text-4xl font-semibold sm:text-5xl">
              Products
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#68716d]">
              Manage ORINOCA NATURAL products,
              pack sizes, pricing, images and stock.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              target="_blank"
              className="rounded-xl border border-[#123529]/15 bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-[#faf8f2]"
            >
              View Store ↗
            </Link>

            <Link
              href="/admin"
              className="rounded-xl bg-[#073c31] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#073c31]/10 transition hover:bg-[#123529]"
            >
              Dashboard
            </Link>
          </div>
        </header>

        {/* STATS */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5 shadow-[0_10px_35px_rgba(18,53,41,0.04)]">
            <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
              Total Products
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {products.length}
            </p>
          </article>

          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5 shadow-[0_10px_35px_rgba(18,53,41,0.04)]">
            <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
              Active Products
            </p>

            <p className="mt-3 text-3xl font-semibold text-[#0b6a50]">
              {activeProducts}
            </p>
          </article>

          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5 shadow-[0_10px_35px_rgba(18,53,41,0.04)]">
            <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
              Total Stock
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {totalStock}
            </p>

            <p className="mt-1 text-xs text-[#929a96]">
              {featuredProducts} featured
            </p>
          </article>
        </section>

        {message ? (
          <div className="mt-6 rounded-2xl border border-[#d4af37]/25 bg-[#fffaf0] px-5 py-4 text-sm text-[#765a18]">
            {message}
          </div>
        ) : null}

        {/* MAIN CONTENT */}
        <div className="mt-6 grid gap-6 2xl:grid-cols-[0.88fr_1.12fr]">
          {/* PRODUCT FORM */}
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-[26px] border border-[#123529]/10 bg-white shadow-[0_16px_50px_rgba(18,53,41,0.05)]"
          >
            <div className="flex items-center justify-between border-b border-[#123529]/10 bg-[#fbfaf6] px-5 py-5 sm:px-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
                  Product Editor
                </p>

                <h2 className="mt-1 font-serif text-2xl font-semibold">
                  {editingId
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>
              </div>

              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-[#123529]/15 bg-white px-4 py-2 text-xs font-semibold transition hover:bg-[#f7f4ed]"
                >
                  Cancel
                </button>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf3ef] text-[#073c31]">
                  <ProductIcon />
                </div>
              )}
            </div>

            <div className="space-y-7 p-5 sm:p-6">
              {/* CONFIGURATION */}
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf3ef] text-[#073c31]">
                    <ProductIcon />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Product Configuration
                    </h3>

                    <p className="text-xs text-[#8a938f]">
                      Pack and catalogue details
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                    Pack Type

                    <select
                      value={form.packType}
                      onChange={(event) =>
                        updateField(
                          "packType",
                          event.target.value
                        )
                      }
                      className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal normal-case tracking-normal outline-none transition focus:border-[#1b4d3e] focus:bg-white focus:ring-4 focus:ring-[#1b4d3e]/5"
                    >
                      <option value="single">
                        Single Bottle
                      </option>

                      <option value="twin">
                        Twin Pack
                      </option>

                      <option value="family">
                        Family Pack
                      </option>
                    </select>
                  </label>

                  <label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                    Bottles in Pack

                    <input
                      required
                      type="number"
                      min="1"
                      max="20"
                      value={form.units}
                      onChange={(event) =>
                        updateField(
                          "units",
                          event.target.value
                        )
                      }
                      className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal normal-case tracking-normal outline-none transition focus:border-[#1b4d3e] focus:bg-white focus:ring-4 focus:ring-[#1b4d3e]/5"
                    />
                  </label>
                </div>

                <div className="mt-4 space-y-4">
                  <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                    Product Name

                    <input
                      required
                      value={form.name}
                      onChange={(event) =>
                        updateField(
                          "name",
                          event.target.value
                        )
                      }
                      placeholder="ORINOCA NATURAL — Single Bottle"
                      className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal normal-case tracking-normal outline-none transition placeholder:text-[#a6aca9] focus:border-[#1b4d3e] focus:bg-white focus:ring-4 focus:ring-[#1b4d3e]/5"
                    />
                  </label>

                  <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                    Product Badge

                    <input
                      value={form.badge}
                      onChange={(event) =>
                        updateField(
                          "badge",
                          event.target.value
                        )
                      }
                      placeholder="BEST VALUE"
                      className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal normal-case tracking-normal outline-none transition placeholder:text-[#a6aca9] focus:border-[#1b4d3e] focus:bg-white focus:ring-4 focus:ring-[#1b4d3e]/5"
                    />
                  </label>

                  <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                    Short Description

                    <input
                      value={
                        form.shortDescription
                      }
                      onChange={(event) =>
                        updateField(
                          "shortDescription",
                          event.target.value
                        )
                      }
                      placeholder="Pure & natural skincare serum"
                      className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal normal-case tracking-normal outline-none transition placeholder:text-[#a6aca9] focus:border-[#1b4d3e] focus:bg-white focus:ring-4 focus:ring-[#1b4d3e]/5"
                    />
                  </label>

                  <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                    Full Description

                    <textarea
                      value={form.description}
                      onChange={(event) =>
                        updateField(
                          "description",
                          event.target.value
                        )
                      }
                      placeholder="Write the full product description..."
                      rows={4}
                      className="mt-2 w-full resize-none rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal normal-case leading-6 tracking-normal outline-none transition placeholder:text-[#a6aca9] focus:border-[#1b4d3e] focus:bg-white focus:ring-4 focus:ring-[#1b4d3e]/5"
                    />
                  </label>
                </div>
              </section>

              <div className="h-px bg-[#123529]/8" />

              {/* PRICING */}
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff5d9] text-[#987117]">
                    <PriceIcon />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Pricing & Inventory
                    </h3>

                    <p className="text-xs text-[#8a938f]">
                      Price and stock management
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                    Sale Price (PKR)

                    <input
                      required
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(event) =>
                        updateField(
                          "price",
                          event.target.value
                        )
                      }
                      placeholder="3250"
                      className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal tracking-normal outline-none transition focus:border-[#1b4d3e] focus:bg-white focus:ring-4 focus:ring-[#1b4d3e]/5"
                    />
                  </label>

                  <label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                    Compare Price

                    <input
                      type="number"
                      min="0"
                      value={
                        form.compareAtPrice
                      }
                      onChange={(event) =>
                        updateField(
                          "compareAtPrice",
                          event.target.value
                        )
                      }
                      placeholder="3999"
                      className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal tracking-normal outline-none transition focus:border-[#1b4d3e] focus:bg-white focus:ring-4 focus:ring-[#1b4d3e]/5"
                    />
                  </label>
                </div>

                <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                  Stock Quantity

                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(event) =>
                      updateField(
                        "stock",
                        event.target.value
                      )
                    }
                    placeholder="Stock quantity"
                    className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal tracking-normal outline-none transition focus:border-[#1b4d3e] focus:bg-white focus:ring-4 focus:ring-[#1b4d3e]/5"
                  />
                </label>
              </section>

              <div className="h-px bg-[#123529]/8" />

              {/* IMAGE */}
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf3ef] text-[#073c31]">
                    <ImageIcon />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Product Image
                    </h3>

                    <p className="text-xs text-[#8a938f]">
                      Upload ORINOCA NATURAL
                      imagery
                    </p>
                  </div>
                </div>

                <label className="block cursor-pointer rounded-[20px] border border-dashed border-[#123529]/20 bg-[#fbfaf7] p-5 transition hover:border-[#d4af37]/60 hover:bg-[#fffdf8]">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="block w-full text-xs text-[#65706b] file:mr-4 file:rounded-xl file:border-0 file:bg-[#073c31] file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-white"
                  />

                  <p className="mt-3 text-xs leading-5 text-[#909894]">
                    PNG, JPG or WEBP. Use the
                    official ORINOCA NATURAL
                    product photography.
                  </p>
                </label>

                {imagePreview ? (
                  <div className="mt-4 overflow-hidden rounded-[20px] border border-[#123529]/10 bg-[#f6f3eb] p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white shadow-sm">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="h-full w-full object-contain p-2"
                        />
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
                          Product Preview
                        </p>

                        <p className="mt-2 font-serif text-xl font-semibold">
                          ORINOCA NATURAL
                        </p>

                        <p className="mt-1 text-xs text-[#79827e]">
                          Image ready for upload
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </section>

              {/* VISIBILITY */}
              <section className="grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#123529]/10 bg-[#fbfaf7] p-4">
                  <div>
                    <p className="text-sm font-semibold">
                      Store Visibility
                    </p>

                    <p className="mt-1 text-xs text-[#8a938f]">
                      Show product publicly
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

                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#123529]/10 bg-[#fbfaf7] p-4">
                  <div>
                    <p className="text-sm font-semibold">
                      Featured
                    </p>

                    <p className="mt-1 text-xs text-[#8a938f]">
                      Highlight this product
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) =>
                      updateField(
                        "featured",
                        event.target.checked
                      )
                    }
                    className="h-5 w-5 shrink-0 accent-[#d4af37]"
                  />
                </label>
              </section>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-[#073c31] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(7,60,49,0.16)] transition hover:bg-[#123529] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving Product..."
                  : editingId
                    ? "Save Product Changes"
                    : "Create Product"}
              </button>
            </div>
          </form>

          {/* PRODUCTS LIST */}
          <section className="overflow-hidden rounded-[26px] border border-[#123529]/10 bg-white shadow-[0_16px_50px_rgba(18,53,41,0.05)]">
            <div className="flex flex-col gap-3 border-b border-[#123529]/10 bg-[#fbfaf6] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
                  Catalogue
                </p>

                <h2 className="mt-1 font-serif text-2xl font-semibold">
                  All Products
                </h2>
              </div>

              <span className="w-fit rounded-full bg-[#edf3ef] px-3 py-1.5 text-xs font-semibold text-[#073c31]">
                {products.length} Products
              </span>
            </div>

            <div className="p-4 sm:p-5">
              {loadingProducts ? (
                <div className="rounded-2xl bg-[#fbfaf7] p-8 text-center text-sm text-[#8a938f]">
                  Loading products...
                </div>
              ) : products.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-[#123529]/15 bg-[#fbfaf7] p-8 text-center sm:p-10">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf3ef] text-[#073c31]">
                    <ProductIcon />
                  </div>

                  <h3 className="mt-5 font-serif text-2xl font-semibold">
                    No products yet
                  </h3>

                  <p className="mt-2 text-sm text-[#8a938f]">
                    Create your first ORINOCA NATURAL
                    product.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {products.map((product) => (
                    <article
                      key={product._id}
                      className="group rounded-[20px] border border-[#123529]/10 bg-[#fbfaf7] p-4 transition hover:border-[#d4af37]/40 hover:bg-white hover:shadow-[0_12px_30px_rgba(18,53,41,0.06)]"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-start gap-4 sm:items-center">
                          {product.images?.[0] ? (
                            <div className="grid h-[78px] w-[78px] shrink-0 place-items-center overflow-hidden rounded-2xl border border-[#123529]/8 bg-white">
                              <img
                                src={
                                  product.images[0]
                                }
                                alt={product.name}
                                className="h-full w-full object-contain p-2"
                              />
                            </div>
                          ) : (
                            <div className="grid h-[78px] w-[78px] shrink-0 place-items-center rounded-2xl bg-[#edf3ef] text-xs font-semibold text-[#073c31]">
                              ON
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="break-words font-serif text-lg font-semibold">
                                {product.name}
                              </h3>

                              {product.featured ? (
                                <span className="rounded-full bg-[#fff4d1] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#987117]">
                                  Featured
                                </span>
                              ) : null}
                            </div>

                            <p className="mt-2 text-sm font-semibold text-[#073c31]">
                              Rs.{" "}
                              {product.price.toLocaleString()}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#828b87]">
                              <span>
                                Stock: {product.stock}
                              </span>

                              <span>•</span>

                              <span>
                                {(
                                  product.packType ||
                                  "single"
                                ) === "single"
                                  ? "Single Bottle"
                                  : product.packType ===
                                      "twin"
                                    ? "Twin Pack"
                                    : "Family Pack"}
                              </span>

                              <span>•</span>

                              <span>
                                {product.units || 1}{" "}
                                bottle
                                {(product.units ||
                                  1) > 1
                                  ? "s"
                                  : ""}
                              </span>
                            </div>

                            {product.badge ? (
                              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9a741a]">
                                {product.badge}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                          <span
                            className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold ${
                              product.isActive
                                ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                                : "border-neutral-200 bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            {product.isActive
                              ? "Active"
                              : "Hidden"}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              startEditing(
                                product
                              )
                            }
                            className="rounded-xl border border-[#123529]/15 bg-white px-4 py-2.5 text-xs font-semibold transition hover:border-[#073c31] hover:bg-[#073c31] hover:text-white"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}