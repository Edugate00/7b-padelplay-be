import { RequestHandler } from "express";
import {
  changeNamesSchema,
  createGameSchema,
  createTournamentSchema,
  registerSchema,
  restartGameSchema,
  updateAccountSchema,
  updateMatchSchema,
} from "../schemas/controller.schema";

export const validateCreateGame: RequestHandler = (req, res, next) => {
  const parsed = createGameSchema.safeParse(req.body);

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

export const validateCreateTournament: RequestHandler = (req, res, next) => {
  const parsed = createTournamentSchema.safeParse(req.body);

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

export const validateRestartGame: RequestHandler = (req, res, next) => {
  const parsed = restartGameSchema.safeParse(req.query);

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

export const validateChangeNames: RequestHandler = (req, res, next) => {
  const parsed = changeNamesSchema.safeParse(req.body);

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

export const validateUpdateMatch: RequestHandler = (req, res, next) => {
  const parsed = updateMatchSchema.safeParse(req.body);

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

export const validateRegister: RequestHandler = (req, res, next) => {
  const parsed = registerSchema.safeParse(req.body);

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


export const validateUpdateAccount: RequestHandler = (req, res, next) => {
   const parsed = updateAccountSchema.safeParse(req.body);

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
}