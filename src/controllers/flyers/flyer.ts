import { NextFunction, Request, Response } from "express";
import { deleteAdvImage, getAdvImageById, getAdvImages, insertAdvImage, removeStoredImage, updateAdvImage, validateAdvPayload, validateFlyerPayload } from "../../model/sponsor";
import { upload, sponsorUploadDirectory } from "../../routes/sponsor/sponsor";
import { IPayloadInsertAdv } from "../../interfaces/sponsor/sponsor-interfaces";
import fs from "fs";
import path from "path";
import { logger } from "../../config/logger/pino";
import { getDatePartsInTimezone } from "../../interfaces/utils/date";
import { deleteFlyerImage, findUploadedFlyerImage, getFlyerImages, insertFlyerImage, updateThumbnails, uploadSingleThumbnail } from "../../model/flyer";
import { ThumbnailInput } from "../../types/images/images-type";
import { getLastSegment } from "../../utils/commonUtils";
import { ISerilizeUser } from "../../interfaces/auth/auth-interfaces";
import { flyerUploadDirectory } from "../../routes/flyer/flyer";

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

export const updateThumbnailsController = async (req: Request, res: Response) => {
    try {
        const selections: ThumbnailInput[] = JSON.parse(
            req.body.selections
        );

        const files = req.files as
            | Record<string, Express.Multer.File[]>
            | undefined;

        const userData = req.user as {
            freshToken: string;
            serializeUser: ISerilizeUser;
            user: ISerilizeUser;
        }

        // 1. Every slot must be present.
        if (
            !Array.isArray(selections) ||
            selections.length !== 3
        ) {
            return res.status(400).json({
                message: "Exactly 3 thumbnails are required",
            });
        }

        // 2. Validate every selection before saving anything.
        for (let i = 0; i < 3; i++) {
            const selection = selections[i];
            const file = files?.[`thumbnail${i + 1}`]?.[0];

            if (
                !selection ||
                !["upload", "saved"].includes(selection.source)
            ) {
                return res.status(400).json({
                    message: `Invalid thumbnail ${i + 1}`,
                });
            }

            if (selection.source === "saved") {
                if (!selection.id || file) {
                    return res.status(400).json({
                        message: `Invalid saved thumbnail ${i + 1}`,
                    });
                }
            }

            if (selection.source === "upload" && !file) {
                return res.status(400).json({
                    message: `Thumbnail ${i + 1} requires an uploaded file`,
                });
            }
        }

        // 4. Verify that all saved images exist and belong
        //    to this user (or are otherwise accessible to them).
        const resolvedImages: {
            slot: number;
            imageUrl: string;
        }[] = [];

        for (let i = 0; i < 3; i++) {
            const selection = selections[i];

            if (selection.source === "saved") {
                resolvedImages.push({
                    slot: i + 1,
                    imageUrl: `/assets/images/flyer/${getLastSegment(selection.preview)}`,
                });
            } else if (selection.source === "upload") {
                const file = files![`thumbnail${i + 1}`][0];
                req.file = file

                if (!file) {
                    throw new Error("No image was uploaded");
                }

                const imageToBeReplaced = await findUploadedFlyerImage(`FLYER_${i+1}`, userData.user.Location)

                logger.info({imageToBeReplaced}, "image to be replaced")
                if (imageToBeReplaced) {
                    await removeStoredImage(imageToBeReplaced.imgUrl, flyerUploadDirectory)
                }

                resolvedImages.push({
                    slot: i + 1,
                    imageUrl: `/assets/images/flyer/${file.filename}`,
                });
            }
        }

        // 6. Persist the three thumbnail associations.

        await updateThumbnails(
            userData.user.Location,
            resolvedImages.sort((a, b) => a.slot - b.slot)
        );

        return res.status(200).json({
            message: "Thumbnails updated successfully",
            thumbnails: resolvedImages,
        });
    } catch (error) {
        logger.error({ error }, "Error updating thumbnails");
        return res.status(500).json({
            message: "Error updating thumbnails"
        });
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
            await removeStoredImage(deletedImage, flyerUploadDirectory);
        } catch (cleanupError) {
            console.error("Gagal menghapus file gambar:", cleanupError);
        }
        return res.status(200).json({ success: true, message: "Gambar berhasil dihapus" });
    } catch (error) {
        console.error("Gagal menghapus gambar:", error);
        return res.status(500).json({ success: false, message: "Gagal menghapus gambar" });
    }
}