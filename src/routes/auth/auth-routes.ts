import express from "express";
import loginRoute from "./login/login-jwt";
import logoutRoute from "./logout/logout";

const router = express.Router();

export default function authRouter() {
  router.use("/login", loginRoute());
  router.use("/logout", logoutRoute());

  router.get("/", (req, res) => {
    res.send("Welcome to the authentication routes");
  });

  return router;
}
