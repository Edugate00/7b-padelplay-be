import express, { Request, Response } from "express";

const router = express.Router();
export default function logoutRoute() {
  router.post("/", async (req: Request, res: Response) => {
    try {
      res.clearCookie("authToken");
      res.clearCookie("token");
      req.user = undefined;
      return res.status(200).json({
        statusCode: 200,
        message: "Logout success",
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: "Logout failed",
        error,
      });
    }
  });
  return router;
}
