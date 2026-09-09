"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import AdminShell from "../admin-shell";

type PackType =
  | "single"
  | "twin"
  | "family";

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

  showOnHomepage?: boolean;

  homepageOrder?: number;

  images: string[];

  packType?: PackType;

  units?: number;

  badge?: string;

  category?: string;


  // Product Benefits
  benefits?: string[];


  // Product Ingredients
  ingredients?: {
    name: string;
    description: string;
    image?: string;
  }[];


  // How To Use Steps
  howToUse?: {
    title: string;
    description: string;
    image?: string;
  }[];


  // Brand/Product Story
  story?: string;

  beforeAfter?: {
    beforeImage: string;
    afterImage: string;
    description: string;
  };
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


  showOnHomepage: false,

  homepageOrder: "0",


  packType: "single" as PackType,

  units: "1",

  badge: "",

  category: "Serum",


  benefits: [
    "",
  ],


  ingredients: [
    {
      name: "",
      description: "",
      image: "",
    },
  ],


  howToUse: [
    {
      title: "",
      description: "",
      image: "",
    }
  ],


  story: "",

  beforeAfter: {
    beforeImage: "",
    afterImage: "",
    description: "",
  },
};
const filterOptions = [
  {
    value: "all",
    label: "All Products",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "hidden",
    label: "Hidden",
  },
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "low-stock",
    label: "Low Stock",
  },
];

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
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="3"
      />

      <circle
        cx="9"
        cy="10"
        r="2"
      />

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
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="M8.5 9.5c0-1.2 1.2-2 3.3-2 1.9 0 3.2.7 3.2 2 0 3-6.5 1.2-6.5 4.8 0 1.4 1.4 2.2 3.6 2.2 2.1 0 3.5-.8 3.5-2.2M12 5.5v13" />
    </svg>
  );
}

