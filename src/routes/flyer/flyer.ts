import express from "express";
import multer from "multer";
import mssql from "mssql";
import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";
import verifyToken from "../../middleware/validators/verify-token";
import { encryptFile } from "../../utils/encrypt/encryptFile";
import { deleteImageController, getAllImagesController, insertImageFileToDb, updateImageFromDb, uploadImageController } from "../../controllers/sponsors/sponsor";
import { deleteFlyerImageController, getAllFlyersController, insertFlyerImageFileToDb, updateThumbnailsController } from "../../controllers/flyers/flyer";
import { deleteFlyerImage } from "../../model/flyer";
import { upload } from "../sponsor/sponsor";

const router = express.Router();

export const flyerUploadDirectory = path.resolve("assets", "images", "flyer");

export default function flyerRouter() {
    router.get("/images/:filename", (req, res) => {
        const filename = path.basename(req.params.filename);
        return res.sendFile(filename, { root: flyerUploadDirectory }, (error) => {
            if (error && !res.headersSent) {
                res.status(404).json({
                    success: false,
                    message: "Gambar tidak ditemukan",
                });
            }
        });
    });
    router.get("/images", getAllFlyersController);

    router.post(
        "/images", verifyToken, uploadImageController, insertFlyerImageFileToDb
    );

    router.put(
        "/images/:id", verifyToken, uploadImageController, updateImageFromDb
    );

    router.put("/thumbnails", verifyToken,
        upload.fields([
            { name: "thumbnail1", maxCount: 1 },
            { name: "thumbnail2", maxCount: 1 },
            { name: "thumbnail3", maxCount: 1 },
        ]), updateThumbnailsController)

    router.delete("/images", verifyToken, deleteFlyerImageController);


    router.get("/", (req, res) => {
        res.send("Welcome to the flyer routes");
    });

    return router;
}