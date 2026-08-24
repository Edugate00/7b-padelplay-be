import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const TOKEN_EXPIRY = "24h";

export interface TokenPayload {
  deviceId?: string;
  email?: string;
  role: "controller" | "display" | "admin";
  courtId?: string;
  matchId?: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

export class TokenUtil {
  /**
   * Generate JWT token untuk WebSocket connection
   */
  static generateToken(payload: Omit<TokenPayload, "iat" | "exp">): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });
  }

  /**
   * Verify and decode JWT token
   */
  static verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  }

  /**
   * Generate temporary controller token untuk specific match
   */
  static generateControllerToken(
    matchId: string,
    deviceId: string,
    email?: string,
  ): string {
    return this.generateToken({
      deviceId,
      email,
      role: "controller",
      matchId,
      permissions: ["update_score", "update_match", "batch_update_scores"],
    });
  }

  /**
   * Generate display token (read-only)
   */
  static generateDisplayToken(matchId: string, courtId?: string): string {
    return this.generateToken({
      role: "display",
      matchId,
      courtId,
      permissions: ["view_score"],
    });
  }

  /**
   * Check if token has specific permission
   */
  static hasPermission(token: TokenPayload, permission: string): boolean {
    return token.permissions.includes(permission);
  }

  /**
   * Validate token for specific match
   */
  static isValidForMatch(token: TokenPayload, matchId: string): boolean {
    // Admin can access any match
    if (token.role === "admin") return true;

    // Check if token is for this specific match
    return token.matchId === matchId;
  }

  /**
   * Generate API key untuk server-to-server communication
   */
  static generateApiKey(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  /**
   * Hash API key for storage
   */
  static hashApiKey(apiKey: string): string {
    return crypto.createHash("sha256").update(apiKey).digest("hex");
  }

  /**
   * Verify API key
   */
  static verifyApiKey(apiKey: string, hashedKey: string): boolean {
    const hash = this.hashApiKey(apiKey);
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hashedKey));
  }
}

// Export helper functions
export const generateControllerToken = TokenUtil.generateControllerToken;
export const generateDisplayToken = TokenUtil.generateDisplayToken;
export const verifyToken = TokenUtil.verifyToken;
