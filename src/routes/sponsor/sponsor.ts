import express from "express";
import uploadImageRoute from "./uplords/uploads-image/upload-image";

const router = express.Router();

export default function sponsorRouter() {
  router.use("/uplord-image", uploadImageRoute());

  router.get("/", (req, res) => {
    res.send("Welcome to the sponsor routes");
  });

  return router;
}
