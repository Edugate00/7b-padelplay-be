export interface TokenPayload {
  sub: string;
  role: "admin" | "controller" | "user";

  /**
   * Permissions granted to this token.
   */
  permissions?: string[];

  /**
   * Match IDs this token is allowed to access.
   *
   * If omitted/null, access can be handled according to
   * your application's default authorization policy.
   */
  matchIds?: string[];

  /**
   * JWT issued-at timestamp.
   */
  iat?: number;

  /**
   * JWT expiration timestamp.
   */
  exp?: number;

  /**
   * Allow additional claims from the JWT.
   */
  [key: string]: unknown;
}

import jwt, {
  JwtPayload,
  SignOptions,
  VerifyOptions,
} from "jsonwebtoken";

export class TokenUtil {
  private static readonly JWT_SECRET =
    process.env.JWT_SECRET || "development-secret";

  /**
   * Verify JWT and return its payload.
   */
  static verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(
        token,
        this.JWT_SECRET
      ) as JwtPayload & Partial<TokenPayload>;

      if (!decoded) {
        return null;
      }

      if (typeof decoded.sub !== "string") {
        return null;
      }

      if (
        decoded.role !== "admin" &&
        decoded.role !== "controller" &&
        decoded.role !== "user"
      ) {
        return null;
      }

      return {
        ...decoded,
        sub: decoded.sub,
        role: decoded.role,
        permissions: Array.isArray(decoded.permissions)
          ? decoded.permissions.filter(
              (permission): permission is string =>
                typeof permission === "string"
            )
          : [],
        matchIds: Array.isArray(decoded.matchIds)
          ? decoded.matchIds.filter(
              (matchId): matchId is string =>
                typeof matchId === "string"
            )
          : [],
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Check whether the token contains a specific permission.
   */
  static hasPermission(
    token: TokenPayload,
    permission: string
  ): boolean {
    if (token.role === "admin") {
      return true;
    }

    return token.permissions?.includes(permission) ?? false;
  }

  /**
   * Check whether the token is valid for a specific match.
   */
  static isValidForMatch(
    token: TokenPayload,
    matchId: string
  ): boolean {
    // Admin can access every match.
    if (token.role === "admin") {
      return true;
    }

    // If the token has explicit match restrictions,
    // the requested match must be included.
    if (token.matchIds && token.matchIds.length > 0) {
      return token.matchIds.includes(matchId);
    }

    return false;
  }

  /**
   * Check whether the token has one of the specified roles.
   */
  static hasRole(
    token: TokenPayload,
    ...roles: TokenPayload["role"][]
  ): boolean {
    return roles.includes(token.role);
  }

  /**
   * Check whether the token has expired.
   */
  static isExpired(token: TokenPayload): boolean {
    if (!token.exp) {
      return false;
    }

    return Date.now() >= token.exp * 1000;
  }

  /**
   * Check whether the token is currently valid.
   */
  static isValid(token: TokenPayload): boolean {
    return !this.isExpired(token);
  }

  /**
   * Generate a JWT.
   */
  static generateToken(
    payload: TokenPayload,
    options?: SignOptions
  ): string {
    return jwt.sign(
      payload,
      this.JWT_SECRET,
      options
    );
  }

  /**
   * Decode a JWT without verifying its signature.
   *
   * Useful for debugging only.
   */
  static decodeToken(
    token: string
  ): TokenPayload | null {
    try {
      const decoded = jwt.decode(token);

      if (!decoded || typeof decoded !== "object") {
        return null;
      }

      return decoded as TokenPayload;
    } catch {
      return null;
    }
  }
}