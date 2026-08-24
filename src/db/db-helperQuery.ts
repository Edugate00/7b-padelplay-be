import mssql, { ISqlType } from "mssql";
import { trimAllStrings } from "../utils/commonUtils";
import dbConnection from "./db-connection";

type SqlParam = {
  /** Contoh: mssql.VarChar(50), mssql.Int, mssql.Char(12), dll. */
  type: mssql.ISqlType;
  /** Nilai yang akan di-bind */
  value: unknown;
};

type SqlParams = Record<string, SqlParam>;

function resolveSqlType(type: ISqlType): ISqlType {
  return typeof type === "function" ? (type as () => ISqlType)() : type;
}

function bindParams(request: mssql.Request, params?: SqlParams): void {
  if (!params) return;

  for (const [key, { type, value }] of Object.entries(params)) {
    const resolvedType = resolveSqlType(type);
    request.input(key, resolvedType, value as never);
  }
}

/**
 * Jalankan SELECT dan kembalikan array hasil ter-trim (stringnya di-trim)
 * @param query SQL dengan @params
 * @param params { key: { type, value } }
 */
export async function runSelectQuery<T extends object = object>(
  query: string,
  params?: SqlParams,
): Promise<T[]> {
  const pool = await dbConnection();
  const request = pool.request();

  bindParams(request, params);

  const result = await request.query(query);
  const recordset = result.recordset ?? [];

  const trimmed = recordset.map((row) => trimAllStrings(row) as unknown as T);
  return trimmed;
}

/**
 * Run an INSERT query with parameter binding
 * @param {string} query - SQL INSERT query string with @params
 * @param {Object} params - key-value pair for parameter bindings
 * @returns {Promise<number>} - number of rows inserted
 */

/**
 * Jalankan INSERT, mengembalikan jumlah rows yang terpengaruh
 */
export async function runInsertQuery(
  query: string,
  params?: SqlParams,
): Promise<number> {
  const pool = await dbConnection();
  const request = pool.request();

  bindParams(request, params);

  const result = await request.query(query);
  return result.rowsAffected?.[0] ?? 0;
}

/**
 * Jalankan UPDATE, mengembalikan jumlah rows yang terpengaruh
 */
export async function runUpdateQuery(
  query: string,
  params?: SqlParams,
): Promise<number> {
  const pool = await dbConnection();
  const request = pool.request();

  bindParams(request, params);

  const result = await request.query(query);
  return result.rowsAffected?.[0] ?? 0;
}
