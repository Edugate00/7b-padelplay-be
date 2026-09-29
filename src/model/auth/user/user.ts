import { runSelectQuery } from "../../../config/db/db-helperQuery";
import mssql from "mssql";
import {
  IResponseUserByEmail,
  IResponseUserByID,
} from "../../../interfaces/auth/auth-interfaces";
import { setQueryEmail } from "../../../config/db/db-helperQuery";
export async function getUserByID(userID: string): Promise<IResponseUserByID> {
  const query = `
    SELECT TOP 1 
      T_ZUSERS.USER_ID          AS USER_ID, 
      T_ZUSERS.IS_VERIFIED      AS IS_VERIFIED, 
      T_ZUSERS.USER_PASSWORD    AS USER_PASSWORD, 
      T_ZUSERS.USER_FULLNAME    AS USER_FULLNAME, 
      T_ZUSERS.ROLE_ID          AS ROLE_ID,
      T_ZUSERS.USER_PROFILE_PICT AS USER_PROFILE_PICT,
      T_ZUSERS.USER_EMAIL       AS USER_EMAIL,
      T_ZUSERS.PHONE_NUMBER     AS PHONE_NUMBER,
      T_ZUSERS.MEMBER_ID        AS MEMBER_ID,
      CASE
        WHEN T_ZUSERS.USER_GOOGLE_ID <> '' THEN 'X'
        ELSE ''
      END                       AS IS_GOOGLE_ACC,
      T_ZROLE.ROLE_NAME         AS ROLE_NAME,
      T_ZROLE.ROLE_DESC         AS ROLE_DESC,
      T_T151T.KTEXT             AS MEMBER_NAME
    FROM trn.ZUSERS AS T_ZUSERS
    LEFT JOIN trn.T151T AS T_T151T 
      ON T_T151T.KDGRP = T_ZUSERS.MEMBER_ID
    LEFT JOIN trn.ZROLE AS T_ZROLE 
      ON T_ZROLE.ROLE_ID = T_ZUSERS.ROLE_ID
    WHERE USER_ID = @userID
      AND T_ZUSERS.MANDT = @Client
  `;

  try {
    const result = (await runSelectQuery(query, {
      userID: {
        type: mssql.Char(10),
        value: userID,
      },
      Client: {
        type: mssql.Int(),
        value: Number(process.env.CLIENT) || 388,
      },
    })) as IResponseUserByID[];
    return result[0] as IResponseUserByID;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// --> Will be executed while login without google
export async function getUserReceptionist(
  email: string,
): Promise<IResponseUserByEmail[]> {
  try {
    const query = setQueryEmail() as string;
    const result = await runSelectQuery(query, {
      email: {
        type: mssql.Char(255),
        value: email.toLowerCase(),
      },
      Client: {
        type: mssql.Int(),
        value: Number(process.env.CLIENT) || 388,
      },
      client: {
        type: mssql.Int(),
        value: Number(process.env.CLIENT) || 388,
      },
    });
    return result as IResponseUserByEmail[];
  } catch (error) {
    console.error(error);
    throw error; // lempar kembali biar caller bisa catch
  }
}
