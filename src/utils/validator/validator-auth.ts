import { RequestHandler } from "express";
import { z } from "zod";
import { IResponseUserByID } from "../../interfaces/auth/auth-interfaces";

// ---------------- Schema ------------------
const LoginBodySchema = z
  .object({
    email: z.preprocess(
      (v) => (typeof v === "string" ? v.trim().toLowerCase() : ""),
      z
        .string()
        .min(1, { message: "email is required" })
        .email({ message: "email is invalid" })
    ),
    password: z.preprocess(
      (v) => (typeof v === "string" ? v.trim() : ""),
      z
        .string()
        .min(1, { message: "password is required" })
        .min(8, { message: "password must be at least 8 characters" })
    ),
    rememberMe: z.preprocess((v) => {
      // dukung "true"/"false" string atau boolean
      if (typeof v === "string") return v.toLowerCase() === "true";
      return Boolean(v);
    }, z.boolean().optional()),
  })
  .strict();

// const sendOtpSchema = z.object({
//   email: z.preprocess(
//     (v) => (typeof v === "string" ? v.trim().toLowerCase() : ""),
//     z
//       .string()
//       .min(1, { message: "email is required" })
//       .email({ message: "email is invalid" })
//   ),
// });

// const verifyOtpSchema = z.object({
//   email: z
//     .string()
//     .min(1, { message: "email is required" })
//     .email({ message: "email is invalid" }),
//   otp: z.string().min(1, { message: "otp is required" }),
// });

// ---------------- Type ------------------
type TLoginBody = z.infer<typeof LoginBodySchema>;

// ---------------- Middle Ware ------------------
export const validateLoginBody: RequestHandler = (req, res, next) => {
  const parsed = LoginBodySchema.safeParse(req.body);
  if (!parsed.success) {
    const { fieldErrors, formErrors } = parsed.error.flatten();
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: { ...fieldErrors, _form: formErrors },
    });
  }
  res.locals.body = parsed.data as TLoginBody; // { email, password, rememberMe? }
  return next();
};


// not use send OTP

// export const SendOTPMW: RequestHandler = async (req, res, next) => {
//   const parsed = sendOtpSchema.safeParse(req.body);
//   if (!parsed.success) {
//     const { fieldErrors, formErrors } = parsed.error.flatten();
//     return res.status(400).json({
//       success: false,
//       message: "Invalid Payload",
//       errors: { ...fieldErrors, _form: formErrors },
//     });
//   }
//   // Check email is exists in payload
//   const data = parsed.data;
//   const userData = (await getUserByEmail(
//     data.email,
//     false
//   )) as IResponseUserByID[];
//   if (userData.length === 0) {
//     return res.status(404).json({
//       success: false,
//       message: "Email not found",
//     });
//   }
//   res.locals.payload = parsed.data; // { email }
//   return next();
// };


// Verify OTP not use
// export const VerifyOTPMW: RequestHandler = (req, res, next) => {
//   const parsed = verifyOtpSchema.safeParse(req.body);
//   if (!parsed.success) {
//     const { fieldErrors, formErrors } = parsed.error.flatten();
//     return res.status(400).json({
//       success: false,
//       message: "Invalid Payload",
//       errors: { ...fieldErrors, _form: formErrors },
//     });
//   }
//   res.locals.payload = parsed.data; // { email }
//   return next();
// };
