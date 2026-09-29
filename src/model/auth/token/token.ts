import { runUpdateQuery } from "../../../config/db/db-helperQuery";
import {
  IErrorMSSQL,
  IResetPassword,
  IResponseCreateOauthUser,
} from "../../../interfaces/auth/auth-interfaces";
import mssql from "mssql";

export async function resetPasswordHandler(payload: IResetPassword) {
  try {
    const MANDT = process.env.CLIENT;
    const query = `
        UPDATE trn.ZUSERS 
         SET 
          USER_PASSWORD = @new_password
         WHERE 
          USER_ID = @user_id 
          AND MANDT = @client
          AND USER_EMAIL = @user_email
          AND MEMBER_ID = 'ZR'
        `;

    await runUpdateQuery(query, {
      new_password: {
        type: mssql.Char(60),
        value: payload.NewPassword,
      },
      user_id: {
        type: mssql.Char(36),
        value: payload.UserID,
      },
      user_email: {
        type: mssql.Char(255),
        value: payload.UserEmail,
      },
      client: {
        type: mssql.Char(3),
        value: MANDT,
      },
    });

    const responseResetPassword = {
      message: "Reset password sucess",
      statusCode: 201,
    } as IResponseCreateOauthUser;
    return responseResetPassword;
  } catch (error) {
    console.error(error);
    const err = {
      message: "Error verification user",
      messageDetail: error as mssql.ConnectionError,
      statusCode: 501,
    } as IErrorMSSQL;
    return err;
  }
}
