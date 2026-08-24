import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../../../model/user.model";
import { TokenUtil } from "../../../utils/token.util";

export const loginJWTController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        success: false,
        message: "Email dan password wajib diisi.",
      });
    }

    const user = await UserModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah.",
      });
    }

    let isPasswordValid = false;
    if (user.USER_PASSWORD) {
      if (user.USER_PASSWORD.startsWith("$2a$") || user.USER_PASSWORD.startsWith("$2b$")) {
        isPasswordValid = await bcrypt.compare(password, user.USER_PASSWORD);
      } else {
        isPasswordValid = password === user.USER_PASSWORD;
      }
    }

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah.",
      });
    }

    const role = user.ROLE_NAME || "admin";
    const token = TokenUtil.generateToken({
      email: user.USER_EMAIL,
      role: role as "admin" | "controller" | "display",
      permissions: ["read", "write", "admin"],
    });

    return res.status(200).json({
      token,
      user: {
        id: user.USER_ID,
        name: user.USER_FULLNAME,
        email: user.USER_EMAIL,
        role: role,
      },
    });
  } catch (error) {
    console.error("Login Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan internal pada server.",
    });
  }
};
