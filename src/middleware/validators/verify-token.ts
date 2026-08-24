import { NextFunction, Request, Response } from "express";
import {
  IRefreshToken,
  IResponseUserByID,
  ISerilizeUser,
  JwtPayload,
} from "../../interfaces/auth/auth-interfaces";
import { decryptId, generateJWT, verifyJWT } from "../../utils/encryptDecrpyt";
import { getUserByID } from "../../model/auth/user/user";

export default async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader =
    (req.headers?.authorization as string) ||
    (req.cookies?.authToken as string) ||
    (req.cookies?.token as string);

  if (!authHeader) {
    res.status(401).json({
      statusCode: 401,
      message: "Token not found",
    });
    return;
  }

  // --> get token
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decodedToken = (await verifyJWT(token as string)) as JwtPayload;

    // --> Get fresh user data from SAP DB
    const encryptedUserID = decodedToken.serilizedUser.UserID;
    const decryptedUserID = decryptId(encryptedUserID);
    const userData = (await getUserByID(decryptedUserID)) as IResponseUserByID;

    // --> user not found and will return Unauthorized (401)
    if (!userData) {
      res.status(401).json({
        statusCode: 401,
        message: "User data is undefined",
      });
      return;
    }

    const fullUser = {
      UserID: encryptedUserID,
      Fullname: (userData.USER_FULLNAME || "").trim(),
      Email: (userData.USER_EMAIL || decodedToken.serilizedUser?.Email || "").trim(),
      IsVerified: userData.IS_VERIFIED === "X",
      ProfilePicture: userData.USER_PROFILE_PICT ?? null,
      Location: userData.LOCATION || "",
      TokenID: decodedToken.serilizedUser.TokenID || "",
      PhoneNumber: userData.PHONE_NUMBER || "",
      Role: userData.ROLE_NAME || "",
      RoleDesc: userData.ROLE_DESC || "",
      MemberDesc: userData.MEMBER_NAME || "",
      IsGoogleAccount: userData.IS_GOOGLE_ACC || "",
    } as ISerilizeUser;

    const newToken = generateJWT(fullUser);
    const freshCredentials = {
      freshToken: newToken,
      serializeUser: fullUser,
      user: fullUser,
    };

    req.user = freshCredentials;
    next();
  } catch (error) {
    res.status(401).json({
      statusCode: 401,
      error,
    });
  }
}
