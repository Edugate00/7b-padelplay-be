import { trimAllStrings } from "../../utils/commonUtils";
import dbConnection from "./db-connection";

/**
 * Run a SELECT query with parameter binding
 * @param {string} query - SQL query string with @params
 * @param {Object} params - key-value pair for parameter bindings
 * @returns {Promise<any>} - query result recordset
 */

export async function runSelectQuery(
  query: string,
  params: Object | any
): Promise<any> {
  try {
    const pool = await dbConnection();
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
  params: Object | any
): Promise<any> {
  try {
    const pool = await dbConnection();
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
  params: Object | any
): Promise<number> {
  try {
    const pool = await dbConnection();
    const request = pool.request();

    for (const key in params) {
      request.input(key, params[key].type, params[key].value);
    }

    const result = await request.query(query);
    return result.rowsAffected[0]; // jumlah rows inserted
  } catch (err) {
    console.error("Insert Query Error:", err);
    throw err;
  }
}

export async function runUpdateQuery(
  query: string,
  params: Object | any
): Promise<number> {
  try {
    const pool = await dbConnection();
    const request = pool.request();

    for (const key in params) {
      request.input(key, params[key].type, params[key].value);
    }

    const result = await request.query(query);
    return result.rowsAffected[0]; // jumlah rows updated
  } catch (err) {
    console.error("Update Query Error:", err);
    throw err;
  }
}


export const setQueryEmail = () => {
  const query = `
  SELECT TOP 1 T_ZUSERS.USER_ID as USER_ID, 
               T_ZUSERS.IS_VERIFIED AS IS_VERIFIED, 
               T_ZUSERS.USER_PASSWORD AS USER_PASSWORD, 
               T_ZUSERS.USER_FULLNAME AS USER_FULLNAME, 
               T_ZUSERS.ROLE_ID AS ROLE_ID,
               T_ZUSERS.LOCATION AS LOCATION,
               T_ZUSERS.USER_PROFILE_PICT AS USER_PROFILE_PICT,
               T_ZUSERS.USER_EMAIL AS USER_EMAIL,
               T_ZUSERS.PHONE_NUMBER AS PHONE_NUMBER,
               T_ZUSERS.MEMBER_ID AS MEMBER_ID,
               T_ZROLE.ROLE_NAME AS ROLE_NAME,
               T_ZROLE.ROLE_DESC AS ROLE_DESC,
               T_T151T.KTEXT AS MEMBER_NAME
  FROM trn.ZUSERS as T_ZUSERS
    INNER JOIN trn.T151T as T_T151T on T_T151T.KDGRP = T_ZUSERS.MEMBER_ID
    AND T_T151T.MANDT = @Client
    INNER JOIN trn.ZROLE as T_ZROLE on T_ZROLE.ROLE_ID = T_ZUSERS.ROLE_ID
    AND T_ZROLE.MANDT = @Client
    WHERE USER_EMAIL = @email
    AND T_ZUSERS.MANDT = @Client
    AND MEMBER_ID = 'ZR'
`;
  return query;
};
