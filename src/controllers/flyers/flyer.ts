import { NextFunction, Request, Response } from "express";
import { deleteAdvImage, getAdvImageById, getAdvImages, insertAdvImage, removeStoredImage, updateAdvImage, validateAdvPayload, validateFlyerPayload } from "../../model/sponsor";
import { upload, sponsorUploadDirectory } from "../../routes/sponsor/sponsor";
import { IPayloadInsertAdv } from "../../interfaces/sponsor/sponsor-interfaces";
import fs from "fs";
import path from "path";
import { logger } from "../../config/logger/pino";
import { getDatePartsInTimezone } from "../../interfaces/utils/date";
import { deleteFlyerImage, getFlyerImages, insertFlyerImage } from "../../model/flyer";

const toFullUrl = (value: string) =>
    /^https?:\/\//i.test(value)
        ? value
        : `${process.env.BACKEND_BASE_URL}/assets/images/flyer/${path.basename(value).toLowerCase()}`;

export const getAllFlyersController = async (req: Request, res: Response) => {
    try {
        const flyerImages = await getFlyerImages({
            distChan:
                typeof req.query.dist_chan === "string"
                    ? req.query.dist_chan
                    : undefined,
        });

        const convertedImages = flyerImages.map((fi, idx) => {
            return {
                id: idx + 1,
                ...fi
            }
        })

        return res.status(200).json({
            success: true,
            data: convertedImages
        });
    } catch (error) {
        console.error("Gagal mengambil data gambar:", error);
        return res
            .status(500)
            .json({ success: false, message: "Gagal mengambil data gambar" });
    }
}

export const insertFlyerImageFileToDb = async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
        return res
            .status(400)
            .json({ success: false, message: "File gambar wajib diisi" });
    }

    const body = req.body as Record<string, unknown>;
    const payload = {
        imgUrl: `/assets/images/flyer/${file.filename}`,
        distChan: String(body.distChan ?? ""),
        imgType: String(body.imgType ?? 'FLYER')
    };
    
    const errors = validateFlyerPayload(payload);

    if (errors.length) {
        fs.unlink(file.path, () => { });
        return res
            .status(400)
            .json({ success: false, message: errors.join(", ") });
    }

    try {
        await insertFlyerImage(payload);
        return res.status(201).json({
            success: true,
            data: {
                ...payload,
                img_url: toFullUrl(payload.imgUrl),
            },
        });
    } catch (error) {
        fs.unlink(file.path, () => { });
        console.error("Gagal menyimpan gambar:", error);
        return res
            .status(500)
            .json({ success: false, message: "Gagal upload gambar" });
    }
}

export const deleteFlyerImageController = async (req: Request, res: Response) => {
    const { imgUrl } = req.body;

    if (typeof imgUrl !== "string" || !imgUrl.trim()) {
        return res.status(400).json({
            success: false,
            message: "Image URL is required",
        });
    }

    try {
        const deletedImage = await deleteFlyerImage(imgUrl);
        if (deletedImage === undefined) {
            return res.status(404).json({ success: false, message: "Gambar tidak ditemukan" });
        }

        try {
            await removeStoredImage(deletedImage, sponsorUploadDirectory);
        } catch (cleanupError) {
            console.error("Gagal menghapus file gambar:", cleanupError);
        }
        return res.status(200).json({ success: true, message: "Gambar berhasil dihapus" });
    } catch (error) {
        console.error("Gagal menghapus gambar:", error);
        return res.status(500).json({ success: false, message: "Gagal menghapus gambar" });
    }
}