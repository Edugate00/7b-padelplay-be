import { RequestHandler } from "express";
import {
  viewAdvertisementSchema,
  viewControllerTokenSchema,
  viewCourtMatchSchema,
  viewLatestMatchIdSchema,
  viewLeaderboardSchema,
  viewPlayerSchema,
  viewScoreboardSchema,
  viewTournamentSchema,
} from "../schemas/view.schema";

export const validateViewScoreboard: RequestHandler = (req, res, next) => {
  const parsed = viewScoreboardSchema.safeParse(req.query);

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

export const validateViewTournament: RequestHandler = (req, res, next) => {
  const parsed = viewTournamentSchema.safeParse(req.query);

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

export const validateViewCourtMatch: RequestHandler = (req, res, next) => {
  const parsed = viewCourtMatchSchema.safeParse(req.query);

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

export const validateViewPlayer: RequestHandler = (req, res, next) => {
  const parsed = viewPlayerSchema.safeParse(req.query);

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

export const validateViewLatestMatchId: RequestHandler = (req, res, next) => {
  const parsed = viewLatestMatchIdSchema.safeParse(req.query);

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

export const validateViewLeaderboard: RequestHandler = (req, res, next) => {
  const parsed = viewLeaderboardSchema.safeParse(req.query);

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