import jwt, { JwtPayload } from "jsonwebtoken";
import CryptoJS from "crypto-js";
import {
  CustomVerifyJWT,
  IPayloadCreateToken,
  ISerilizeUser,
  ITokenCredentials,
  ITokenCredentialsPayload,
} from "../interfaces/auth/auth-interfaces";
import { config } from "dotenv";
import { setDateFormatted, setTimeFormatted } from "./dateTime-utils";
import { createNewToken, getTokenCredentials } from "../model/token";
import { generateDynamicExpiresJWT } from "./jwt";
import createUUID from "./uuidGenerator";
import { IDataToJWT } from "../types/user/types-user";
import { JwtExpires } from "../types/token/types-token";

config();
const SECRET_KEY = process.env.SECRET_KEY_ENC_DEC as string;

export function encryptText(text: string) {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

export function decryptId(encryptedText: string) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function generateJWT(serilizedUser: ISerilizeUser) {
  const jwtSecretToken = process.env.SECRET_KEY_JWT as string;
  return jwt.sign(
    {
      serilizedUser,
    },
    jwtSecretToken,
    {
      expiresIn: "24h", // Set 24 hours
      issuer: process.env.BACKEND_BASE_URL, // --> Alamat tukang bikin jwt
    },
  );
}

export function verifyJWT(jwtToken: string) {
  return new Promise((resolve, reject) => {
    const jwtSecretToken = process.env.SECRET_KEY_JWT as string;
    try {
      const decoded = jwt.verify(jwtToken, jwtSecretToken);
      resolve(decoded);
    } catch (error: jwt.VerifyErrors | unknown) {
      const jwtError = error as jwt.VerifyErrors;
      reject({
        errorName: jwtError.name,
        message: jwtError.message,
      } as CustomVerifyJWT);
    }
  });
}

export async function verifyJwtToken(strToken: string) {
  const decryptedJWT = (await verifyJWT(strToken)) as JwtPayload;
  const encryptedUserID = decryptedJWT.serilizedUser.UserID;
  const decryptedUserID = decryptId(encryptedUserID);

  // --> Check status usage
  const payload = {
    Token: strToken,
    UserID: decryptedUserID,
    TokenID: decryptedJWT.serilizedUser.TokenID,
  } as ITokenCredentialsPayload;
  const tokenCredentials = (await getTokenCredentials(
    payload,
  )) as ITokenCredentials[];

  // --> token not found
  if (tokenCredentials.length === 0) {
    const error: CustomVerifyJWT = {
      errorName: "TokenNotFound",
      message: "Token Not found",
    };
    throw error;
  }

  // --> token already used
  const tokenCredential = tokenCredentials[0];
  if (tokenCredential && tokenCredential.IS_USED === "X") {
    const error = {
      errorName: "TokenAlreadyUsed",
      message: "Token Already Used",
    } as CustomVerifyJWT;
    throw error;
  }

  return {
    TokenID: decryptedJWT.serilizedUser.TokenID,
  };
}

export async function dynamicExpiresJWT(
  serilizedUser: ISerilizeUser,
  expiresIn: JwtExpires,
): Promise<string> {
  const jwtSecretToken = process.env.SECRET_KEY_JWT;
  if (!jwtSecretToken) {
    throw new Error("SECRET_KEY_JWT is not set");
  }

  const tokenID = createUUID();

  // data yang akan di-embed ke JWT
  const userCredentials = {
    Email: serilizedUser.Email,
    UserID: serilizedUser.UserID,
    Location: serilizedUser.Location,
  };

  const dataToEmbed: IDataToJWT = {
    ...userCredentials,
    TokenID: tokenID,
  };

  const token = jwt.sign({ serilizedUser: dataToEmbed }, jwtSecretToken, {
    expiresIn, // string atau number
    issuer: process.env.BACKEND_BASE_URL ? String(process.env.BACKEND_BASE_URL) : 'http://localhost:8000', // alamat pembuat JWT (opsional tapi baik diisi)
  });

  // Waktu sekarang & format tampilan
  const now = new Date();
  const validFromDate = setDateFormatted(now);
  const validFromTime = setTimeFormatted(now);

  // Hitung expired (Date) berdasarkan expiresIn
  const validTo = generateDynamicExpiresJWT(expiresIn, now);
  const validToDate = setDateFormatted(validTo);
  const validToTime = setTimeFormatted(validTo);

  // Siapkan payload untuk disimpan ke DB / storage
  const payload: IPayloadCreateToken = {
    CreatedAt: validFromDate,
    UpdatedAt: validFromDate,
    IsUsed: "",
    Token: token,
    TokenID: tokenID,
    UserID: decryptId(serilizedUser.UserID),
    ValidFromDate: validFromDate,
    ValidFromTime: validFromTime,
    ValidToDate: validToDate,
    ValidToTime: validToTime,
  };

  await createNewToken(payload);
  return token;
}
