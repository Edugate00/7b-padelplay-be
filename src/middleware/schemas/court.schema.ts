import { z } from "zod";

export const NearlyCourtSchema = z.object({
  courtId: z
    .string()
    .min(1, "Court ID is required")
    .trim()
    .regex(/^P\d+$/, "Court ID must be like P1, P2, etc"),
  date: z
    .string()
    .min(1, "Date is required")
    .trim()
    .regex(/^\d{8}$/, "Date must be in 'YYYYMMDD' format"),
  location: z
    .string()
    .min(1, "Location is required")
    .trim()
    .regex(/^\d+$/, "Location must be numeric (e.g. 91, 96)"),
});
