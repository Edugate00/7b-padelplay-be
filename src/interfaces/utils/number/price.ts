export function formatPrice(
  value: string | number,
  converted: boolean = true
): string | number {
  let raw = typeof value === "number" ? value.toString() : value;

  // buang semua titik pemisah ribuan
  raw = raw.replace(/\./g, "");
  const num = Number(raw);
  
  if (isNaN(num)) return "0";
  
  return converted
    ? new Intl.NumberFormat("id-ID", { style: "decimal", minimumFractionDigits: 0 }).format(num)
    : num;
}

export const toNumber = (v: unknown): number => {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const cleaned = v.replace(/\./g, "").replace(/,/g, ".");
    return Number(cleaned) || 0;
  }
  return 0;
};
