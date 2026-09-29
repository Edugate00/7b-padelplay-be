import express from "express";
import multer from "multer";
import mssql from "mssql";
import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";
import {
  runSelectQuery,
  runSelectSingleQuery,
} from "../../../../config/db/db-helperQuery";
import verifyToken from "../../../../middleware/validators/verify-token";

const uploadDirectory = path.resolve("uploads", "IMAGES", "SPONSOR");
fs.mkdirSync(uploadDirectory, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadDirectory),
    filename: (_req, file, callback) => {
      const filename = path
        .basename(file.originalname)
        .replace(/[^a-zA-Z0-9._-]/g, "_");
      callback(null, filename || `${randomBytes(5).toString("hex")}.png`);
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

const toFullUrl = (value: string) =>
  /^https?:\/\//i.test(value)
    ? value
    : `${process.env.BACKEND_BASE_URL}/IMAGES/SPONSOR/${path.basename(value)}`;

const MANDT = process.env.CLIENT;
const TABLE = `${process.env.DB_NAME!.toLowerCase()}.ZPDL_ADV`;

export interface IAdvImage {
  ID: string;
  VALID_FROM: string;
  VALID_TO: string;
  SHOW_INDICATOR: string;
  IMG_URL: string;
  DURATION: string;
  QR_URL: string;
  COURT: string;
  DIST_CHAN: string;
}

export interface IPayloadInsertAdv {
  validFrom: string; // YYYYMMDD
  validTo: string; // YYYYMMDD
  showIndicator: string; // 'X' atau ''
  imgUrl: string; // path relatif, maks 50 karakter
  duration: string;
  qrUrl: string;
  court: string;
  distChan: string;
}

// --> GET semua gambar (IMG_URL terisi), opsional filter court / dist_chan
export async function getAdvImages(
  filter: { court?: string; distChan?: string } = {},
): Promise<IAdvImage[]> {
  const params: Record<string, { type: any; value: any }> = {
    client: { type: mssql.Char(3), value: MANDT },
  };

  let extraWhere = "";
  if (filter.court) {
    extraWhere += " AND COURT = @court";
    params.court = { type: mssql.NVarChar(20), value: filter.court };
  }
  if (filter.distChan) {
    extraWhere += " AND DIST_CHAN = @distChan";
    params.distChan = { type: mssql.NVarChar(2), value: filter.distChan };
  }

  const query = `
    SELECT ID, VALID_FROM, VALID_TO, SHOW_INDICATOR,
           IMG_URL, DURATION, QR_URL, COURT, DIST_CHAN
    FROM ${TABLE}
    WHERE MANDT = @client
      AND IMG_URL <> ''${extraWhere}
    ORDER BY ID
  `;

  return (await runSelectQuery(query, params)) as IAdvImage[];
}

export async function insertAdvImage(
  p: IPayloadInsertAdv,
): Promise<{ ID: string }> {
  const query = `
    INSERT INTO ${TABLE}
      (MANDT, ID, VALID_FROM, VALID_TO, SHOW_INDICATOR,
       IMG_URL, DURATION, QR_URL, COURT, DIST_CHAN)
    OUTPUT INSERTED.ID
    SELECT @client,
           RIGHT('000' + CAST(ISNULL(MAX(TRY_CAST(ID AS INT)), 0) + 1 AS VARCHAR(10)), 3),
           @validFrom, @validTo, @showIndicator,
           @imgUrl, @duration, @qrUrl, @court, @distChan
    FROM ${TABLE} WITH (UPDLOCK, HOLDLOCK)
    WHERE MANDT = @client
  `;

  return (await runSelectSingleQuery(query, {
    client: { type: mssql.Char(3), value: MANDT },
    validFrom: { type: mssql.NVarChar(8), value: p.validFrom },
    validTo: { type: mssql.NVarChar(8), value: p.validTo },
    showIndicator: { type: mssql.NVarChar(1), value: p.showIndicator },
    imgUrl: { type: mssql.NVarChar(50), value: p.imgUrl },
    duration: { type: mssql.NVarChar(10), value: p.duration },
    qrUrl: { type: mssql.NVarChar(50), value: p.qrUrl },
    court: { type: mssql.NVarChar(20), value: p.court },
    distChan: { type: mssql.NVarChar(2), value: p.distChan },
  })) as { ID: string };
}

export default function uploadImageRoute() {
  const router = express.Router();

  router.get("/images/:filename", (req, res) => {
    const filename = path.basename(req.params.filename);
    return res.sendFile(filename, { root: uploadDirectory }, (error) => {
      if (error && !res.headersSent) {
        res.status(404).json({
          success: false,
          message: "Gambar tidak ditemukan",
        });
      }
    });
  });

  router.get("/images", async (req, res) => {
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
        data: rows.map((row) => ({ ...row, img_url: toFullUrl(row.IMG_URL) })),
      });
    } catch (error) {
      console.error("Gagal mengambil data gambar:", error);
      return res
        .status(500)
        .json({ success: false, message: "Gagal mengambil data gambar" });
    }
  });

  router.post(
    "/images",
    verifyToken,
    (req, res, next) => {
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
    },
    async (req, res) => {
      const file = req.file;
      if (!file) {
        return res
          .status(400)
          .json({ success: false, message: "File gambar wajib diisi" });
      }

      const body = req.body as Record<string, unknown>;
      const payload: IPayloadInsertAdv = {
        validFrom: String(body.VALID_FROM ?? ""),
        validTo: String(body.VALID_TO ?? ""),
        showIndicator:
          body.SHOW_INDICATOR === "X" || body.SHOW_INDICATOR === "true"
            ? "X"
            : "",
        imgUrl: `/IMAGES/SPONSOR/${file.filename}`,
        duration: String(body.DURATION ?? ""),
        qrUrl: String(body.QR_URL ?? ""),
        court: String(body.COURT ?? ""),
        distChan: String(body.DIST_CHAN ?? ""),
      };

      const errors: string[] = [];
      if (!/^\d{8}$/.test(payload.validFrom))
        errors.push("VALID_FROM harus YYYYMMDD");
      if (!/^\d{8}$/.test(payload.validTo))
        errors.push("VALID_TO harus YYYYMMDD");
      if (payload.duration.length > 10)
        errors.push("DURATION maks 10 karakter");
      if (payload.qrUrl.length > 50) errors.push("QR_URL maks 50 karakter");
      if (payload.court.length > 20) errors.push("COURT maks 20 karakter");
      if (payload.distChan.length !== 2)
        errors.push("DIST_CHAN harus 2 karakter");

      if (errors.length) {
        fs.unlink(file.path, () => {});
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
            ID: inserted.ID,
            img_url: toFullUrl(payload.imgUrl),
          },
        });
      } catch (error) {
        fs.unlink(file.path, () => {});
        console.error("Gagal menyimpan gambar:", error);
        return res
          .status(500)
          .json({ success: false, message: "Gagal upload gambar" });
      }
    },
  );

  return router;
}