export default function ProductManager() {


  const [
    ingredientImageFiles,
    setIngredientImageFiles,
  ] = useState<Record<number, File | null>>({});

  const [
    howToUseImageFiles,
    setHowToUseImageFiles,
  ] = useState<Record<number, File | null>>({});
  const [
    products,
    setProducts,
  ] = useState<Product[]>([]);

  const [
    form,
    setForm,
  ] = useState(initialForm);

  const [
    editingId,
    setEditingId,
  ] =
    useState<string | null>(
      null
    );

  const [
    imageFile,
    setImageFile,
  ] =
    useState<File | null>(
      null
    );

  const [
    beforeImageFile,
    setBeforeImageFile,
  ] = useState<File | null>(null);


  const [
    afterImageFile,
    setAfterImageFile,
  ] = useState<File | null>(null);


  const [
    beforeImagePreview,
    setBeforeImagePreview,
  ] = useState("");


  const [
    afterImagePreview,
    setAfterImagePreview,
  ] = useState("");

  const [
    imagePreview,
    setImagePreview,
  ] = useState("");

  const [
    loadingProducts,
    setLoadingProducts,
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

  const [
    productFilter,
    setProductFilter,
  ] = useState("all");

  const [
    savingVisibilityId,
    setSavingVisibilityId,
  ] =
    useState<string | null>(
      null
    );

  async function loadProducts() {
    setLoadingProducts(true);

    try {
      const response =
        await fetch(
          "/api/admin/products"
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
          "Unable to load products."
        );

        return;
      }

      setProducts(
        data.products || []
      );
    } catch {
      setMessage(
        "Unable to load products."
      );
    } finally {
      setLoadingProducts(
        false
      );
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function updateField(
    field:
      keyof typeof initialForm,
    value:
      | string
      | boolean
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

    setIngredientImageFiles({});

    setHowToUseImageFiles({});

    setBeforeImageFile(null);

    setAfterImageFile(null);

    setBeforeImagePreview("");

    setAfterImagePreview("");

    setMessage("");
  }

  function startEditing(
    product: Product
  ) {
    const currentImage =
      product.images?.[0] || "";

    setEditingId(
      product._id
    );

    setImageFile(null);

    setImagePreview(
      currentImage
    );

    setMessage("");

    setForm({
      name:
        product.name || "",

      benefits:
        product.benefits || [""],

      ingredients:
        Array.isArray(product.ingredients)
          ? product.ingredients.map((item) => ({
            name: item?.name || "",
            description: item?.description || "",
            image: item?.image || "",
          }))
          : [
            {
              name: "",
              description: "",
              image: "",
            },
          ],

      howToUse:
        Array.isArray(product.howToUse)
          ? product.howToUse.map((step) => ({
            title: step?.title || "",
            description: step?.description || "",
            image: step?.image || "",
          }))
          : [
            {
              title: "",
              description: "",
              image: "",
            },
          ],

      story:
        product.story || "",

      beforeAfter: {
        beforeImage:
          product.beforeAfter?.beforeImage || "",

        afterImage:
          product.beforeAfter?.afterImage || "",

        description:
          product.beforeAfter?.description || "",
      },

      shortDescription:
        product.shortDescription ||
        "",

      description:
        product.description ||
        "",

      price:
        String(
          product.price ?? ""
        ),

      compareAtPrice:
        product.compareAtPrice !==
          null &&
          product.compareAtPrice !==
          undefined
          ? String(
            product.compareAtPrice
          )
          : "",

      stock:
        String(
          product.stock ?? 0
        ),

      imageUrl:
        currentImage,

      isActive:
        product.isActive,

      featured:
        product.featured,

      showOnHomepage:
        Boolean(
          product.showOnHomepage
        ),

      homepageOrder:
        product.showOnHomepage
          ? String(
            product.homepageOrder ||
            1
          )
          : "0",

      packType:
        product.packType ||
        "single",

      units:
        String(
          product.units ||
          1
        ),

      badge:
        product.badge ||
        "",

      category:
        product.category ||
        "Serum",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleImageChange(
    event:
      ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] ||
      null;

    if (!file) {
      return;
    }

    setImageFile(file);

    setImagePreview(
      URL.createObjectURL(
        file
      )
    );
  }



  async function uploadImage() {
    if (!imageFile) {
      return form.imageUrl;
    }

    const uploadData =
      new FormData();

    uploadData.append(
      "image",
      imageFile
    );

    const response =
      await fetch(
        "/api/admin/uploads",
        {
          method: "POST",
          body: uploadData,
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Image upload failed."
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


  async function uploadCustomImage(
    file: File | null,
    oldUrl: string
  ) {

    if (!file) {
      return oldUrl;
    }


    const uploadData =
      new FormData();


    uploadData.append(
      "image",
      file
    );


    const response =
      await fetch(
        "/api/admin/uploads",
        {
          method: "POST",
          body: uploadData,
        }
      );


    const data =
      await response.json();


    if (!response.ok) {
      throw new Error(
        data.message ||
        "Image upload failed"
      );
    }


    return (
      data.url ||
      data.imageUrl ||
      data.secure_url
    );
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);

    setMessage("");

    try {
      const uploadedImageUrl =
        await uploadImage();

      const uploadedBeforeImage =
        await uploadCustomImage(
          beforeImageFile,
          form.beforeAfter.beforeImage
        );


      const uploadedAfterImage =
        await uploadCustomImage(
          afterImageFile,
          form.beforeAfter.afterImage
        );


      const uploadedIngredients =
        await Promise.all(
          form.ingredients.map(
            async (ingredient, index) => {

              const file =
                ingredientImageFiles[index];

              let imageUrl =
                ingredient.image || "";


              if (file) {
                imageUrl =
                  await uploadCustomImage(
                    file,
                    imageUrl
                  );
              }


              return {
                name: ingredient.name,
                description: ingredient.description,
                image: imageUrl,
              };

            }
          )
        );

      const uploadedHowToUse =
        await Promise.all(
          form.howToUse.map(
            async (step, index) => {

              const file =
                howToUseImageFiles[index];

              let imageUrl =
                step.image || "";

              if (file) {
                imageUrl =
                  await uploadCustomImage(
                    file,
                    imageUrl
                  );
              }

              return {
                title: step.title,
                description: step.description,
                image: imageUrl,
              };
            }
          )
        );





      const payload = {
        ...(editingId
          ? {
            id: editingId,
          }
          : {}),

        name:
          form.name.trim(),

        shortDescription:
          form.shortDescription,

        description:
          form.description,

        price:
          Number(
            form.price
          ),

        compareAtPrice:
          form.compareAtPrice
            ? Number(
              form.compareAtPrice
            )
            : null,

        stock:
          Number(
            form.stock
          ),

        imageUrl:
          uploadedImageUrl,

        isActive:
          form.isActive,

        featured:
          form.featured,

        showOnHomepage:
          form.showOnHomepage,

        homepageOrder:
          form.showOnHomepage
            ? Number(
              form.homepageOrder
            )
            : 0,

        packType:
          form.packType,

        units:
          Number(
            form.units
          ),

        badge:
          form.badge,

        category:
          form.category.trim() ||
          "Serum",

        benefits:
          form.benefits
            .filter(
              (item) => item.trim() !== ""
            ),

        ingredients:
          uploadedIngredients.filter(
            (item) =>
              item.name.trim() !== "" ||
              item.description.trim() !== ""
          ),

        howToUse:
          uploadedHowToUse.filter(
            (item) =>
              item.title.trim() !== "" ||
              item.description.trim() !== ""
          ),

        story:
          form.story.trim(),


        beforeAfter: {
          beforeImage:
            uploadedBeforeImage,

          afterImage:
            uploadedAfterImage,

          description:
            form.beforeAfter.description,
        },
      };

      const response =
        await fetch(
          "/api/admin/products",
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
                payload
              ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
          "Unable to save product."
        );

        return;
      }

      resetForm();

      setMessage(
        editingId
          ? "Product updated successfully."
          : "Product created successfully."
      );

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

  /*
   * CLICK ACTIVE / HIDDEN
   *
   * No hard coding of product
   * information. Existing product
   * values are preserved.
   */

  async function toggleProductVisibility(
    product: Product
  ) {
    if (
      savingVisibilityId
    ) {
      return;
    }

    setSavingVisibilityId(
      product._id
    );

    setMessage("");

    try {
      const response =
        await fetch(
          "/api/admin/products",
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                id:
                  product._id,

                name:
                  product.name,

                category:
                  product.category ||
                  "Serum",

                shortDescription:
                  product.shortDescription ||
                  "",

                description:
                  product.description ||
                  "",

                price:
                  Number(
                    product.price
                  ),

                compareAtPrice:
                  product.compareAtPrice ??
                  null,

                stock:
                  Number(
                    product.stock
                  ),

                imageUrl:
                  product.images?.[0] ||
                  "",

                isActive:
                  !product.isActive,

                featured:
                  Boolean(
                    product.featured
                  ),

                showOnHomepage:
                  Boolean(
                    product.showOnHomepage
                  ),

                homepageOrder:
                  product.showOnHomepage
                    ? Number(
                      product.homepageOrder ||
                      0
                    )
                    : 0,

                packType:
                  product.packType ||
                  "single",

                units:
                  Number(
                    product.units ||
                    1
                  ),

                badge:
                  product.badge ||
                  "",
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
          "Unable to update product visibility."
        );

        return;
      }

      setProducts(
        (current) =>
          current.map(
            (item) =>
              item._id ===
                product._id
                ? {
                  ...item,
                  ...data.product,
                }
                : item
          )
      );

      setMessage(
        product.isActive
          ? "Product hidden from the store."
          : "Product is now visible on the store."
      );
    } catch {
      setMessage(
        "Unable to update product visibility."
      );
    } finally {
      setSavingVisibilityId(
        null
      );
    }
  }

  const counts =
    useMemo(() => {
      return {
        all:
          products.length,

        active:
          products.filter(
            (product) =>
              product.isActive
          ).length,

        hidden:
          products.filter(
            (product) =>
              !product.isActive
          ).length,

        featured:
          products.filter(
            (product) =>
              product.featured
          ).length,

        homepage:
          products.filter(
            (product) =>
              product.showOnHomepage
          ).length,

        lowStock:
          products.filter(
            (product) =>
              Number(
                product.stock
              ) <= 5
          ).length,

        stock:
          products.reduce(
            (
              total,
              product
            ) =>
              total +
              Number(
                product.stock ||
                0
              ),
            0
          ),
      };
    }, [products]);

  const normalizedSearch =
    search
      .trim()
      .toLowerCase();

  const filteredProducts =
    products.filter(
      (product) => {
        const matchesSearch =
          !normalizedSearch ||
          product.name
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          (
            product.slug ||
            ""
          )
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          (
            product.badge ||
            ""
          )
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          (
            product.shortDescription ||
            ""
          )
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          (
            product.category ||
            ""
          )
            .toLowerCase()
            .includes(
              normalizedSearch
            );

        let matchesFilter =
          true;

        if (
          productFilter ===
          "active"
        ) {
          matchesFilter =
            product.isActive;
        }

        if (
          productFilter ===
          "hidden"
        ) {
          matchesFilter =
            !product.isActive;
        }

        if (
          productFilter ===
          "featured"
        ) {
          matchesFilter =
            product.featured;
        }

        if (
          productFilter ===
          "low-stock"
        ) {
          matchesFilter =
            Number(
              product.stock
            ) <= 5;
        }

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );

  const hasActiveFilters =
    Boolean(
      normalizedSearch
    ) ||
    productFilter !== "all";

  function clearFilters() {
    setSearch("");

    setProductFilter(
      "all"
    );
  }

  /*
   * HOMEPAGE SELECTION
   *
   * Maximum 3 selected products.
   * Current edited product is excluded
   * while checking occupied slots.
   */

  const homepageProductsExcludingCurrent =
    products.filter(
      (product) =>
        product.showOnHomepage &&
        product._id !== editingId
    );

  const homepageSelectionLocked =
    !form.showOnHomepage &&
    homepageProductsExcludingCurrent.length >=
    3;

  const usedHomepageOrders =
    new Set(
      homepageProductsExcludingCurrent.map(
        (product) =>
          Number(
            product.homepageOrder ||
            0
          )
      )
    );

  function handleHomepageToggle(
    checked: boolean
  ) {
    if (!checked) {
      setForm(
        (current) => ({
          ...current,

          showOnHomepage:
            false,

          homepageOrder:
            "0",
        })
      );

      return;
    }

    const firstAvailableOrder =
      [1, 2, 3].find(
        (position) =>
          !usedHomepageOrders.has(
            position
          )
      );

    if (
      !firstAvailableOrder
    ) {
      setMessage(
        "Homepage already has 3 selected products. Edit one of them and remove it from the homepage first."
      );

      return;
    }

    setMessage("");

    setForm(
      (current) => ({
        ...current,

        showOnHomepage:
          true,

        homepageOrder:
          String(
            firstAvailableOrder
          ),
      })
    );
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1540px] p-4 sm:p-6 lg:p-10">

        {/* HEADER */}

        <header className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a9a86]">
              Catalogue
              Management
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Products
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#68716d]">
              Manage ORINOCA
              NATURAL products,
              categories, pack
              sizes, pricing,
              images and stock.
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

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5 shadow-[0_10px_35px_rgba(18,53,41,0.04)]">
            <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
              Total Products
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {counts.all}
            </p>
          </article>


          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5 shadow-[0_10px_35px_rgba(18,53,41,0.04)]">
            <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
              Active Products
            </p>

            <p className="mt-3 text-3xl font-semibold text-[#0b6a50]">
              {counts.active}
            </p>
          </article>


          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5 shadow-[0_10px_35px_rgba(18,53,41,0.04)]">
            <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
              Total Stock
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {counts.stock}
            </p>

            <p className="mt-1 text-xs text-[#929a96]">
              {counts.featured}{" "}
              featured
            </p>
          </article>


          <article
            className={`rounded-[22px] border p-5 shadow-[0_10px_35px_rgba(18,53,41,0.04)] ${counts.lowStock >
              0
              ? "border-amber-200 bg-[#fffaf0]"
              : "border-[#123529]/10 bg-white"
              }`}
          >
            <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
              Low Stock
            </p>

            <p
              className={`mt-3 text-3xl font-semibold ${counts.lowStock >
                0
                ? "text-[#a36d00]"
                : "text-[#0b6a50]"
                }`}
            >
              {counts.lowStock}
            </p>

            <p className="mt-1 text-xs text-[#929a96]">
              5 units or less
            </p>
          </article>

        </section>


        {message ? (
          <div className="mt-6 rounded-2xl border border-[#d4af37]/25 bg-[#fffaf0] px-5 py-4 text-sm font-medium text-[#765a18]">
            {message}
          </div>
        ) : null}


        <div className="mt-6 grid gap-6 2xl:grid-cols-[0.88fr_1.12fr]">

          {/* PRODUCT EDITOR */}

          <form
            onSubmit={
              handleSubmit
            }
            className="overflow-hidden rounded-[26px] border border-[#123529]/10 bg-white shadow-[0_16px_50px_rgba(18,53,41,0.05)]"
          >

            <div className="flex items-center justify-between border-b border-[#123529]/10 bg-[#fbfaf6] px-5 py-5 sm:px-6">

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
                  Product Editor
                </p>

                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">
                  {editingId
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>
              </div>


              {editingId ? (
                <button
                  type="button"
                  onClick={
                    resetForm
                  }
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
                      Product
                      Configuration
                    </h3>

                    <p className="text-xs text-[#8a938f]">
                      Category,
                      pack and
                      catalogue
                      details
                    </p>
                  </div>

                </div>


                <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                  Category

                  <input
                    required
                    value={
                      form.category
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "category",
                        event.target
                          .value
                      )
                    }
                    placeholder="e.g. Serum, Face Care, Hair Care"
                    className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal normal-case tracking-normal outline-none transition placeholder:text-[#a6aca9] focus:border-[#1b4d3e] focus:bg-white focus:ring-4 focus:ring-[#1b4d3e]/5"
                  />
                </label>


                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                  <label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                    Pack Type

                    <select
                      value={
                        form.packType
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "packType",
                          event.target
                            .value
                        )
                      }
                      className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal normal-case tracking-normal outline-none"
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
                    Units in Pack

                    <input
                      required
                      type="number"
                      min="1"
                      max="20"
                      value={
                        form.units
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "units",
                          event.target
                            .value
                        )
                      }
                      className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal tracking-normal outline-none"
                    />
                  </label>

                </div>


                <div className="mt-4 space-y-4">

                  <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                    Product Name

                    <input
                      required
                      value={
                        form.name
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "name",
                          event.target
                            .value
                        )
                      }
                      placeholder="Enter product name"
                      className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal normal-case tracking-normal outline-none"
                    />
                  </label>


                  <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                    Product Badge

                    <input
                      value={
                        form.badge
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "badge",
                          event.target
                            .value
                        )
                      }
                      placeholder="e.g. BEST VALUE"
                      className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal normal-case tracking-normal outline-none"
                    />
                  </label>


                  <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                    Short
                    Description

                    <input
                      value={
                        form.shortDescription
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "shortDescription",
                          event.target
                            .value
                        )
                      }
                      placeholder="Short product description"
                      className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal normal-case tracking-normal outline-none"
                    />
                  </label>


                  <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                    Full Description

                    <textarea
                      value={
                        form.description
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "description",
                          event.target
                            .value
                        )
                      }
                      rows={4}
                      placeholder="Write the full product description..."
                      className="mt-2 w-full resize-none rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal normal-case leading-6 tracking-normal outline-none"
                    />
                  </label>

                  {/* PRODUCT DETAILS */}

                  <section className="mt-6 space-y-5">

                    <div>
                      <h3 className="text-sm font-semibold text-[#123529]">
                        Product Benefits
                      </h3>

                      <p className="mt-1 text-xs text-[#8a938f]">
                        Add key benefits of this product.
                      </p>
                    </div>


                    <div className="space-y-3">

                      {form.benefits.map(
                        (benefit, index) => (
                          <div
                            key={index}
                            className="flex gap-3"
                          >

                            <input
                              value={benefit}
                              onChange={(event) => {

                                const updated =
                                  [...form.benefits];

                                updated[index] =
                                  event.target.value;

                                setForm({
                                  ...form,
                                  benefits: updated,
                                });

                              }}
                              placeholder={`Benefit ${index + 1}`}
                              className="w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3 text-sm outline-none focus:border-[#073c31]"
                            />


                            {form.benefits.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {

                                  setForm({
                                    ...form,

                                    benefits:
                                      form.benefits.filter(
                                        (_, i) =>
                                          i !== index
                                      ),
                                  });

                                }}
                                className="rounded-xl border border-red-200 px-4 text-xs font-semibold text-red-600"
                              >
                                Remove
                              </button>
                            )}

                          </div>
                        )
                      )}

                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,

                          benefits: [
                            ...form.benefits,
                            "",
                          ],
                        })
                      }
                      className="rounded-xl bg-[#edf3ef] px-4 py-2 text-xs font-semibold text-[#073c31]"
                    >
                      + Add Benefit
                    </button>


                  </section>



                  <section className="mt-8 space-y-5">

                    <div>
                      <h3 className="text-sm font-semibold text-[#123529]">
                        Ingredients
                      </h3>

                      <p className="mt-1 text-xs text-[#8a938f]">
                        Add ingredient name and description.
                      </p>
                    </div>


                    {form.ingredients.map(
                      (ingredient, index) => (

                        <div
                          key={index}
                          className="rounded-2xl border border-[#123529]/10 bg-[#fbfaf7] p-4 space-y-3"
                        >

                          <input
                            value={ingredient.name}
                            onChange={(event) => {

                              const updated = [...form.ingredients];

                              updated[index].name = event.target.value;

                              setForm({
                                ...form,
                                ingredients: updated,
                              });

                            }}
                            placeholder="Ingredient name"
                            className="w-full rounded-xl border border-[#123529]/15 bg-white px-4 py-3 text-sm outline-none"
                          />


                          <textarea
                            value={ingredient.description}
                            onChange={(event) => {

                              const updated = [...form.ingredients];

                              updated[index].description = event.target.value;

                              setForm({
                                ...form,
                                ingredients: updated,
                              });

                            }}
                            placeholder="Ingredient description"
                            rows={3}
                            className="w-full rounded-xl border border-[#123529]/15 bg-white px-4 py-3 text-sm outline-none"
                          />


                          {/* IMAGE TEMP FIELD - upload later */}
                          <label className="block cursor-pointer rounded-xl border border-dashed border-[#123529]/20 bg-white p-4">

                            <span className="text-xs font-semibold text-[#66706c]">
                              Ingredient Image
                            </span>

                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              onChange={(event) => {

                                const file =
                                  event.target.files?.[0] || null;

                                if (!file) return;


                                setIngredientImageFiles({
                                  ...ingredientImageFiles,
                                  [index]: file,
                                });


                                const updated =
                                  [...form.ingredients];

                                updated[index].image =
                                  URL.createObjectURL(file);


                                setForm({
                                  ...form,
                                  ingredients: updated,
                                });

                              }}
                              className="mt-3 w-full text-xs"
                            />


                            {ingredient.image ? (
                              <img
                                src={ingredient.image}
                                alt="Ingredient preview"
                                className="
      mt-3
      h-24
      w-24
      rounded-xl
      object-cover
      "
                              />
                            ) : null}

                          </label>


                        </div>

                      )
                    )}


                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,

                          ingredients: [
                            ...form.ingredients,
                            {
                              name: "",
                              description: "",
                              image: "",
                            }
                          ],
                        })
                      }
                      className="rounded-xl bg-[#edf3ef] px-4 py-2 text-xs font-semibold text-[#073c31]"
                    >
                      + Add Ingredient
                    </button>

                  </section>



                  <section className="mt-8 space-y-5">

                    <div>
                      <h3 className="text-sm font-semibold text-[#123529]">
                        How To Use
                      </h3>
                    </div>


                    {form.howToUse.map(
                      (step, index) => (

                        <div
                          key={index}
                          className="rounded-2xl border border-[#123529]/10 bg-[#fbfaf7] p-4 space-y-3"
                        >

                          <input
                            value={step.title}
                            onChange={(event) => {

                              const updated = [...form.howToUse];

                              updated[index].title =
                                event.target.value;

                              setForm({
                                ...form,
                                howToUse: updated,
                              });

                            }}
                            placeholder={`Step ${index + 1} Title`}
                            className="w-full rounded-xl border border-[#123529]/15 bg-white px-4 py-3 text-sm outline-none"
                          />


                          <textarea
                            value={step.description}
                            onChange={(event) => {

                              const updated = [...form.howToUse];

                              updated[index].description =
                                event.target.value;

                              setForm({
                                ...form,
                                howToUse: updated,
                              });

                            }}
                            placeholder="Step description"
                            rows={3}
                            className="w-full rounded-xl border border-[#123529]/15 bg-white px-4 py-3 text-sm outline-none"
                          />


                          <label className="block cursor-pointer rounded-xl border border-dashed border-[#123529]/20 bg-white p-4 transition hover:border-[#073c31]/40">

                            <span className="text-xs font-semibold text-[#66706c]">
                              Step Image
                            </span>

                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              onChange={(event) => {

                                const file =
                                  event.target.files?.[0] || null;

                                if (!file) return;

                                setHowToUseImageFiles({
                                  ...howToUseImageFiles,
                                  [index]: file,
                                });

                                const updated =
                                  [...form.howToUse];

                                updated[index].image =
                                  URL.createObjectURL(file);

                                setForm({
                                  ...form,
                                  howToUse: updated,
                                });

                              }}
                              className="mt-3 w-full text-xs text-[#65706b] file:mr-3 file:rounded-xl file:border-0 file:bg-[#073c31] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
                            />

                            <p className="mt-2 text-[11px] text-[#909894]">
                              PNG, JPG or WEBP
                            </p>

                            {step.image ? (
                              <div className="mt-3 overflow-hidden rounded-xl border border-[#123529]/10 bg-[#fbfaf7]">
                                <img
                                  src={step.image}
                                  alt={`Step ${index + 1} preview`}
                                  className="h-32 w-full object-cover"
                                />
                              </div>
                            ) : null}

                          </label>

                        </div>

                      )
                    )}


                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          howToUse: [
                            ...form.howToUse,
                            {
                              title: "",
                              description: "",
                              image: "",
                            },
                          ],
                        })
                      }
                      className="rounded-xl bg-[#edf3ef] px-4 py-2 text-xs font-semibold text-[#073c31]"
                    >
                      + Add Step
                    </button>

                  </section>



                  <section className="mt-8">

                    <h3 className="text-sm font-semibold text-[#123529]">
                      Our Story
                    </h3>

                    <textarea
                      value={form.story}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          story: event.target.value,
                        })
                      }
                      rows={5}
                      placeholder="Write product story..."
                      className="mt-3 w-full resize-none rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3 text-sm outline-none"
                    />

                  </section>

                  {/* BEFORE & AFTER RESULT */}

                  <section className="mt-8 space-y-5">

                    <div>
                      <h3 className="text-sm font-semibold text-[#123529]">
                        Before & After Result
                      </h3>

                      <p className="mt-1 text-xs text-[#8a938f]">
                        Add product result images and description.
                      </p>
                    </div>


                    <div className="grid gap-4 sm:grid-cols-2">

                      <div>
                        <label className="text-xs font-semibold text-[#66706c]">
                          Before Image
                        </label>

                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(event) => {
                            const file =
                              event.target.files?.[0] || null;

                            if (file) {
                              setBeforeImageFile(file);

                              setBeforeImagePreview(
                                URL.createObjectURL(file)
                              );
                            }
                          }}
                          className="mt-2 w-full text-xs"
                        />


                        {beforeImagePreview && (
                          <img
                            src={beforeImagePreview}
                            alt="Before preview"
                            className="mt-3 h-32 w-full rounded-xl object-cover"
                          />
                        )}
                      </div>


                      <div>
                        <label className="text-xs font-semibold text-[#66706c]">
                          After Image
                        </label>

                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(event) => {
                            const file =
                              event.target.files?.[0] || null;

                            if (file) {
                              setAfterImageFile(file);

                              setAfterImagePreview(
                                URL.createObjectURL(file)
                              );
                            }
                          }}
                          className="mt-2 w-full text-xs"
                        />


                        {afterImagePreview && (
                          <img
                            src={afterImagePreview}
                            alt="After preview"
                            className="mt-3 h-32 w-full rounded-xl object-cover"
                          />
                        )}
                      </div>

                    </div>


                    <div>

                      <label className="text-xs font-semibold text-[#66706c]">
                        Result Description
                      </label>

                      <textarea
                        value={
                          form.beforeAfter?.description || ""
                        }
                        onChange={(event) =>
                          setForm({
                            ...form,

                            beforeAfter: {
                              ...form.beforeAfter,

                              description:
                                event.target.value,
                            },
                          })
                        }
                        rows={3}
                        placeholder="Describe visible results..."
                        className="mt-2 w-full resize-none rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3 text-sm outline-none"
                      />

                    </div>

                  </section>

                </div>

              </section>


              <div className="h-px bg-[#123529]/8" />


              {/* PRICE */}

              <section>

                <div className="mb-4 flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff5d9] text-[#987117]">
                    <PriceIcon />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Pricing &
                      Inventory
                    </h3>

                    <p className="text-xs text-[#8a938f]">
                      Price and
                      stock
                      management
                    </p>
                  </div>

                </div>


                <div className="grid gap-4 sm:grid-cols-2">

                  <label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                    Sale Price
                    (PKR)

                    <input
                      required
                      type="number"
                      min="0"
                      value={
                        form.price
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "price",
                          event.target
                            .value
                        )
                      }
                      className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal tracking-normal outline-none"
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
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "compareAtPrice",
                          event.target
                            .value
                        )
                      }
                      className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal tracking-normal outline-none"
                    />
                  </label>

                </div>


                <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.08em] text-[#66706c]">
                  Stock Quantity

                  <input
                    required
                    type="number"
                    min="0"
                    value={
                      form.stock
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "stock",
                        event.target
                          .value
                      )
                    }
                    className="mt-2 w-full rounded-2xl border border-[#123529]/15 bg-[#fbfaf7] px-4 py-3.5 text-sm font-normal tracking-normal outline-none"
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
                      Upload product
                      imagery
                    </p>
                  </div>

                </div>


                <label className="block cursor-pointer rounded-[20px] border border-dashed border-[#123529]/20 bg-[#fbfaf7] p-5 transition hover:border-[#d4af37]/60">

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={
                      handleImageChange
                    }
                    className="block w-full text-xs text-[#65706b] file:mr-4 file:rounded-xl file:border-0 file:bg-[#073c31] file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-white"
                  />

                  <p className="mt-3 text-xs text-[#909894]">
                    PNG, JPG or
                    WEBP.
                  </p>

                </label>


                {imagePreview ? (
                  <div className="mt-4 flex items-center gap-4 rounded-[20px] border border-[#123529]/10 bg-[#f6f3eb] p-4">

                    <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white">

                      <img
                        src={
                          imagePreview
                        }
                        alt="Product preview"
                        className="h-full w-full object-contain p-2"
                      />

                    </div>


                    <div>
                      <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
                        Preview
                      </p>

                      <p className="mt-2 text-lg font-semibold">
                        {form.name ||
                          "Product"}
                      </p>

                      <p className="mt-1 text-xs text-[#79827e]">
                        {
                          form.category
                        }
                      </p>
                    </div>

                  </div>
                ) : null}

              </section>


              {/* TOGGLES */}

              <section className="grid gap-3 sm:grid-cols-2">

                {/* STORE VISIBILITY */}

                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#123529]/10 bg-[#fbfaf7] p-4">

                  <div>
                    <p className="text-sm font-semibold">
                      Store Visibility
                    </p>

                    <p className="mt-1 text-xs text-[#8a938f]">
                      Show product
                      publicly
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
                      updateField(
                        "isActive",
                        event.target
                          .checked
                      )
                    }
                    className="h-5 w-5 accent-[#073c31]"
                  />

                </label>


                {/* FEATURED */}

                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#123529]/10 bg-[#fbfaf7] p-4">

                  <div>
                    <p className="text-sm font-semibold">
                      Featured
                    </p>

                    <p className="mt-1 text-xs text-[#8a938f]">
                      Highlight
                      this product
                    </p>
                  </div>


                  <input
                    type="checkbox"
                    checked={
                      form.featured
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "featured",
                        event.target
                          .checked
                      )
                    }
                    className="h-5 w-5 accent-[#d4af37]"
                  />

                </label>


                {/* SHOW ON HOMEPAGE */}

                <label
                  className={`flex items-center justify-between gap-4 rounded-2xl border border-[#123529]/10 bg-[#fbfaf7] p-4 ${homepageSelectionLocked
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"
                    }`}
                >

                  <div>
                    <p className="text-sm font-semibold">
                      Show on Homepage
                    </p>

                    <p className="mt-1 text-xs text-[#8a938f]">
                      Add to homepage
                      collection
                    </p>
                  </div>


                  <input
                    type="checkbox"
                    checked={
                      form.showOnHomepage
                    }
                    disabled={
                      homepageSelectionLocked
                    }
                    onChange={(
                      event
                    ) =>
                      handleHomepageToggle(
                        event.target
                          .checked
                      )
                    }
                    className="h-5 w-5 accent-[#073c31] disabled:cursor-not-allowed"
                  />

                </label>


                {/* HOMEPAGE POSITION */}

                <div
                  className={`rounded-2xl border border-[#123529]/10 bg-[#fbfaf7] p-4 ${!form.showOnHomepage
                    ? "opacity-60"
                    : ""
                    }`}
                >

                  <div className="flex items-center justify-between gap-4">

                    <div>
                      <p className="text-sm font-semibold">
                        Homepage Position
                      </p>

                      <p className="mt-1 text-xs text-[#8a938f]">
                        Choose slot 1, 2
                        or 3
                      </p>
                    </div>


                    <select
                      value={
                        form.homepageOrder
                      }
                      disabled={
                        !form.showOnHomepage
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "homepageOrder",
                          event.target
                            .value
                        )
                      }
                      className="w-[88px] rounded-xl border border-[#123529]/15 bg-white px-3 py-2.5 text-sm font-semibold text-[#073c31] outline-none disabled:cursor-not-allowed"
                    >

                      <option
                        value="0"
                        disabled
                      >
                        —
                      </option>


                      {[1, 2, 3].map(
                        (
                          position
                        ) => (
                          <option
                            key={
                              position
                            }
                            value={
                              position
                            }
                            disabled={
                              usedHomepageOrders.has(
                                position
                              )
                            }
                          >
                            {position}
                          </option>
                        )
                      )}

                    </select>

                  </div>
                </div>


                {/* HOMEPAGE LIMIT INFO */}

                <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#d4af37]/20 bg-[#fffaf0] px-4 py-3">

                  <p className="text-xs leading-5 text-[#765a18]">
                    Homepage shows a maximum of 3 selected products. Shop page can still contain all products.
                  </p>


                  <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-[#765a18] shadow-sm">
                    {counts.homepage}/3 selected
                  </span>

                </div>

              </section>


              <button
                type="submit"
                disabled={
                  saving
                }
                className="w-full rounded-2xl bg-[#073c31] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(7,60,49,0.16)] transition hover:bg-[#123529] disabled:opacity-60"
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

            <div className="border-b border-[#123529]/10 bg-[#fbfaf6] px-5 py-5 sm:px-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
                    Catalogue
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">
                    All Products
                  </h2>
                </div>


                <span className="rounded-full bg-[#edf3ef] px-3 py-1.5 text-xs font-semibold text-[#073c31]">
                  {
                    filteredProducts.length
                  }{" "}
                  Products
                </span>

              </div>


              {/* SEARCH */}

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
                      event.target
                        .value
                    )
                  }
                  placeholder="Search products or categories..."
                  className="w-full rounded-2xl border border-[#123529]/12 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#a1a7a4] focus:border-[#073c31] focus:ring-4 focus:ring-[#073c31]/5"
                />

              </div>


              {/* PROFESSIONAL FILTERS */}

              <div className="mt-4 flex flex-wrap gap-2">

                {filterOptions.map(
                  (
                    filter
                  ) => {
                    const count =
                      filter.value ===
                        "all"
                        ? counts.all
                        : filter.value ===
                          "active"
                          ? counts.active
                          : filter.value ===
                            "hidden"
                            ? counts.hidden
                            : filter.value ===
                              "featured"
                              ? counts.featured
                              : counts.lowStock;

                    const active =
                      productFilter ===
                      filter.value;

                    return (
                      <button
                        key={
                          filter.value
                        }
                        type="button"
                        onClick={() =>
                          setProductFilter(
                            filter.value
                          )
                        }
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold transition-all ${active
                          ? "border-[#073c31] bg-[#073c31] text-white shadow-[0_7px_18px_rgba(7,60,49,0.14)]"
                          : "border-[#123529]/12 bg-white text-[#53625d] hover:border-[#073c31]/30 hover:bg-[#f4f8f6] hover:text-[#073c31]"
                          }`}
                      >
                        {
                          filter.label
                        }


                        <span
                          className={`grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[9px] ${active
                            ? "bg-white/15 text-white"
                            : "bg-[#edf3ef] text-[#68716d]"
                            }`}
                        >
                          {count}
                        </span>

                      </button>
                    );
                  }
                )}


                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                    className="rounded-full px-3 py-2.5 text-xs font-semibold text-[#8a938f] transition hover:text-[#073c31]"
                  >
                    Reset
                  </button>
                ) : null}

              </div>


              <p className="mt-4 border-t border-[#123529]/8 pt-3 text-xs text-[#7d8581]">

                Showing{" "}

                <strong className="text-[#123529]">
                  {
                    filteredProducts.length
                  }
                </strong>{" "}

                of{" "}

                <strong className="text-[#123529]">
                  {
                    products.length
                  }
                </strong>

              </p>

            </div>


            {/* PRODUCT CARDS */}

            <div className="p-4 sm:p-5">

              {loadingProducts ? (

                <div className="rounded-2xl bg-[#fbfaf7] p-8 text-center text-sm text-[#8a938f]">
                  Loading
                  products...
                </div>

              ) : filteredProducts.length ===
                0 ? (

                <div className="rounded-[22px] border border-dashed border-[#123529]/15 bg-[#fbfaf7] p-10 text-center">

                  <h3 className="text-xl font-semibold">
                    No matching
                    products
                  </h3>


                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                    className="mt-5 rounded-xl bg-[#073c31] px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Clear Filters
                  </button>

                </div>

              ) : (

                <div className="space-y-3">

                  {filteredProducts.map(
                    (
                      product
                    ) => {

                      const lowStock =
                        Number(
                          product.stock
                        ) <= 5;

                      const outOfStock =
                        Number(
                          product.stock
                        ) <= 0;


                      return (

                        <article
                          key={
                            product._id
                          }
                          className={`rounded-[20px] border p-4 transition hover:shadow-[0_12px_30px_rgba(18,53,41,0.06)] ${outOfStock
                            ? "border-red-200 bg-red-50/30"
                            : lowStock
                              ? "border-amber-200 bg-[#fffaf0]"
                              : "border-[#123529]/10 bg-[#fbfaf7]"
                            }`}
                        >

                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


                            <div className="flex min-w-0 items-center gap-4">

                              {product
                                .images?.[0] ? (

                                <div className="h-[78px] w-[78px] shrink-0 overflow-hidden rounded-2xl border border-[#123529]/8 bg-white">

                                  <img
                                    src={
                                      product
                                        .images[0]
                                    }
                                    alt={
                                      product.name
                                    }
                                    className="h-full w-full object-cover"
                                  />

                                </div>

                              ) : (

                                <div className="grid h-[78px] w-[78px] shrink-0 place-items-center rounded-2xl bg-[#edf3ef] text-xs font-semibold text-[#073c31]">
                                  ON
                                </div>

                              )}


                              <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-2">

                                  <h3 className="break-words text-lg font-semibold tracking-[-0.02em]">
                                    {
                                      product.name
                                    }
                                  </h3>


                                  {product.featured ? (

                                    <span className="rounded-full bg-[#fff4d1] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#987117]">
                                      Featured
                                    </span>

                                  ) : null}


                                  {product.showOnHomepage ? (

                                    <span className="rounded-full border border-[#b9d7cb] bg-[#edf7f3] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#0b6a50]">
                                      Homepage #{product.homepageOrder || "—"}
                                    </span>

                                  ) : null}


                                  {outOfStock ? (

                                    <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[9px] font-bold uppercase text-red-700">
                                      Out of
                                      Stock
                                    </span>

                                  ) : lowStock ? (

                                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase text-amber-700">
                                      Low Stock
                                    </span>

                                  ) : null}

                                </div>


                                <p className="mt-2 text-sm font-semibold text-[#073c31]">
                                  Rs.{" "}
                                  {product.price.toLocaleString()}
                                </p>


                                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#828b87]">

                                  <span
                                    className={
                                      lowStock
                                        ? "font-semibold text-amber-700"
                                        : ""
                                    }
                                  >
                                    Stock:{" "}
                                    {
                                      product.stock
                                    }
                                  </span>


                                  <span>•</span>


                                  <span>
                                    {product.category ||
                                      "Uncategorised"}
                                  </span>


                                  <span>•</span>


                                  <span>
                                    {product.packType ===
                                      "twin"
                                      ? "Twin Pack"
                                      : product.packType ===
                                        "family"
                                        ? "Family Pack"
                                        : "Single Item"}
                                  </span>


                                  <span>•</span>


                                  <span>
                                    {product.units ||
                                      1}{" "}
                                    unit
                                    {(product.units ||
                                      1) > 1
                                      ? "s"
                                      : ""}
                                  </span>

                                </div>


                                {product.badge ? (

                                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9a741a]">
                                    {
                                      product.badge
                                    }
                                  </p>

                                ) : null}

                              </div>

                            </div>


                            <div className="flex items-center gap-2 sm:shrink-0">

                              {/* ACTIVE / HIDDEN CLICKABLE */}

                              <button
                                type="button"
                                disabled={
                                  savingVisibilityId ===
                                  product._id
                                }
                                onClick={() =>
                                  toggleProductVisibility(
                                    product
                                  )
                                }
                                className={`inline-flex min-w-[78px] items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-[10px] font-semibold transition ${product.isActive
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  : "border-neutral-200 bg-neutral-100 text-neutral-600 hover:bg-[#edf3ef] hover:text-[#073c31]"
                                  }`}
                              >

                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${product.isActive
                                    ? "bg-emerald-500"
                                    : "bg-neutral-400"
                                    }`}
                                />


                                {savingVisibilityId ===
                                  product._id
                                  ? "Saving"
                                  : product.isActive
                                    ? "Active"
                                    : "Hidden"}

                              </button>


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
                      );
                    }
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