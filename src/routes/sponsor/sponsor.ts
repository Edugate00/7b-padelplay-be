import express from "express";
import multer from "multer";
import mssql from "mssql";
import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";
import verifyToken from "../../middleware/validators/verify-token";
import { encryptFile } from "../../utils/encrypt/encryptFile";
import { deleteImageController, getAllImagesController, insertImageFileToDb, updateImageFromDb, uploadImageController } from "../../controllers/sponsors/sponsor";

const router = express.Router();

export const sponsorUploadDirectory = path.resolve("assets", "images", "sponsor");

const uploadRoot = path.resolve("assets", "images");

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, _file, callback) => {
      const category = req.query.category as string;

      const allowedCategories = ["sponsor", "flyer", "product"];

      if (!allowedCategories.includes(category)) {
        return callback(new Error("Invalid upload category"), "");
      }

      const destination = path.join(uploadRoot, category);

      fs.mkdir(destination, { recursive: true }, (error) => {
        if (error) return callback(error, "");

        callback(null, destination);
      });
    },

    filename: (_req, file, callback) => {
      const originalName = path.basename(file.originalname);
      const extension = path.extname(originalName);
      const filenameWithoutExtension = path.basename(
        originalName,
        extension
      );

      const sanitizedFilename = filenameWithoutExtension.replace(
        /[^a-zA-Z0-9_-]/g,
        "_"
      );

      const encryptedFilename = encryptFile(sanitizedFilename);

      callback(
        null,
        encryptedFilename
          ? `${encryptedFilename}${extension}`
          : `${randomBytes(5).toString("hex")}${extension}`
      );
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },

  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new Error("File harus berupa gambar"));
      return;
    }

    callback(null, true);
  },
});


export default function sponsorRouter() {
  router.get("/images/:filename", (req, res) => {
    const filename = path.basename(req.params.filename);
    return res.sendFile(filename, { root: sponsorUploadDirectory }, (error) => {
      if (error && !res.headersSent) {
        res.status(404).json({
          success: false,
          message: "Gambar tidak ditemukan",
        });
      }
    });
  });

  router.get("/images", getAllImagesController);
  router.post(
    "/images", verifyToken, uploadImageController, insertImageFileToDb
  );

  router.put(
    "/images/:id", verifyToken, uploadImageController, updateImageFromDb
  );

  router.delete("/images/:id", verifyToken, deleteImageController);


  router.get("/", (req, res) => {
    res.send("Welcome to the sponsor routes");
  });

  return router;
}