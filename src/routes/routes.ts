import csurf from "csurf";
import express from "express";
import authRouter from "./auth/auth-routes";
import sponsorRouter from "./sponsor/sponsor";
import path from "path";
import fs from "fs";

const router = express.Router();

const sponsorPath = path.resolve(
  "assets",
  "images",
  "sponsor"
);

console.log("CWD:", process.cwd());
console.log("Sponsor path:", sponsorPath);
console.log("Exists:", fs.existsSync(sponsorPath));

export default function baseRouter() {
  router.get("/", (req, res) => {
    res.send("Welcome in API Padel Admin");
  });

  router.use("/assets/images/sponsor", express.static(sponsorPath));

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

  return router;
}

