import { getUserByEmail } from "./auth/user/user";

export interface UserRecord {
  USER_ID: string | number;
  USER_EMAIL: string;
  USER_FULLNAME: string;
  USER_PASSWORD?: string;
  ROLE_NAME?: string;
}

export class UserModel {
  /**
   * Find user by email from SAP MSSQL DB (trn.ZUSERS)
   */
  static async findByEmail(email: string): Promise<UserRecord | null> {
    try {
      // Priority 1: Check receptionist / staff user (MEMBER_ID = 'ZR')
      let users = await getUserByEmail(email, true);

      // Priority 2: Check general customer user (MEMBER_ID != 'ZR')
      if (!users || users.length === 0) {
        users = await getUserByEmail(email, false);
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
}
