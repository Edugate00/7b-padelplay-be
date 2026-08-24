import express, { ErrorRequestHandler } from "express";
import { config } from "dotenv";
import { mainCorsConfig } from "./config/cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import passport from "passport";
import baseRouter from "./routes/routes";
import session from "express-session";
import http from "http";

/* ---------------------------- Router middleware --------------------------- */
// --> init dotenv
config({ override: true });
const PORT = process.env.PORT || 8000;

import "./config/passport/passportConfig"; // Import passport configuration

// --> init express app
const app = express();

// --> Middleware
app.set("trust proxy", true);
app.use(mainCorsConfig); // --> Cors middleware

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// --> Init express session
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_KEY as string,
    resave: false,
    saveUninitialized: true,
  }),
);

// --> Init passport session
app.use(passport.initialize());
app.use(passport.session());

// --> middleware for checking csrf
const isProd = process.env.NODE_ENV === "PRD";
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  },
  value: (req) =>
    req.cookies["XSRF-TOKEN"] ||
    (req.headers["x-csrf-token"] as string) ||
    (req.headers["x-xsrf-token"] as string) ||
    "",
});


type CsrfBadTokenError = Error & { code: "EBADCSRFTOKEN" };

function isCsrfBadTokenError(e: unknown): e is CsrfBadTokenError {
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    (e as Record<string, unknown>).code === "EBADCSRFTOKEN"
  );
}

const csrfErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (isCsrfBadTokenError(err)) {
    return res.status(403).json({
      statusCode: 403,
      success: false,
      message: "Invalid CSRF token",
    });
  }
  return next(err);
};

app.use(csrfErrorHandler);

app.use("/api", (req, res, next) => {
  const m = req.method.toUpperCase();
  // Bypass CSRF protection for login/logout endpoints
  if (req.path.startsWith("/auth/login") || req.path.startsWith("/auth/logout")) {
    return next();
  }
  return ["POST", "PUT", "PATCH", "DELETE"].includes(m)
    ? csrfProtection(req, res, next)
    : next();
});

// --> init logging
app.get("/healthz", async (req, res) => {
  try {
    res.status(200).json({
      ok: true,
      service: process.env.SERVICE_NAME ?? "padel-gro-be",
      env: process.env.NODE_ENV ?? "local",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      service: process.env.SERVICE_NAME ?? "padel-gro-be",
      env: process.env.NODE_ENV ?? "local",
      error: (err as Error).message,
      timestamp: new Date().toISOString(),
    });
  }
});

/* ---------------------------- Router middleware --------------------------- */

app.get("/", (req, res) => {
  res.send("Welcome to the Padel Admin API");
});

app.use("/api", baseRouter());

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
