import type http from "http";
import { TokenPayload, TokenUtil } from "../utils/token.util";

export interface AuthResult {
  authenticated: boolean;
  token?: TokenPayload;
  error?: string;
}

export class AuthMiddleware {
  /**
   * Extract token from URL query params or headers
   */
  static extractToken(req: http.IncomingMessage): string | null {
    try {
      // Try query parameter first
      const url = new URL(req.url || "", `http://${req.headers.host}`);
      const tokenFromQuery = url.searchParams.get("token");

      if (tokenFromQuery) {
        return tokenFromQuery;
      }

      // Try Authorization header
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.substring(7);
      }

      return null;
    } catch (error) {
      // wsLogger.monitoring.error("token-extraction", error);
      return null;
    }
  }

  /**
   * Require controller role
   */
  static requireController(token: TokenPayload): boolean {
    return token.role === "controller" || token.role === "admin";
  }

  /**
   * Check permission
   */
  static hasPermission(token: TokenPayload, permission: string): boolean {
    return TokenUtil.hasPermission(token, permission);
  }

  /**
   * Validate match access
   */
  static canAccessMatch(token: TokenPayload, matchId: string): boolean {
    return TokenUtil.isValidForMatch(token, matchId);
  }
}
