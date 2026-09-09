export function formatPrice(
  value: number | string | null | undefined
) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return "Rs. 0.0";
  }

  return `Rs. ${amount.toLocaleString("en-PK", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}`;
}

export function formatPriceValue(
  value: number | string | null | undefined
) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return "0.0";
  }

  return amount.toLocaleString("en-PK", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}