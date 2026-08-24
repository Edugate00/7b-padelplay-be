import { RequestHandler } from "express";
import { NearlyCourtSchema } from "../schemas/court.schema";

export const validateNearlyCourt: RequestHandler = (req, res, next) => {
  const parsed = NearlyCourtSchema.safeParse(req.query);

  if (!parsed.success) {
    const { fieldErrors, formErrors } = parsed.error.flatten();
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: {
        ...fieldErrors,
        _form: formErrors,
      },
    });
  }

  // Simpan data yang sudah divalidasi ke res.locals
  res.locals.data = parsed.data;
  return next();
};
