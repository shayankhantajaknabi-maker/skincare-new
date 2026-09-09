"use client";

import Link from "next/link";
import {
  FormEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

type CategoryOption = {
  name: string;
  slug: string;
};

type StoreFiltersProps = {
  availability: string;
  minPrice: string;
  maxPrice: string;
  sort: string;

  productCount: number;
  totalProductCount: number;

  highestPrice: number;

  inStockCount: number;
  outOfStockCount: number;

  categories: CategoryOption[];

  currentCategorySlug?: string;
};

type SliderProps = {
  minValue: number;
  maxValue: number;
  scaleMax: number;

  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
};

const sortOptions = [
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "price-asc",
    label: "Price: Low to High",
  },
  {
    value: "price-desc",
    label: "Price: High to Low",
  },
  {
    value: "name-asc",
    label: "Name: A–Z",
  },
];

function clamp(
  value: number,
  minimum: number,
  maximum: number
) {
  return Math.min(
    Math.max(value, minimum),
    maximum
  );
}

function formatPrice(
  value: number
) {
  return `Rs. ${Math.round(
    Number(value || 0)
  ).toLocaleString("en-PK")}`;
}

function Chevron({
  open,
}: {
  open: boolean;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
        open
          ? "rotate-180"
          : ""
      }`}
      aria-hidden="true"
    >
      <path d="m6 8 4 4 4-4" />
    </svg>
  );
}

/*
  REAL POINTER-BASED DUAL PRICE SLIDER

  IMPORTANT:
  Each slider instance owns its own ref,
  so the top Price popup and the Filters
  drawer never interfere with each other.
*/
function PriceSlider({
  minValue,
  maxValue,
  scaleMax,
  onMinChange,
  onMaxChange,
}: SliderProps) {
  const trackRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const [
    activeHandle,
    setActiveHandle,
  ] = useState<
    "min" | "max" | null
  >(null);

  const safeScaleMax =
    Math.max(
      1,
      Number(scaleMax || 1)
    );

  const safeMin =
    clamp(
      minValue,
      0,
      safeScaleMax
    );

  const safeMax =
    clamp(
      maxValue,
      0,
      safeScaleMax
    );

  const minPercent =
    clamp(
      (safeMin /
        safeScaleMax) *
        100,
      0,
      100
    );

  const maxPercent =
    clamp(
      (safeMax /
        safeScaleMax) *
        100,
      0,
      100
    );

  function getValueFromPointer(
    clientX: number
  ) {
    const track =
      trackRef.current;

    if (!track) {
      return 0;
    }

    const rect =
      track.getBoundingClientRect();

    if (
      rect.width <= 0
    ) {
      return 0;
    }

    const x =
      clamp(
        clientX -
          rect.left,
        0,
        rect.width
      );

    const ratio =
      x /
      rect.width;

    /*
      Fully proportional to actual
      mouse/finger position.

      Example:
      scaleMax = 5000

      100% = 5000
      80%  = 4000
      50%  = 2500
      20%  = 1000
    */
    return Math.round(
      ratio *
        safeScaleMax
    );
  }

  function updateHandle(
    clientX: number,
    handle:
      "min" | "max"
  ) {
    const value =
      getValueFromPointer(
        clientX
      );

    if (
      handle === "min"
    ) {
      onMinChange(
        clamp(
          value,
          0,
          maxValue
        )
      );

      return;
    }

    onMaxChange(
      clamp(
        value,
        minValue,
        safeScaleMax
      )
    );
  }

  function handlePointerDown(
    event:
      ReactPointerEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    const clickedValue =
      getValueFromPointer(
        event.clientX
      );

    const distanceToMin =
      Math.abs(
        clickedValue -
          minValue
      );

    const distanceToMax =
      Math.abs(
        clickedValue -
          maxValue
      );

    let handle:
      "min" | "max";

    /*
      If both handles overlap,
      decide from click direction.
    */
    if (
      minValue ===
      maxValue
    ) {
      handle =
        clickedValue >=
        maxValue
          ? "max"
          : "min";
    } else {
      handle =
        distanceToMin <=
        distanceToMax
          ? "min"
          : "max";
    }

    setActiveHandle(
      handle
    );

    event.currentTarget
      .setPointerCapture(
        event.pointerId
      );

    updateHandle(
      event.clientX,
      handle
    );
  }

  function handlePointerMove(
    event:
      ReactPointerEvent<HTMLDivElement>
  ) {
    if (
      !activeHandle
    ) {
      return;
    }

    event.preventDefault();

    updateHandle(
      event.clientX,
      activeHandle
    );
  }

  function stopPointer(
    event:
      ReactPointerEvent<HTMLDivElement>
  ) {
    if (
      event.currentTarget
        .hasPointerCapture(
          event.pointerId
        )
    ) {
      event.currentTarget
        .releasePointerCapture(
          event.pointerId
        );
    }

    setActiveHandle(
      null
    );
  }

  return (
    <div>
      <div
        ref={trackRef}
        onPointerDown={
          handlePointerDown
        }
        onPointerMove={
          handlePointerMove
        }
        onPointerUp={
          stopPointer
        }
        onPointerCancel={
          stopPointer
        }
        className="relative h-9 cursor-ew-resize touch-none select-none"
      >
        {/* FULL TRACK */}

        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-[#dce5e0]" />

        {/* ACTIVE RANGE */}

        <div
          className="pointer-events-none absolute top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-[#08745a]"
          style={{
            left:
              `${minPercent}%`,

            right:
              `${
                100 -
                maxPercent
              }%`,
          }}
        />

        {/* MIN HANDLE */}

        <div
          className={`pointer-events-none absolute top-1/2 z-10 h-[19px] w-[19px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#08745a] shadow-[0_2px_9px_rgba(18,53,41,0.32)] transition-transform duration-100 ${
            activeHandle ===
            "min"
              ? "scale-125"
              : ""
          }`}
          style={{
            left:
              `${minPercent}%`,
          }}
        />

        {/* MAX HANDLE */}

        <div
          className={`pointer-events-none absolute top-1/2 z-10 h-[19px] w-[19px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#08745a] shadow-[0_2px_9px_rgba(18,53,41,0.32)] transition-transform duration-100 ${
            activeHandle ===
            "max"
              ? "scale-125"
              : ""
          }`}
          style={{
            left:
              `${maxPercent}%`,
          }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] font-medium text-[#7f8984]">
        <span>
          {formatPrice(
            minValue
          )}
        </span>

        <span>
          {formatPrice(
            maxValue
          )}
        </span>
      </div>
    </div>
  );
}

export default function StoreFilters({
  availability,
  minPrice,
  maxPrice,
  sort,
  productCount,
  totalProductCount,
  highestPrice,
  inStockCount,
  outOfStockCount,
  categories,
  currentCategorySlug,
}: StoreFiltersProps) {
  const router =
    useRouter();

  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();

  const availabilityRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const priceRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const sortRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const [
    drawerOpen,
    setDrawerOpen,
  ] = useState(false);

  const [
    availabilityOpen,
    setAvailabilityOpen,
  ] = useState(false);

  const [
    priceOpen,
    setPriceOpen,
  ] = useState(false);

  const [
    sortOpen,
    setSortOpen,
  ] = useState(false);

  /*
    Highest actual product price.

    Example:
    Current catalogue max = Rs. 800
  */
  const actualHighestPrice =
    Math.max(
      1,
      Math.ceil(
        Number(
          highestPrice ||
            0
        )
      )
    );

  const [
    localAvailability,
    setLocalAvailability,
  ] = useState(
    availability ||
      "all"
  );

  const [
    sliderMin,
    setSliderMin,
  ] = useState(0);

  const [
    sliderMax,
    setSliderMax,
  ] = useState(
    actualHighestPrice
  );

  /*
    THIS IS THE IMPORTANT FIX.

    Slider scale is an independent,
    stable value.

    If user enters 5000:

    priceScaleMax = 5000

    Then dragging right handle to 3000
    DOES NOT turn the scale into 3000.

    Scale stays 5000.
  */
  const [
    priceScaleMax,
    setPriceScaleMax,
  ] = useState(
    actualHighestPrice
  );

  const [
    fromPrice,
    setFromPrice,
  ] = useState("");

  const [
    toPrice,
    setToPrice,
  ] = useState("");

  /*
    Sync URL values into controls.
  */
  useEffect(() => {
    const urlMin =
      minPrice !== ""
        ? Math.max(
            0,
            Number(
              minPrice
            ) || 0
          )
        : 0;

    const urlMax =
      maxPrice !== ""
        ? Math.max(
            0,
            Number(
              maxPrice
            ) || 0
          )
        : actualHighestPrice;

    const safeMin =
      Math.min(
        urlMin,
        urlMax
      );

    const safeMax =
      Math.max(
        urlMin,
        urlMax
      );

    setSliderMin(
      safeMin
    );

    setSliderMax(
      safeMax
    );

    /*
      Scale only establishes from
      catalogue / applied URL values.

      It is NOT tied to sliderMax
      during dragging.
    */
    setPriceScaleMax(
      Math.max(
        actualHighestPrice,
        safeMin,
        safeMax,
        1
      )
    );

    setFromPrice(
      minPrice || ""
    );

    setToPrice(
      maxPrice || ""
    );

    setLocalAvailability(
      availability ||
        "all"
    );
  }, [
    minPrice,
    maxPrice,
    availability,
    actualHighestPrice,
  ]);

  /*
    Close desktop dropdowns
    when user clicks elsewhere.
  */
  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      const target =
        event.target as Node;

      if (
        availabilityRef.current &&
        !availabilityRef.current.contains(
          target
        )
      ) {
        setAvailabilityOpen(
          false
        );
      }

      if (
        priceRef.current &&
        !priceRef.current.contains(
          target
        )
      ) {
        setPriceOpen(
          false
        );
      }

      if (
        sortRef.current &&
        !sortRef.current.contains(
          target
        )
      ) {
        setSortOpen(
          false
        );
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /*
    Disable page scrolling behind
    the full filter drawer.
  */
  useEffect(() => {
    document.body.style.overflow =
      drawerOpen
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [
    drawerOpen,
  ]);

  const querySnapshot =
    useMemo(
      () =>
        new URLSearchParams(
          searchParams.toString()
        ),
      [
        searchParams,
      ]
    );

  const hasPriceFilter =
    Boolean(
      minPrice ||
        maxPrice
    );

  const hasAvailabilityFilter =
    availability !==
      "all";

  const activeFilterCount =
    Number(
      hasPriceFilter
    ) +
    Number(
      hasAvailabilityFilter
    );

  const selectedSort =
    sortOptions.find(
      (
        option
      ) =>
        option.value ===
        sort
    ) ||
    sortOptions[0];

  const availabilityLabel =
    availability ===
    "in-stock"
      ? "In Stock"
      : availability ===
          "out-of-stock"
        ? "Out of Stock"
        : "Availability";

  const priceLabel =
    hasPriceFilter
      ? `${formatPrice(
          Number(
            minPrice ||
              0
          )
        )} – ${formatPrice(
          Number(
            maxPrice ||
              priceScaleMax
          )
        )}`
      : "Price";

  function navigate(
    updates: Record<
      string,
      string | null
    >
  ) {
    const params =
      new URLSearchParams(
        querySnapshot.toString()
      );

    Object.entries(
      updates
    ).forEach(
      ([
        key,
        value,
      ]) => {
        if (
          !value ||
          value === "all"
        ) {
          params.delete(
            key
          );
        } else {
          params.set(
            key,
            value
          );
        }
      }
    );

    const query =
      params.toString();

    router.push(
      query
        ? `${pathname}?${query}#products`
        : `${pathname}#products`
    );
  }

  /*
    =================================
    USER TYPES FROM PRICE
    =================================
  */
  function handleFromInput(
    value: string
  ) {
    setFromPrice(
      value
    );

    if (
      value === ""
    ) {
      setSliderMin(
        0
      );

      return;
    }

    const number =
      Number(value);

    if (
      !Number.isFinite(
        number
      ) ||
      number < 0
    ) {
      return;
    }

    /*
      If typed value exceeds scale,
      grow the scale.

      But NEVER shrink it here.
    */
    if (
      number >
      priceScaleMax
    ) {
      setPriceScaleMax(
        number
      );
    }

    setSliderMin(
      number
    );

    /*
      Keep range valid.
    */
    if (
      number >
      sliderMax
    ) {
      setSliderMax(
        number
      );

      setToPrice(
        String(number)
      );
    }
  }

  /*
    =================================
    USER TYPES TO PRICE

    Example:
    actual products max = 800

    user types 5000

    sliderMax = 5000
    priceScaleMax = 5000
    =================================
  */
  function handleToInput(
    value: string
  ) {
    setToPrice(
      value
    );

    if (
      value === ""
    ) {
      setSliderMax(
        actualHighestPrice
      );

      setPriceScaleMax(
        Math.max(
          actualHighestPrice,
          sliderMin,
          1
        )
      );

      return;
    }

    const number =
      Number(value);

    if (
      !Number.isFinite(
        number
      ) ||
      number < 0
    ) {
      return;
    }

    /*
      Expand stable scale if needed.
    */
    if (
      number >
      priceScaleMax
    ) {
      setPriceScaleMax(
        number
      );
    }

    setSliderMax(
      number
    );

    /*
      Keep range valid.
    */
    if (
      number <
      sliderMin
    ) {
      setSliderMin(
        number
      );

      setFromPrice(
        String(number)
      );
    }
  }

  /*
    =================================
    SLIDER DRAG -> FROM INPUT

    IMPORTANT:
    priceScaleMax NEVER changes here.
    =================================
  */
  function handleSliderMin(
    value: number
  ) {
    const safe =
      clamp(
        value,
        0,
        sliderMax
      );

    setSliderMin(
      safe
    );

    setFromPrice(
      safe <= 0
        ? ""
        : String(
            safe
          )
    );
  }

  /*
    =================================
    SLIDER DRAG -> TO INPUT

    Scale stays fixed while dragging.

    Example:
    scale = 5000

    Drag:
    5000
    4621
    3974
    3218
    2476

    scale still = 5000.
    =================================
  */
  function handleSliderMax(
    value: number
  ) {
    const safe =
      clamp(
        value,
        sliderMin,
        priceScaleMax
      );

    setSliderMax(
      safe
    );

    setToPrice(
      String(
        safe
      )
    );
  }

  function applyPrice(
    event?:
      FormEvent
  ) {
    event?.preventDefault();

    navigate({
      minPrice:
        sliderMin > 0
          ? String(
              sliderMin
            )
          : null,

      maxPrice:
        toPrice !== ""
          ? String(
              sliderMax
            )
          : null,
    });

    setPriceOpen(
      false
    );
  }

  function resetPrice() {
    setSliderMin(
      0
    );

    setSliderMax(
      actualHighestPrice
    );

    setPriceScaleMax(
      actualHighestPrice
    );

    setFromPrice(
      ""
    );

    setToPrice(
      ""
    );

    navigate({
      minPrice: null,
      maxPrice: null,
    });

    setPriceOpen(
      false
    );
  }

  function applyAvailability(
    value: string
  ) {
    setLocalAvailability(
      value
    );

    navigate({
      availability:
        value ===
        "all"
          ? null
          : value,
    });

    setAvailabilityOpen(
      false
    );
  }

  function applySort(
    value: string
  ) {
    navigate({
      sort:
        value ===
        "featured"
          ? null
          : value,
    });

    setSortOpen(
      false
    );
  }

  function resetAll() {
    setSliderMin(
      0
    );

    setSliderMax(
      actualHighestPrice
    );

    setPriceScaleMax(
      actualHighestPrice
    );

    setFromPrice(
      ""
    );

    setToPrice(
      ""
    );

    setLocalAvailability(
      "all"
    );

    setDrawerOpen(
      false
    );

    setAvailabilityOpen(
      false
    );

    setPriceOpen(
      false
    );

    router.push(
      `${pathname}#products`
    );
  }

  function applyDrawer() {
    navigate({
      availability:
        localAvailability ===
        "all"
          ? null
          : localAvailability,

      minPrice:
        sliderMin > 0
          ? String(
              sliderMin
            )
          : null,

      maxPrice:
        toPrice !== ""
          ? String(
              sliderMax
            )
          : null,
    });

    setDrawerOpen(
      false
    );
  }

  return (
    <>
      {/* =================================
          TOP FILTER BAR
      ================================= */}

      <div className="relative z-30 mb-7 border-b border-[#123529]/10 pb-5">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* LEFT */}

          <div className="flex flex-wrap items-center gap-2.5">

            <span className="mr-1 text-[13px] font-semibold text-[#123529]">
              Filter:
            </span>

            {/* FULL FILTER DRAWER */}

            <button
              type="button"
              onClick={() =>
                setDrawerOpen(
                  true
                )
              }
              className="flex h-[42px] items-center gap-2 rounded-full border border-[#123529]/15 bg-white px-4 text-[13px] font-medium text-[#123529] transition hover:border-[#08745a]/40"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4"
              >
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>

              Filters

              {activeFilterCount >
              0 ? (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#073c31] px-1 text-[10px] font-bold text-white">
                  {
                    activeFilterCount
                  }
                </span>
              ) : null}
            </button>

            {/* AVAILABILITY */}

            <div
              ref={
                availabilityRef
              }
              className="relative"
            >

              <button
                type="button"
                onClick={() => {
                  setAvailabilityOpen(
                    (
                      current
                    ) =>
                      !current
                  );

                  setPriceOpen(
                    false
                  );

                  setSortOpen(
                    false
                  );
                }}
                className={`flex h-[42px] items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition ${
                  hasAvailabilityFilter
                    ? "border-[#08745a] bg-[#edf5f1] text-[#075441]"
                    : "border-[#123529]/15 bg-white text-[#123529]"
                }`}
              >
                {
                  availabilityLabel
                }

                <Chevron
                  open={
                    availabilityOpen
                  }
                />
              </button>

              {availabilityOpen ? (
                <div className="absolute left-0 top-[48px] z-50 w-[220px] rounded-[16px] border border-[#123529]/10 bg-white p-2 shadow-[0_18px_45px_rgba(18,53,41,0.14)]">

                  {[
                    {
                      value:
                        "all",
                      label:
                        "All products",
                      count:
                        totalProductCount,
                    },
                    {
                      value:
                        "in-stock",
                      label:
                        "In stock",
                      count:
                        inStockCount,
                    },
                    {
                      value:
                        "out-of-stock",
                      label:
                        "Out of stock",
                      count:
                        outOfStockCount,
                    },
                  ].map(
                    (
                      option
                    ) => (
                      <button
                        key={
                          option.value
                        }
                        type="button"
                        onClick={() =>
                          applyAvailability(
                            option.value
                          )
                        }
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[12px] transition ${
                          availability ===
                          option.value
                            ? "bg-[#edf5f1] font-semibold text-[#075441]"
                            : "hover:bg-[#f7f6f2]"
                        }`}
                      >
                        <span>
                          {
                            option.label
                          }
                        </span>

                        <span className="text-[10px] text-[#8a938f]">
                          {
                            option.count
                          }
                        </span>
                      </button>
                    )
                  )}

                </div>
              ) : null}

            </div>

            {/* PRICE */}

            <div
              ref={
                priceRef
              }
              className="relative"
            >

              <button
                type="button"
                onClick={() => {
                  setPriceOpen(
                    (
                      current
                    ) =>
                      !current
                  );

                  setAvailabilityOpen(
                    false
                  );

                  setSortOpen(
                    false
                  );
                }}
                className={`flex h-[42px] max-w-[285px] items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition ${
                  hasPriceFilter
                    ? "border-[#08745a] bg-[#edf5f1] text-[#075441]"
                    : "border-[#123529]/15 bg-white text-[#123529]"
                }`}
              >
                <span className="truncate">
                  {
                    priceLabel
                  }
                </span>

                <Chevron
                  open={
                    priceOpen
                  }
                />
              </button>

              {priceOpen ? (
                <form
                  onSubmit={
                    applyPrice
                  }
                  className="absolute left-0 top-[48px] z-50 w-[310px] max-w-[calc(100vw-28px)] rounded-[18px] border border-[#123529]/10 bg-white p-4 shadow-[0_20px_55px_rgba(18,53,41,0.15)]"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <h3 className="font-serif text-lg font-semibold text-[#123529]">
                        Price
                      </h3>

                      <p className="mt-0.5 text-[10px] text-[#7e8883]">
                        Products currently up to{" "}
                        <strong className="text-[#123529]">
                          {formatPrice(
                            actualHighestPrice
                          )}
                        </strong>
                      </p>

                    </div>

                    {(fromPrice ||
                      toPrice) ? (
                      <button
                        type="button"
                        onClick={
                          resetPrice
                        }
                        className="text-[10px] font-semibold text-[#08745a] underline underline-offset-4"
                      >
                        Reset
                      </button>
                    ) : null}

                  </div>

                  {/* INPUTS */}

                  <div className="mt-3 grid grid-cols-2 gap-2">

                    <label className="rounded-xl border border-[#123529]/14 bg-[#fbfaf7] px-3 py-2.5">

                      <span className="block text-[9px] font-bold uppercase tracking-[0.08em] text-[#8a938f]">
                        From
                      </span>

                      <div className="mt-1 flex items-center">

                        <span className="mr-1 text-[10px] text-[#737d78]">
                          Rs.
                        </span>

                        <input
                          type="number"
                          min="0"
                          value={
                            fromPrice
                          }
                          onChange={(
                            event
                          ) =>
                            handleFromInput(
                              event
                                .target
                                .value
                            )
                          }
                          placeholder="0"
                          className="w-full min-w-0 bg-transparent text-[13px] font-medium outline-none"
                        />

                      </div>
                    </label>

                    <label className="rounded-xl border border-[#123529]/14 bg-[#fbfaf7] px-3 py-2.5">

                      <span className="block text-[9px] font-bold uppercase tracking-[0.08em] text-[#8a938f]">
                        To
                      </span>

                      <div className="mt-1 flex items-center">

                        <span className="mr-1 text-[10px] text-[#737d78]">
                          Rs.
                        </span>

                        <input
                          type="number"
                          min="0"
                          value={
                            toPrice
                          }
                          onChange={(
                            event
                          ) =>
                            handleToInput(
                              event
                                .target
                                .value
                            )
                          }
                          placeholder={String(
                            actualHighestPrice
                          )}
                          className="w-full min-w-0 bg-transparent text-[13px] font-medium outline-none"
                        />

                      </div>
                    </label>

                  </div>

                  {/* WORKING SLIDER */}

                  <div className="mt-3 rounded-xl bg-[#f7f8f5] px-3 py-3">

                    <PriceSlider
                      minValue={
                        sliderMin
                      }
                      maxValue={
                        sliderMax
                      }
                      scaleMax={
                        priceScaleMax
                      }
                      onMinChange={
                        handleSliderMin
                      }
                      onMaxChange={
                        handleSliderMax
                      }
                    />

                  </div>

                  <div className="mt-3 flex gap-2">

                    <button
                      type="button"
                      onClick={
                        resetPrice
                      }
                      className="rounded-xl border border-[#123529]/12 px-3.5 py-2.5 text-[11px] font-semibold"
                    >
                      Reset
                    </button>

                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-[#073c31] px-4 py-2.5 text-[11px] font-semibold text-white"
                    >
                      Apply Price
                    </button>

                  </div>

                </form>
              ) : null}

            </div>

          </div>

          {/* RIGHT / SORT */}

          <div className="flex items-center justify-between gap-4 lg:justify-end">

            <span className="text-[12px] text-[#7b8580]">
              <strong className="text-[#123529]">
                {
                  productCount
                }
              </strong>{" "}
              {productCount ===
              1
                ? "product"
                : "products"}
            </span>

            <div
              ref={
                sortRef
              }
              className="relative"
            >

              <div className="flex items-center gap-2">

                <span className="hidden text-[12px] text-[#7b8580] sm:inline">
                  Sort by:
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setSortOpen(
                      (
                        current
                      ) =>
                        !current
                    );

                    setPriceOpen(
                      false
                    );

                    setAvailabilityOpen(
                      false
                    );
                  }}
                  className="flex h-[42px] min-w-[170px] items-center justify-between gap-3 rounded-full border border-[#123529]/15 bg-white px-4 text-[12px] font-semibold text-[#123529] transition hover:border-[#08745a]/40"
                >
                  {
                    selectedSort.label
                  }

                  <Chevron
                    open={
                      sortOpen
                    }
                  />
                </button>

              </div>

              {sortOpen ? (
                <div className="absolute right-0 top-[48px] z-50 w-[225px] rounded-[16px] border border-[#123529]/10 bg-white p-2 shadow-[0_18px_45px_rgba(18,53,41,0.14)]">

                  {sortOptions.map(
                    (
                      option
                    ) => {
                      const active =
                        selectedSort.value ===
                        option.value;

                      return (
                        <button
                          key={
                            option.value
                          }
                          type="button"
                          onClick={() =>
                            applySort(
                              option.value
                            )
                          }
                          className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[12px] transition ${
                            active
                              ? "bg-[#edf5f1] font-semibold text-[#075441]"
                              : "hover:bg-[#f7f6f2]"
                          }`}
                        >

                          <span
                            className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border text-[10px] ${
                              active
                                ? "border-[#08745a] bg-[#08745a] text-white"
                                : "border-[#d2d8d4]"
                            }`}
                          >
                            {active
                              ? "✓"
                              : ""}
                          </span>

                          {
                            option.label
                          }

                        </button>
                      );
                    }
                  )}

                </div>
              ) : null}

            </div>

          </div>

        </div>
      </div>

      {/* =================================
          FULL FILTER DRAWER
      ================================= */}

      <div
        className={`fixed inset-0 z-[100] ${
          drawerOpen
            ? "pointer-events-auto"
            : "pointer-events-none"
        }`}
      >

        <button
          type="button"
          aria-label="Close filters"
          onClick={() =>
            setDrawerOpen(
              false
            )
          }
          className={`absolute inset-0 bg-black/25 backdrop-blur-[2px] transition-opacity duration-300 ${
            drawerOpen
              ? "opacity-100"
              : "opacity-0"
          }`}
        />

        <aside
          className={`absolute bottom-0 right-0 top-0 flex w-full max-w-[410px] flex-col bg-[#fffefb] shadow-[-20px_0_60px_rgba(0,0,0,0.13)] transition-transform duration-300 ${
            drawerOpen
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        >

          {/* DRAWER HEADER */}

          <div className="flex items-center justify-between border-b border-[#123529]/10 px-6 py-5">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a9a86]">
                REFINE COLLECTION
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#123529]">
                Filters
              </h2>

            </div>

            <button
              type="button"
              onClick={() =>
                setDrawerOpen(
                  false
                )
              }
              className="grid h-9 w-9 place-items-center rounded-full border border-[#123529]/10 bg-white text-[#123529]"
              aria-label="Close"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4"
              >
                <path d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>

          </div>

          <div className="flex-1 overflow-y-auto">

            {/* DRAWER AVAILABILITY */}

            <section className="border-b border-[#123529]/8 px-6 py-5">

              <h3 className="font-serif text-lg font-semibold text-[#123529]">
                Availability
              </h3>

              <div className="mt-3 space-y-1">

                {[
                  {
                    value:
                      "all",
                    label:
                      "All products",
                    count:
                      totalProductCount,
                  },
                  {
                    value:
                      "in-stock",
                    label:
                      "In stock",
                    count:
                      inStockCount,
                  },
                  {
                    value:
                      "out-of-stock",
                    label:
                      "Out of stock",
                    count:
                      outOfStockCount,
                  },
                ].map(
                  (
                    option
                  ) => (
                    <label
                      key={
                        option.value
                      }
                      className={`flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-3 transition ${
                        localAvailability ===
                        option.value
                          ? "bg-[#edf5f1]"
                          : "hover:bg-[#f7f6f2]"
                      }`}
                    >

                      <span className="flex items-center gap-2.5">

                        <input
                          type="radio"
                          name="drawer-availability"
                          checked={
                            localAvailability ===
                            option.value
                          }
                          onChange={() =>
                            setLocalAvailability(
                              option.value
                            )
                          }
                          className="h-4 w-4 accent-[#08745a]"
                        />

                        <span className="text-[13px] text-[#34403a]">
                          {
                            option.label
                          }
                        </span>

                      </span>

                      <span className="text-[10px] text-[#8a938f]">
                        {
                          option.count
                        }
                      </span>

                    </label>
                  )
                )}

              </div>
            </section>

            {/* DRAWER PRICE */}

            <section className="border-b border-[#123529]/8 px-6 py-5">

              <div className="flex items-start justify-between">

                <div>

                  <h3 className="font-serif text-lg font-semibold text-[#123529]">
                    Price
                  </h3>

                  <p className="mt-1 text-[10px] text-[#7d8782]">
                    Products currently up to{" "}
                    <strong className="text-[#123529]">
                      {formatPrice(
                        actualHighestPrice
                      )}
                    </strong>
                  </p>

                </div>

                {(fromPrice ||
                  toPrice) ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSliderMin(
                        0
                      );

                      setSliderMax(
                        actualHighestPrice
                      );

                      setPriceScaleMax(
                        actualHighestPrice
                      );

                      setFromPrice(
                        ""
                      );

                      setToPrice(
                        ""
                      );
                    }}
                    className="text-[10px] font-semibold text-[#08745a] underline underline-offset-4"
                  >
                    Reset
                  </button>
                ) : null}

              </div>

              {/* DRAWER PRICE INPUTS */}

              <div className="mt-4 grid grid-cols-2 gap-2">

                <label>

                  <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.08em] text-[#8a938f]">
                    From
                  </span>

                  <div className="flex items-center rounded-xl border border-[#123529]/15 bg-white px-3">

                    <span className="mr-1 text-[10px] text-[#737d78]">
                      Rs.
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={
                        fromPrice
                      }
                      onChange={(
                        event
                      ) =>
                        handleFromInput(
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="0"
                      className="min-w-0 flex-1 bg-transparent py-3 text-[13px] outline-none"
                    />

                  </div>
                </label>

                <label>

                  <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.08em] text-[#8a938f]">
                    To
                  </span>

                  <div className="flex items-center rounded-xl border border-[#123529]/15 bg-white px-3">

                    <span className="mr-1 text-[10px] text-[#737d78]">
                      Rs.
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={
                        toPrice
                      }
                      onChange={(
                        event
                      ) =>
                        handleToInput(
                          event
                            .target
                            .value
                        )
                      }
                      placeholder={String(
                        actualHighestPrice
                      )}
                      className="min-w-0 flex-1 bg-transparent py-3 text-[13px] outline-none"
                    />

                  </div>
                </label>

              </div>

              {/* THIS SLIDER HAS ITS OWN INTERNAL REF */}

              <div className="mt-4 rounded-xl bg-[#f7f8f5] px-3 py-3">

                <PriceSlider
                  minValue={
                    sliderMin
                  }
                  maxValue={
                    sliderMax
                  }
                  scaleMax={
                    priceScaleMax
                  }
                  onMinChange={
                    handleSliderMin
                  }
                  onMaxChange={
                    handleSliderMax
                  }
                />

              </div>

            </section>

            {/* DRAWER CATEGORY */}

            {categories.length >
            0 ? (
              <section className="px-6 py-5">

                <h3 className="font-serif text-lg font-semibold text-[#123529]">
                  Category
                </h3>

                <div className="mt-3 space-y-1">

                  <Link
                    href="/shop"
                    className={`block rounded-xl px-3 py-2.5 text-[13px] transition ${
                      !currentCategorySlug
                        ? "bg-[#edf5f1] font-semibold text-[#075441]"
                        : "text-[#35403b] hover:bg-[#f7f6f2]"
                    }`}
                  >
                    All Products
                  </Link>

                  {categories.map(
                    (
                      category
                    ) => (
                      <Link
                        key={
                          category.slug
                        }
                        href={`/shop/category/${category.slug}`}
                        className={`block rounded-xl px-3 py-2.5 text-[13px] transition ${
                          currentCategorySlug ===
                          category.slug
                            ? "bg-[#edf5f1] font-semibold text-[#075441]"
                            : "text-[#35403b] hover:bg-[#f7f6f2]"
                        }`}
                      >
                        {
                          category.name
                        }
                      </Link>
                    )
                  )}

                </div>
              </section>
            ) : null}

          </div>

          {/* DRAWER ACTIONS */}

          <div className="border-t border-[#123529]/10 bg-white p-4">

            <button
              type="button"
              onClick={
                applyDrawer
              }
              className="w-full rounded-xl bg-[#073c31] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(7,60,49,0.12)] transition hover:bg-[#0a4b3d]"
            >
              Apply Filters
            </button>

            <button
              type="button"
              onClick={
                resetAll
              }
              className="mt-2 w-full rounded-xl border border-[#123529]/12 bg-white px-5 py-3 text-sm font-semibold text-[#123529] transition hover:bg-[#f7f6f2]"
            >
              Reset All
            </button>

          </div>

        </aside>
      </div>
    </>
  );
}