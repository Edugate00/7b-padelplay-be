import mssql from "mssql";
import {
  IPayloadCreateToken,
  IPayloadUpdateToken,
  IResponseCreateOauthUser,
  ITokenCredentials,
  ITokenCredentialsPayload,
} from "../../interfaces/auth/auth-interfaces";
import {
  runInsertQuery,
  runSelectQuery,
  runUpdateQuery,
} from "../../db/db-helperQuery";

export async function createNewToken(
  payload: IPayloadCreateToken
): Promise<IResponseCreateOauthUser> {
  try {
    const query = `
                INSERT INTO trn.ZTOKENS
                (
                    MANDT,
                    TOKEN_ID,
                    TOKEN,
                    USER_ID,
                    IS_USED,
                    VALID_FROM_DATE,
                    VALID_FROM_TIME,
                    VALID_TO_DATE,
                    VALID_TO_DATE_TIME,
                    CREATED_AT,
                    UPDATED_AT
                )
                VALUES (
                    @Mandt,
                    @TokenID,
                    @Token,
                    @UserID,
                    @IsUsed,
                    @ValidFromDate,
                    @ValidFromTime,
                    @ValidToDate,
                    @ValidToTime,
                    @CreatedAt,
                    @UpdatedAt
                )
    `;

    await runInsertQuery(query, {
      Mandt: {
        type: mssql.Int(),
        value: process.env.CLIENT,
      },
      TokenID: {
        type: mssql.Char(36),
        value: payload.TokenID,
      },
      Token: {
        type: mssql.VarChar(mssql.MAX),
        value: payload.Token,
      },
      UserID: {
        type: mssql.Char(10),
        value: payload.UserID,
      },
      IsUsed: {
        type: mssql.Char(1),
        value: payload.IsUsed,
      },
      ValidFromDate: {
        type: mssql.Char(8),
        value: payload.ValidFromDate,
      },
      ValidFromTime: {
        type: mssql.Char(6),
        value: payload.ValidFromTime,
      },
      ValidToDate: {
        type: mssql.Char(8),
        value: payload.ValidToDate,
      },
      ValidToTime: {
        type: mssql.Char(6),
        value: payload.ValidToTime,
      },
      CreatedAt: {
        type: mssql.Char(8),
        value: payload.CreatedAt,
      },
      UpdatedAt: {
        type: mssql.Char(8),
        value: payload.UpdatedAt,
      },
    });
    const responseCreateToken = {
      message: "Token created success",
      statusCode: 201,
    } as IResponseCreateOauthUser;
    return responseCreateToken;
  } catch (error) {
    const err = {
      message: "Error creating token",
      messageDetail: error,
      statusCode: 501,
    };
    throw err;
  }
}

export async function deleteToken(
  tokenID: string,
  userID: string
): Promise<IResponseCreateOauthUser> {
  try {
    const query = `
              DELETE trn.ZTOKENS
                WHERE
                  USER_ID = @UserID
                  AND TOKEN_ID = @TokenID
            `;
    await runUpdateQuery(query, {
      UserID: {
        type: mssql.Char(10),
        value: userID,
      },
      TokenID: {
        type: mssql.Char(36),
        value: tokenID,
      },
    });
    const responseDeletedToken = {
      message: "Token deleted",
      statusCode: 200,
    } as IResponseCreateOauthUser;
    return responseDeletedToken;
  } catch (error) {
    const err = {
      message: "Error deleting token",
      messageDetail: error,
      statusCode: 501,
    };
    throw err;
  }
}

export async function getTokenCredentials(
  payload: ITokenCredentialsPayload
): Promise<ITokenCredentials[]> {
  try {
    const query = `
                SELECT TOP 1 IS_USED, VALID_FROM_DATE, VALID_FROM_TIME, VALID_TO_DATE, VALID_TO_DATE_TIME
                FROM trn.ZTOKENS
                WHERE
                    USER_ID = @UserID
                    AND TOKEN_ID = @TokenID
            `;
    const result = await runSelectQuery(query, {
      UserID: {
        type: mssql.Char(10),
        value: payload.UserID,
      },
      TokenID: {
        type: mssql.Char(36),
        value: payload.TokenID,
      },
    });

    return result as ITokenCredentials[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function updateValidStatusToken(payload: IPayloadUpdateToken) {
  try {
    const query = `
            UPDATE trn.ZTOKENS
            SET
                IS_USED = 'X',
                UPDATED_AT = @UpdatedAt
            WHERE
                USER_ID = @UserID
                AND TOKEN_ID = @TokenID
                AND MANDT = @Client
        `;
    await runUpdateQuery(query, {
      UserID: {
        type: mssql.Char(10),
        value: payload.UserID,
      },
      TokenID: {
        type: mssql.Char(36),
        value: payload.TokenID,
      },
      UpdatedAt: {
        type: mssql.Char(8),
        value: payload.UpdatedAt,
      },
      Client: {
        type: mssql.Int(),
        value: process.env.CLIENT,
      },
    });
    const responseCreateToken = {
      success: true,
      message: "Token created success",
      statusCode: 201,
    };
    return responseCreateToken as IResponseCreateOauthUser;
  } catch (error) {
    console.error(error);
  }
}
