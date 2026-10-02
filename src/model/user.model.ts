import { runSelectQuery } from "../config/db/db-helperQuery";
import mssql from "mssql";

export interface UserRecord {
  USER_ID: string | number;
  USER_EMAIL: string;
  USER_FULLNAME: string;
  USER_PASSWORD?: string;
  ROLE_NAME?: string;
}

export interface IResponseUserByEmail {
  USER_ID: string;
  USER_EMAIL: string;
  IS_VERIFIED: string;
  USER_PASSWORD: string;
  USER_FULLNAME: string;
  ROLE_ID: string;
  GENDER: string;
  LOCATION: string;
  DIST_CHAN: string;
  USER_PROFILE_PICT: string;
  MEMBER_NAME: string;
  PHONE_NUMBER: string;
  MEMBER_ID: string;
  ROLE_NAME: string;
  ROLE_DESC: string;
  IS_GOOGLE_ACC: string;
}

export class UserModel {
  /**
   * Find user by email from SAP MSSQL DB (${process.env.DB_NAME!.toLowerCase()}.ZUSERS)
   */
  static async findByEmail(email: string): Promise<UserRecord | null> {
    try {
      // Priority 1: Check receptionist / staff user (MEMBER_ID = 'ZR')
      let users = await this.getUserByEmail(email, true);

      // Priority 2: Check general customer user (MEMBER_ID != 'ZR')
      if (!users || users.length === 0) {
        users = await this.getUserByEmail(email, false);
      }

      if (users && users.length > 0) {
        const u = users[0];
        return {
          USER_ID: u.USER_ID,
          USER_EMAIL: u.USER_EMAIL || email,
          USER_FULLNAME: u.USER_FULLNAME,
          USER_PASSWORD: u.USER_PASSWORD,
          ROLE_NAME: u.ROLE_NAME || "admin",
        };
      }
    } catch (error) {
      console.error("Failed to query user from SAP DB:", error);
      throw error;
    }

    return null;
  }

  static async getUserByEmail(
    email: string,
    gro: boolean,
  ): Promise<IResponseUserByEmail[]> {
    const conditionalQuery = gro ? "=" : "!=";

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
      T_ZUSERS.GENDER           AS GENDER,
      T_TVTWT.VTEXT             AS LOCATION,
      T_ZUSERS.LOCATION         AS DIST_CHAN,
      CASE
        WHEN T_ZUSERS.USER_GOOGLE_ID <> '' THEN 'X'
        ELSE ''
      END                      AS IS_GOOGLE_ACC,
      T_ZROLE.ROLE_NAME        AS ROLE_NAME,
      T_ZROLE.ROLE_DESC        AS ROLE_DESC,
      T_T151T.KTEXT            AS MEMBER_NAME
    FROM ${process.env.DB_NAME!.toLowerCase()}.ZUSERS AS T_ZUSERS
    LEFT JOIN ${process.env.DB_NAME!.toLowerCase()}.T151T AS T_T151T 
      ON T_T151T.KDGRP = T_ZUSERS.MEMBER_ID
    LEFT JOIN ${process.env.DB_NAME!.toLowerCase()}.ZROLE AS T_ZROLE 
      ON T_ZROLE.ROLE_ID = T_ZUSERS.ROLE_ID

      LEFT JOIN ${process.env.DB_NAME!.toLowerCase()}.TVTWT AS T_TVTWT
      ON T_TVTWT.VTWEG = T_ZUSERS.LOCATION
      AND T_TVTWT.MANDT = @Client
      AND T_TVTWT.SPRAS = 'E'

    WHERE USER_EMAIL = @email
      AND (MEMBER_ID ${conditionalQuery} 'ZR' OR MEMBER_ID ${conditionalQuery} 'ZA')
      AND T_ZUSERS.MANDT = @Client
  `;
    try {
      const result = await runSelectQuery(query, {
        email: {
          type: mssql.Char(255),
          value: email.toLowerCase(),
        },
        Client: {
          type: mssql.Int(), // pastikan pakai instance
          value: Number(process.env.CLIENT),
        },
      });
      return result;
    } catch (error) {
      console.error(error);
      throw error; // biar caller yang handle
    }
  }
}
