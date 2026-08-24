import express from "express";
import verifyToken from "../../../middleware/validators/verify-token";
import { loginJWTController } from "../../../controllers/auth-controller/login/login-jwt";
import { validateLoginBody } from "../../../utils/validator/validator-auth";
const router = express.Router();
export default function loginRoute() {
  router.post("/", validateLoginBody, loginJWTController);

  router.get("/refresh-credentials", verifyToken, (req, res) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    return res.status(200).json(req.user);
  });

  return router;
}
