import express from "express";
import loginRoute from "./login/login-jwt";
import logoutRoute from "./logout/logout";
import verifyToken from "../../middleware/validators/verify-token";
import { UserModel } from "../../model/user.model";

const router = express.Router();
export default function authRouter() {
  router.use("/login", loginRoute());
  router.use("/logout", logoutRoute());

  router.get("/me", verifyToken, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const email = req.user.email;
    const userFromDb = email ? await UserModel.findByEmail(email) : null;

    return res.status(200).json({
      id: userFromDb?.USER_ID ?? req.user.id ?? 1,
      name: userFromDb?.USER_FULLNAME ?? req.user.name ?? email ?? "Admin",
      email: userFromDb?.USER_EMAIL ?? email,
      role: userFromDb?.ROLE_NAME ?? req.user.role ?? "admin",
    });
  });

  router.get("/", (req, res) => {
    res.send("Welcome to the authentication routes");
  });

  return router;
}
