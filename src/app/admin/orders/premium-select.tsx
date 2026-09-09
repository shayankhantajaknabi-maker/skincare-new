"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

export type PremiumSelectOption = {
  value: string;
  label: string;
  description?: string;
  tone?:
    | "default"
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
};

type PremiumSelectProps = {
  value: string;

  options:
    PremiumSelectOption[];

  onChange: (
    value: string
  ) => void;

  label?: string;

  placeholder?: string;

  className?: string;

  menuClassName?: string;

  disabled?: boolean;

  showStatusDot?: boolean;
};

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ChevronIcon({
  open,
}: {
  open: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 transition-transform duration-200 ${
        open
          ? "rotate-180"
          : ""
      }`}
      aria-hidden="true"
    >
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

function toneDot(
  tone:
    | PremiumSelectOption["tone"]
    | undefined
) {
  switch (tone) {
    case "confirmed":
      return "bg-blue-500";

    case "processing":
      return "bg-violet-500";

    case "shipped":
      return "bg-sky-500";

    case "delivered":
      return "bg-emerald-500";

    case "cancelled":
      return "bg-red-500";

    case "pending":
      return "bg-amber-500";

    default:
      return "bg-[#8a9a86]";
  }
}

export default function PremiumSelect({
  value,
  options,
  onChange,
  label,
  placeholder = "Select option",
  className = "",
  menuClassName = "",
  disabled = false,
  showStatusDot = false,
}: PremiumSelectProps) {
  const [
    open,
    setOpen,
  ] = useState(false);

  const wrapperRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const selected =
    options.find(
      (option) =>
        option.value === value
    ) || null;

  useEffect(() => {
    function closeOutside(
      event: MouseEvent
    ) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    function closeEscape(
      event: KeyboardEvent
    ) {
      if (
        event.key === "Escape"
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      closeOutside
    );

    document.addEventListener(
      "keydown",
      closeEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        closeOutside
      );

      document.removeEventListener(
        "keydown",
        closeEscape
      );
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`relative ${className}`}
    >
      {/* TRIGGER */}

      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() =>
          setOpen(
            (current) =>
              !current
          )
        }
        className={`group flex min-h-[52px] w-full items-center justify-between gap-3 rounded-[16px] border bg-white px-4 py-2.5 text-left outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
          open
            ? "border-[#073c31]/40 shadow-[0_8px_26px_rgba(7,60,49,0.08)] ring-4 ring-[#073c31]/5"
            : "border-[#123529]/12 shadow-[0_3px_12px_rgba(18,53,41,0.025)] hover:border-[#073c31]/25 hover:bg-[#fdfcf9]"
        }`}
      >
        <span className="min-w-0">
          {label ? (
            <span className="mb-0.5 block text-[9px] font-semibold uppercase tracking-[0.15em] text-[#8a938f]">
              {label}
            </span>
          ) : null}

          <span className="flex items-center gap-2">
            {showStatusDot &&
            selected ? (
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${toneDot(
                  selected.tone
                )}`}
              />
            ) : null}

            <span className="truncate text-[13px] font-semibold text-[#123529]">
              {selected?.label ||
                placeholder}
            </span>
          </span>
        </span>

        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-[10px] transition-all duration-200 ${
            open
              ? "bg-[#073c31] text-white"
              : "bg-[#f0f4f2] text-[#68756f] group-hover:bg-[#e9f0ed] group-hover:text-[#073c31]"
          }`}
        >
          <ChevronIcon
            open={open}
          />
        </span>
      </button>

      {/* MENU */}

      {open ? (
        <div
          role="listbox"
          className={`absolute right-0 top-[calc(100%+8px)] z-[200] min-w-full overflow-hidden rounded-[18px] border border-[#123529]/10 bg-white p-1.5 shadow-[0_24px_65px_rgba(18,53,41,0.16)] ${menuClassName}`}
        >
          <div className="max-h-[330px] overflow-y-auto p-1 [scrollbar-width:thin]">

            {options.map(
              (option) => {
                const active =
                  option.value ===
                  value;

                return (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    role="option"
                    aria-selected={
                      active
                    }
                    onClick={() => {
                      onChange(
                        option.value
                      );

                      setOpen(false);
                    }}
                    className={`group/item flex w-full items-center gap-3 rounded-[13px] px-3 py-2.5 text-left transition-all ${
                      active
                        ? "bg-[#edf5f1] text-[#073c31]"
                        : "text-[#53615c] hover:bg-[#f7f5ef] hover:text-[#073c31]"
                    }`}
                  >
                    {showStatusDot ? (
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${toneDot(
                          option.tone
                        )}`}
                      />
                    ) : (
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full transition ${
                          active
                            ? "bg-[#d4af37]"
                            : "bg-[#ccd5d1] group-hover/item:bg-[#8a9a86]"
                        }`}
                      />
                    )}

                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-semibold">
                        {
                          option.label
                        }
                      </span>

                      {option.description ? (
                        <span className="mt-0.5 block text-[10px] leading-4 text-[#8a938f]">
                          {
                            option.description
                          }
                        </span>
                      ) : null}
                    </span>

                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition ${
                        active
                          ? "bg-[#073c31] text-white"
                          : "text-transparent"
                      }`}
                    >
                      <CheckIcon />
                    </span>
                  </button>
                );
              }
            )}

          </div>
        </div>
      ) : null}
    </div>
  );
}