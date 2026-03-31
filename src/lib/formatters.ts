import { format, parseISO } from "date-fns";

export function formatCompactCurrency(value: number, currency = "USD"): string {
  if (Math.abs(value) >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDetailedCurrency(
  value: number | null | undefined,
  currency = "USD",
  fallback = "—",
): string {
  if (value == null) return fallback;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactCount(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return value.toString();
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercentFromRatio(
  ratio: number | null | undefined,
  fractionDigits = 2,
  fallback = "—",
): string {
  if (ratio == null) return fallback;
  return `${(ratio * 100).toFixed(fractionDigits)}%`;
}

export function formatMultiplier(
  value: number | null | undefined,
  fractionDigits = 2,
  fallback = "—",
): string {
  if (value == null) return fallback;
  return `${value.toFixed(fractionDigits)}x`;
}

export function formatDate(value: string | null | undefined, fallback = "—"): string {
  if (!value) return fallback;
  return format(parseISO(value), "MMM d, yyyy");
}

export function formatDateTime(value: string | null | undefined, fallback = "—"): string {
  if (!value) return fallback;
  return format(parseISO(value), "MMM d, yyyy h:mm a");
}
