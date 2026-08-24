import z from "zod";

export function ensureNumeric(
  value: string,
  field: string,
  ctx: z.RefinementCtx,
  path: (string | number)[] = [] // default kosong
) {
  if (!/^\d+$/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${field} must be numeric`,
      path,
    });
    return false;
  }
  return true;
}
