import csurf from "csurf";
import express from "express";
import authRouter from "./auth/auth-routes";

const router = express.Router();

export default function baseRouter() {
  router.get("/", (req, res) => {
    res.send("Welcome in API Receptionist Padel" + process.env.AYO_BASE_URL);
  });

  // --> get csrf token
  const csrfProtection = csurf({ cookie: true });
  router.get("/csrf-token", csrfProtection, (req, res) => {
    const token = req.csrfToken();
    res.cookie("XSRF-TOKEN", token, {
      httpOnly: false,
      secure: true, // WAJIB untuk SameSite=None
      sameSite: "none",
    });
    res.json({ csrfToken: token, statusCode: 201 });
  });

  router.use("/auth", authRouter());

  return router;
}
