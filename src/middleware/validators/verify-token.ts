import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenUtil, TokenPayload } from "../../utils/token.util";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload | any;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.query && req.query.token) {
      token = req.query.token as string;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Akses ditolak. Token tidak ditemukan.",
      });
    }

    const decoded = TokenUtil.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau telah kadaluarsa.",
      });
    }

    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Gagal memverifikasi token.",
    });
  }
};

export default verifyToken;
