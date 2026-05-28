/**
 * Run a SELECT query with parameter binding
 * @param {string} query - SQL query string with @params
 * @param {Object} params - key-value pair for parameter bindings
 * @returns {Promise<any>} - query result recordset
 */

import { trimAllStrings } from "../../utils/commonUtils.js";
import { getConnection } from "./db-connection.js";

export async function runSelectQuery(
  query: string,
  params: Object | any,
): Promise<any> {
  try {
    const pool = await getConnection();
    const request = pool.request();

    // --> bind parameter
    for (const key in params) {
      request.input(key, params[key].type, params[key].value);
    }

    const result = await request.query(query);
    const trimmedResponse = result.recordset.map((resp) => {
      return {
        ...trimAllStrings(resp),
      };
    });
    return trimmedResponse;
  } catch (error) {
    console.error("query error: ", error);
    throw error;
  }
}

export async function runSelectSingleQuery(
  query: string,
  params: Object | any,
): Promise<any> {
  try {
    const pool = await getConnection();
    const request = pool.request();

    // --> bind parameter
    for (const key in params) {
      request.input(key, params[key].type, params[key].value);
    }

    const result = await request.query(query);
    const trimmedResponse = result.recordset.map((resp) => {
      return {
        ...trimAllStrings(resp),
      };
    });
    return trimmedResponse[0];
  } catch (error) {
    console.error("query error: ", error);
    throw error;
  }
}

/**
 * Run an INSERT query with parameter binding
 * @param {string} query - SQL INSERT query string with @params
 * @param {Object} params - key-value pair for parameter bindings
 * @returns {Promise<number>} - number of rows inserted
 */

export async function runInsertQuery(
  query: string,
  params: Object | any,
): Promise<number> {
  try {
    const pool = await getConnection();
    const request = pool.request();

    for (const key in params) {
      request.input(key, params[key].type, params[key].value);
    }

    const result = await request.query(query);
    return result.rowsAffected[0] ?? 0; // jumlah rows inserted
  } catch (err) {
    console.error("Insert Query Error:", err);
    throw err;
  }
}

export async function runUpdateQuery(
  query: string,
  params: Object | any,
): Promise<number> {
  try {
    const pool = await getConnection();
    const request = pool.request();

    for (const key in params) {
      request.input(key, params[key].type, params[key].value);
    }

    const result = await request.query(query);
    return result.rowsAffected[0] ?? 0; // jumlah rows updated
  } catch (err) {
    console.error("Update Query Error:", err);
    throw err;
  }
}
