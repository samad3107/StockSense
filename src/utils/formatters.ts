import { Currency } from "@/types/inventory";

// Conversion rate for dual currency toggle (₹83.5 = $1)
const USD_INR_RATE = 83.5;

export function formatCurrency(amountInINR: number, currency: Currency = "INR"): string {
  if (currency === "USD") {
    const usdAmount = amountInINR / USD_INR_RATE;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usdAmount);
  }

  // Format as Indian Rupee (₹)
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountInINR);
}
