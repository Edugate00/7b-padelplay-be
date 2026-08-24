import mssql from "mssql";

export interface ISerilizeUser {
  UserID: string;
  Fullname: string;
  IsVerified: boolean;
  ProfilePicture: string | null;
  Location: string;
  TokenID: string;
  Email: string;
  PhoneNumber: string;
  Role: string;
  RoleDesc: string;
  MemberDesc: string;
  IsGoogleAccount: string;
}

export interface IRefreshToken {
  serializeUser: ISerilizeUser;
  freshToken: string;
}

export interface IResponseUserByID extends IResponseUserByEmail {
  USER_EMAIL: string;
}

export interface IResponseUserByEmail {
  USER_ID: string;
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

export interface IResponsegetUserBySalesOrder {
  Fullname: string;
  Phone: string;
  Email: string;
}

export interface JwtPayload {
  serilizedUser: ISerilizeUser;
  iat: number;
  exp: number;
  iss: string;
}

export interface CustomVerifyJWT {
  errorName: "TokenNotFound" | "TokenAlreadyUsed" | "TokenExpiredError";
  message: string;
}

export interface IAxiosAuthErrorList {
  errors: IAxiosAuthError[];
}

export interface IAxiosAuthError {
  location: string;
  msg: string;
  path: string;
  type: string;
  value: string;
}

export interface IPayloadCreateToken {
  TokenID: string;
  Token: string;
  UserID: string;
  IsUsed: string;
  ValidFromDate: string;
  ValidFromTime: string;
  ValidToDate: string;
  ValidToTime: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface IResponseCreateOauthUser {
  message: string;
  success: boolean;
  statusCode: number;
  userID: string;
}

export interface IUserProfile {
  Fullname: string;
  Email: string;
  IsVerified: boolean;
  ProfileImage: string;
  MemberDesc: string;
  PhoneNumber: string;
  Role: string;
  RoleDesc: string;
  IsGoogleAccount: boolean;
}

export interface IBodyToken {
  Email: string;
  UserID: string;
  TokenID: string;
  Location: string;
}

export interface IAuthorizationCredentials {
  cookie: Array<string>;
  csrf: string;
}

export interface IResponseUserProfile {
  name: string;
  gender: string;
  location: string;
  code: string;
}

export interface IDecryptedJWT {
  serilizedUser: IBodyToken;
  iat: number;
  exp: number;
  iss: string;
}

export interface ITokenCredentialsPayload {
  Token: string;
  UserID: string;
  TokenID: string;
}

export interface IPayloadUpdateToken extends ITokenCredentialsPayload {
  UpdatedAt: string;
}

export interface ITokenCredentials {
  IS_USED: string;
  VALID_FROM_DATE: string;
  VALID_FROM_TIME: string;
  VALID_TO_DATE: string;
  VALID_TO_DATE_TIME: string;
}

export interface IResetPassword {
  UserID: string;
  UserEmail: string;
  NewPassword: string;
}

export interface IErrorMSSQL {
  message: string;
  messageDetail: mssql.ConnectionError;
  statusCode: number;
}
