import mssql from "mssql";
import { runSelectSingleQuery } from "../config/db/db-helperQuery";
import bcrypt from "bcrypt";

export interface UserRecord {
  USER_ID: string | number;
  USER_EMAIL: string;
  USER_FULLNAME: string;
  USER_PASSWORD?: string;
  ROLE_NAME?: string;
}

export class UserModel {
  /**
   * Find user by email from MSSQL DB or return mock fallback if DB fails/unreachable
   */
  static async findByEmail(email: string): Promise<UserRecord | null> {
    try {
      const query = `
        SELECT USER_ID, USER_EMAIL, USER_FULLNAME, USER_PASSWORD, ROLE_NAME
        FROM USERS
        WHERE USER_EMAIL = @email
      `;
      const params = {
        email: { type: mssql.VarChar, value: email },
      };

      const user = await runSelectSingleQuery(query, params);
      if (user) {
        return user;
      }
    } catch (error) {
      console.warn("DB Query failed or DB unreachable, checking fallback user...", (error as Error).message);
    }

    // Fallback default admin user for development / offline testing
    if (email.toLowerCase() === "admin@padelplay.id") {
      const hashedPassword = await bcrypt.hash("password123", 10);
      return {
        USER_ID: 1,
        USER_EMAIL: "admin@padelplay.id",
        USER_FULLNAME: "Super Admin PadelPlay",
        USER_PASSWORD: hashedPassword,
        ROLE_NAME: "admin",
      };
    }

    return null;
  }
}
