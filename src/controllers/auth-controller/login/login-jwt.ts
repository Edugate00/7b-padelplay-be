import { NextFunction, Request, Response } from "express";
import passport from "passport";
import {
  ISerilizeUser,
  IAxiosAuthErrorList,
  IUserProfile,
} from "../../../interfaces/auth/auth-interfaces";
import { dynamicExpiresJWT } from "../../../utils/encryptDecrpyt";

type PassportInfo = { message?: string } | undefined;

export const loginJWTController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "local",
    (err: unknown, user: ISerilizeUser | false, info: PassportInfo) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        const msg = info?.message ?? "Authentication failed";
        const errorList: IAxiosAuthErrorList = {
          errors: [
            {
              location: "auth",
              msg,
              path: "authentication",
              type: "authorization",
              value: "",
            },
          ],
        };
        return res.status(401).json({
          statusCode: 401,
          ...errorList,
        });
      }

      dynamicExpiresJWT(user, "24h")
        .then((jwtToken) => {
          const isProd = process.env.NODE_ENV?.toLowerCase() === "prd";

          res.cookie("authToken", jwtToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "strict",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            domain: isProd ? process.env.COOKIES_DOMAIN : undefined,
          });

          const userData: IUserProfile = {
            Fullname: user.Fullname,
            Email: user.Email,
            IsVerified: user.IsVerified,
            ProfileImage: user.ProfilePicture ?? "",
            PhoneNumber: user.PhoneNumber,
            MemberDesc: user.MemberDesc,
            Role: user.Role,
            RoleDesc: user.RoleDesc,
          };

          req.user = {
            Email: user.Email,
            UserID: user.UserID,
          };

          return res.status(200).json({
            success: true,
            message: "Login success",
            token: jwtToken,
            user: {
              id: user.UserID,
              name: user.Fullname,
              email: user.Email,
              role: user.Role,
            },
            profile: userData,
          });
        })
        .catch((tokenErr: unknown) => next(tokenErr));
    }
  )(req, res, next);
};
