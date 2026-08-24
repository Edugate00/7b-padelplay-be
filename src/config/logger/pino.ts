import pino from "pino";

const isProd = process.env.NODE_ENV?.toLowerCase() === "prd";
const wantPretty =
  !isProd && (process.env.LOG_PRETTY === "true" || process.stdout.isTTY);

const baseOptions: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
  redact: {
    // hapus data sensitif dari log
    paths: [
      "req.headers.authorization",
      "headers.authorization",
      "password",
      "token",
      "authorization",
      "refreshToken",
    ],
    remove: true,
  },
};

export const logger = pino(
  wantPretty
    ? {
        ...baseOptions,
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            singleLine: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      }
    : baseOptions
);
