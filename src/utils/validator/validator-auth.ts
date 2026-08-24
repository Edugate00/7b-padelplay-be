import { RequestHandler } from "express";
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .trim(),
  password: z.string().min(1, "Password wajib diisi"),
});

export const validateLoginBody: RequestHandler = (req, res, next) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: fieldErrors,
    });
  }

  res.locals.data = parsed.data;
  return next();
};
