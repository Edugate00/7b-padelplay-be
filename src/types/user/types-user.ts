import { ISerilizeUser } from "../../interfaces/auth/auth-interfaces";

export type IDataToJWT = Pick<
  ISerilizeUser,
  "Email" | "UserID" | "Location"
> & { TokenID: string };
