// controllers/resto-controller/menuController.ts
import { Request, Response } from "express";
import axios from "axios";
import { getRestoMenu } from "../../utils/oDataRequest/OData-Resto";
import { logger } from "../../config/logger/pino";
import { convertRespMenu } from "../../converters/resto/converter-menu";

export default async function getRestoMenuController(
    _req: Request,
    res: Response,
): Promise<void> {
    // Dari server, bukan dari query frontend, supaya kasir tidak bisa meminta channel lain
    const distChan = process.env.POS_DIST_CHAN || "01";
    try {

        const raw = await getRestoMenu(distChan);
        const items = convertRespMenu(raw);

        res.status(200).json({
            success: true,
            message: "Success fetch menu",
            data: { listMenu: items },
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            logger.error(
                {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    url: error.config?.url,
                    method: error.config?.method,
                },
                "Failed to get resto menu",
            );
        } else {
            logger.error(error, "Failed to get resto menu");
        }

        res.status(500).json({ success: false, message: "Internal server error" });
    }
}