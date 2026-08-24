import { SignOptions } from "jsonwebtoken";

export type JwtExpires = NonNullable<SignOptions["expiresIn"]>;
