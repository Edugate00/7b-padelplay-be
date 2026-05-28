// import mysql2 from "mysql2";
import { config } from "dotenv";
config();

import mssql from "mssql";

const mssqlConf = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) as number,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: false, // change to true for local dev / self-signed certs
  },
} as mssql.config;

let pool: mssql.ConnectionPool | null = null;

export const getConnection = async () => {
  if (pool) return pool;
  try {
    pool = await mssql.connect(mssqlConf);
    return pool;
  } catch (error) {
    console.error("Database connection failed", error);
    throw error;
  }
};
