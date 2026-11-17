import csurf from "csurf";
import express from "express";
import authRouter from "./auth/auth-routes";
import menuRouter from "./menu/menu-routes";

const router = express.Router();


export default function baseRouter() {
  router.get("/", (req, res) => {
    res.send("Welcome to 7B POS api");
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
  router.use("/resto", menuRouter());

  return router;
}

