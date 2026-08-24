import { RequestHandler } from "express";
import {
  viewAdvertisementSchema,
  viewControllerTokenSchema,
} from "../schemas/view.schema";

export const validateViewControllerToken: RequestHandler = (req, res, next) => {
  const parsed = viewControllerTokenSchema.safeParse(req.query);

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

export const validateViewAdvertisement: RequestHandler = (req, res, next) => {
  const parsed = viewAdvertisementSchema.safeParse(req.query);

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