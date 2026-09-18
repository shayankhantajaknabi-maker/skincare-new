"use client";

import { useRouter, useSearchParams } from "next/navigation";

const ranges = [
  {
    label: "Today",
    value: "today",
  },
  {
    label: "This Month",
    value: "month",
  },
  {
    label: "This Year",
    value: "year",
  },
  {
    label: "All Time",
    value: "all",
  },
];

export default function RevenueFilter() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const current =
    searchParams.get("range") || "all";


  function changeRange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const value = event.target.value;

    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("range", value);

    router.push(
      `/admin?${params.toString()}`
    );
  }


  return (
    <select
      value={current}
      onChange={changeRange}
      className="
        rounded-xl
        border
        border-[#e5dfd2]
        bg-white
        px-3
        py-2
        text-sm
        text-[#123529]
        outline-none
      "
    >
      {ranges.map((item) => (
        <option
          key={item.value}
          value={item.value}
        >
          {item.label}
        </option>
      ))}
    </select>
  );
}