"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

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

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadProducts() {
    setLoadingProducts(true);

    try {
      const response = await fetch("/api/admin/products");
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load products.");
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
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(initialForm);
    setImageFile(null);
    setImagePreview("");
    setMessage("");
  }

  function startEditing(product: Product) {
    const currentImage = product.images?.[0] || "";

    setEditingId(product._id);
    setImageFile(null);
    setImagePreview(currentImage);
    setMessage("");

    setForm({
      name: product.name || "",
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      compareAtPrice:
        product.compareAtPrice !== null && product.compareAtPrice !== undefined
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

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;

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

    const response = await fetch("/api/admin/uploads", {
      method: "POST",
      body: uploadData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Image upload failed.");
    }

    const url = data.url || data.imageUrl || data.secure_url;

    if (!url) {
      throw new Error("Image upload did not return a URL.");
    }

    return url as string;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const uploadedImageUrl = await uploadImage();

      const payload = {
        ...(editingId ? { id: editingId } : {}),
        name: form.name,
        shortDescription: form.shortDescription,
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

      const response = await fetch("/api/admin/products", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to save product.");
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

  return (
    <main className="min-h-screen bg-[#f5f2eb] px-5 py-10 text-[#123529]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
              NM Skin Care Admin
            </p>
            <h1 className="mt-2 text-4xl font-semibold">Products</h1>
            <p className="mt-2 text-neutral-600">
              Add, edit, price and control all live store products.
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
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">
                {editingId ? "Edit product" : "Add new product"}
              </h2>

              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm font-semibold text-[#1b4d3e]"
                >
                  Cancel edit
                </button>
              ) : null}
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm font-semibold">
                  Pack type
                  <select
                    value={form.packType}
                    onChange={(event) =>
                      updateField("packType", event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 outline-none focus:border-[#1b4d3e]"
                  >
                    <option value="single">Single Bottle</option>
                    <option value="twin">Twin Pack</option>
                    <option value="family">Family Pack</option>
                  </select>
                </label>

                <label className="text-sm font-semibold">
                  Bottles in this pack
                  <input
                    required
                    type="number"
                    min="1"
                    max="20"
                    value={form.units}
                    onChange={(event) =>
                      updateField("units", event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-[#1b4d3e]"
                  />
                </label>
              </div>

              <input
                required
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Product name, e.g. NM Skin Care Serum — Twin Pack"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-[#1b4d3e]"
              />

              <input
                value={form.badge}
                onChange={(event) => updateField("badge", event.target.value)}
                placeholder="Badge, e.g. BEST VALUE"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-[#1b4d3e]"
              />

              <input
                value={form.shortDescription}
                onChange={(event) =>
                  updateField("shortDescription", event.target.value)
                }
                placeholder="Short description"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-[#1b4d3e]"
              />

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Full product description"
                rows={4}
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-[#1b4d3e]"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) => updateField("price", event.target.value)}
                  placeholder="Sale price (PKR)"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-[#1b4d3e]"
                />

                <input
                  type="number"
                  min="0"
                  value={form.compareAtPrice}
                  onChange={(event) =>
                    updateField("compareAtPrice", event.target.value)
                  }
                  placeholder="Old price / crossed price"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-[#1b4d3e]"
                />
              </div>

              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(event) => updateField("stock", event.target.value)}
                placeholder="Stock quantity"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-[#1b4d3e]"
              />

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Product image
                </label>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm"
                />

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="mt-3 h-28 w-28 rounded-xl border border-neutral-100 object-cover"
                  />
                ) : null}
              </div>

              <label className="flex items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    updateField("isActive", event.target.checked)
                  }
                />
                Show product in store
              </label>

              <label className="flex items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) =>
                    updateField("featured", event.target.checked)
                  }
                />
                Mark as featured
              </label>

              {message ? (
                <p className="rounded-xl bg-[#f5f2eb] px-4 py-3 text-sm">
                  {message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-[#1b4d3e] px-4 py-3 font-semibold text-white disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save product changes"
                    : "Create product"}
              </button>
            </div>
          </form>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">All products</h2>

            <div className="mt-6 space-y-3">
              {loadingProducts ? (
                <p className="text-neutral-500">Loading products...</p>
              ) : products.length === 0 ? (
                <p className="text-neutral-500">No products found.</p>
              ) : (
                products.map((product) => (
                  <article
                    key={product._id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-100 p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-14 w-14 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="grid h-14 w-14 place-items-center rounded-xl bg-[#f5f2eb] text-xs text-neutral-500">
                          No image
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-sm text-neutral-500">
                          Rs. {product.price.toLocaleString()} · Stock:{" "}
                          {product.stock}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[#1b4d3e]">
                          {(product.packType || "single") === "single"
                            ? "Single Bottle"
                            : product.packType === "twin"
                              ? "Twin Pack"
                              : "Family Pack"}{" "}
                          · {product.units || 1} bottle
                          {(product.units || 1) > 1 ? "s" : ""}
                          {product.badge ? ` · ${product.badge}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {product.isActive ? "Active" : "Hidden"}
                      </span>

                      <button
                        type="button"
                        onClick={() => startEditing(product)}
                        className="rounded-xl border border-[#1b4d3e]/20 px-4 py-2 text-sm font-semibold"
                      >
                        Edit
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