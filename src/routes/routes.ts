import csurf from "csurf";
import express from "express";
import authRouter from "./auth/auth-routes";
import sponsorRouter from "./sponsor/sponsor";
import path from "path";
import fs from "fs";
import flyerRouter from "./flyer/flyer";

const router = express.Router();

const sponsorPath = path.resolve(
  "assets",
  "images",
  "sponsor"
);
const flyerPath = path.resolve(
  "assets",
  "images",
  "flyer"
);

export default function baseRouter() {
  router.get("/", (req, res) => {
    res.send("Welcome in API Padel Admin");
  });

  router.use("/assets/images/sponsor", express.static(sponsorPath));
  router.use("/assets/images/flyer", express.static(flyerPath));

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
  router.use("/sponsor", sponsorRouter());
  router.use("/flyer", flyerRouter())

  return router;
}

