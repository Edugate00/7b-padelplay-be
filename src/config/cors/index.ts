import cors, { CorsOptions } from "cors";
import { config } from "dotenv";

config({ override: true });

const allowedOrigins = [
  process.env.FRONTEND_DEVELOPMENT_URL,
].filter((url): url is string => Boolean(url));

const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "content-type",
    "Authorization",
    "authorization",
    "X-CSRF-Token",
    "X-Csrf-Token",
    "X-XSRF-Token",
    "X-Requested-With",
    "Accept",
  ],
  credentials: true,
  exposedHeaders: ["X-CSRF-Token", "Authorization"],
};

export const mainCorsConfig = cors(corsOptions);
