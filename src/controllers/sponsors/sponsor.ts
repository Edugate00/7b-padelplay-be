import { NextFunction, Request, Response } from "express";
import { deleteAdvImage, getAdvImageById, getAdvImages, insertAdvImage, removeStoredImage, updateAdvImage, validateAdvPayload } from "../../model/sponsor";
import { upload, uploadDirectory } from "../../routes/sponsor/sponsor";
import { IPayloadInsertAdv } from "../../interfaces/sponsor/sponsor-interfaces";
import fs from "fs";
import path from "path";
import { logger } from "../../config/logger/pino";
import { getDatePartsInTimezone } from "../../interfaces/utils/date";

const toFullUrl = (value: string) =>
    /^https?:\/\//i.test(value)
        ? value
        : `${process.env.BACKEND_BASE_URL}/assets/images/sponsor/${path.basename(value).toLowerCase()}`;

export const getAllImagesController = async (req: Request, res: Response) => {
    try {
        const rows = await getAdvImages({
            court:
                typeof req.query.court === "string" ? req.query.court : undefined,
            distChan:
                typeof req.query.dist_chan === "string"
                    ? req.query.dist_chan
                    : undefined,
        });

        return res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("Gagal mengambil data gambar:", error);
        return res
            .status(500)
            .json({ success: false, message: "Gagal mengambil data gambar" });
    }
}

export const uploadImageController = (req: Request, res: Response, next: NextFunction) => {
    upload.single("image")(req, res, (error) => {
        if (error) {
            return res.status(400).json({
                success: false,
                message:
                    error instanceof Error ? error.message : "Upload gambar gagal",
            });
        }
        next();
    });
}

export const insertImageFileToDb = async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
        return res
            .status(400)
            .json({ success: false, message: "File gambar wajib diisi" });
    }

    const body = req.body as Record<string, unknown>;
    const payload: IPayloadInsertAdv = {
        validFrom: String(body.validFrom ?? ""),
        validTo: String(body.validTo ?? ""),
        showIndicator:
            body.showIndicator === "X" || body.showIndicator === "true"
                ? "X"
                : "",
        imgUrl: `/assets/images/sponsor/${file.filename}`,
        duration: String(body.duration ?? ""),
        qrUrl: String(body.qrUrl ?? ""),
        court: String(body.court ?? ""),
        distChan: String(body.distChan ?? ""),
    };

    const errors = validateAdvPayload(payload);

    if (errors.length) {
        fs.unlink(file.path, () => { });
        return res
            .status(400)
            .json({ success: false, message: errors.join(", ") });
    }

    try {
        const inserted = await insertAdvImage(payload);
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

export const updateImageFromDb = async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

    try {
        const existing = await getAdvImageById(id);
        if (!existing) {
            if (req.file) await removeStoredImage(req.file.filename, uploadDirectory);
            return res.status(404).json({ success: false, message: "Gambar tidak ditemukan" });
        }

        const currentDateParts = getDatePartsInTimezone("Asia/Jakarta");
        const currentDate = `${currentDateParts.year}${String(currentDateParts.month).padStart(2, "0")}${String(currentDateParts.day).padStart(2, "0")}`;
        const body = req.body as Record<string, unknown>;
        const payload: IPayloadInsertAdv = {
            validFrom: String(body.validFrom ?? existing.validFrom),
            validTo:
                (body.showIndicator === "X" || body.showIndicator === "true")
                    ? Math.max(
                        Number(body.validTo ?? existing.validTo),
                        Number(currentDate)
                    ).toString().padStart(8, "0")
                    : String(body.validTo ?? existing.validTo),
            showIndicator:
                body.showIndicator === undefined
                    ? existing.showIndicator
                    : body.showIndicator === "X" || body.showIndicator === "true"
                        ? "X"
                        : "",
            imgUrl: req.file
                ? `/assets/images/sponsor/${req.file.filename}`
                : existing.imgUrl,
            duration: String(body.duration ?? existing.duration),
            qrUrl: String(body.qrUrl ?? existing.qrUrl),
            court: String(body.court ?? existing.court),
            distChan: String(body.distChan ?? existing.distChan),
        };

        const errors = validateAdvPayload(payload);
        if (errors.length) {
            if (req.file) await removeStoredImage(req.file.filename, uploadDirectory);
            return res.status(400).json({ success: false, message: errors.join(", ") });
        }

        logger.info({ payload }, "Update image payload")

        const updated = await updateAdvImage(id, payload);
        if (!updated) {
            if (req.file) await removeStoredImage(req.file.filename, uploadDirectory);
            return res.status(404).json({ success: false, message: "Gambar tidak ditemukan" });
        }

        if (req.file && existing.imgUrl !== payload.imgUrl) {
            try {
                await removeStoredImage(existing.imgUrl, uploadDirectory);
            } catch (cleanupError) {
                console.error("Gagal menghapus file gambar lama:", cleanupError);
            }
        }

        return res.status(200).json({
            success: true,
            data: updated,
        });
    } catch (error) {
        if (req.file) await removeStoredImage(req.file.filename, uploadDirectory);
        console.error("Gagal memperbarui gambar:", error);
        return res.status(500).json({ success: false, message: "Gagal memperbarui gambar" });
    }
}

export const deleteImageController = async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
    if (!/^\d{1,3}$/.test(id)) {
        return res.status(400).json({ success: false, message: "ID tidak valid" });
    }
    const recordId = id.padStart(3, "0");

    try {
        const deletedImage = await deleteAdvImage(recordId);
        if (deletedImage === undefined) {
            return res.status(404).json({ success: false, message: "Gambar tidak ditemukan" });
        }

        try {
            await removeStoredImage(deletedImage, uploadDirectory);
        } catch (cleanupError) {
            console.error("Gagal menghapus file gambar:", cleanupError);
        }
        return res.status(200).json({ success: true, message: "Gambar berhasil dihapus" });
    } catch (error) {
        console.error("Gagal menghapus gambar:", error);
        return res.status(500).json({ success: false, message: "Gagal menghapus gambar" });
    }
}