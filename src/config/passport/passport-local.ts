import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import { PassportStatic } from "passport";
import {
  IResponseUserByEmail,
  ISerilizeUser,
} from "../../interfaces/auth/auth-interfaces";
import { getUserReceptionist } from "../../model/auth/user/user";
import { encryptText } from "../../utils/encryptDecrpyt";

export default function (passport: PassportStatic) {
  passport.use(
    new Strategy(
      {
        usernameField: "email", // --> login with email and password
        passwordField: "password",
      },

      async (email, password, done) => {
        /* -------------------------------------------------------------------------- */
        /*                               login scenario                               */
        /* -------------------------------------------------------------------------- */
        const userEmail = email.toLowerCase(); // --> email lowercase

        try {
          // Validating email
          const [user] = (await getUserReceptionist(
            userEmail
          )) as IResponseUserByEmail[];
          
          if (!user) {
            return done(null, false, {
              message: "Incorrect email or password",
            });
          }

          // Check password match
          const passIsMatch = await bcrypt.compare(
            password + process.env.SECRET_HASHING,
            user.USER_PASSWORD
          );
          if (!passIsMatch) {
            return done(null, false, {
              message: "Incorrect email or password",
            });
          }

          // Successful login, prepare user data
          const encryptedID = encryptText(user.USER_ID.trim());
          const serializedUser = {
            Fullname: user.USER_FULLNAME.trim(),
            IsVerified: user.IS_VERIFIED === "X",
            UserID: encryptedID,
            Email: userEmail,
            ProfilePicture: user.USER_PROFILE_PICT,
            PhoneNumber: user.PHONE_NUMBER,
            Location: user.LOCATION,
            Role: user.ROLE_NAME,
            RoleDesc: user.ROLE_DESC,
            MemberDesc: user.MEMBER_NAME,
            IsGoogleAccount: user.IS_GOOGLE_ACC,
          } as ISerilizeUser;

          done(null, serializedUser);
        } catch (error) {
          done(error);
        }
      }
    )
  );
}
