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

async function getAdvImageById(id: string): Promise<IAdvImage | undefined> {
  const query = `
    SELECT ID, VALID_FROM, VALID_TO, SHOW_INDICATOR,
           IMG_URL, DURATION, QR_URL, COURT, DIST_CHAN
    FROM ${TABLE}
    WHERE MANDT = @client AND ID = @id
  `;

  return (await runSelectSingleQuery(query, {
    client: { type: mssql.Char(3), value: MANDT },
    id: { type: mssql.NVarChar(3), value: id },
  })) as IAdvImage | undefined;
}

async function updateAdvImage(
  id: string,
  payload: IPayloadInsertAdv,
): Promise<IAdvImage | undefined> {
  const query = `
    UPDATE ${TABLE}
    SET VALID_FROM = @validFrom,
        VALID_TO = @validTo,
        SHOW_INDICATOR = @showIndicator,
        IMG_URL = @imgUrl,
        DURATION = @duration,
        QR_URL = @qrUrl,
        COURT = @court,
        DIST_CHAN = @distChan
    OUTPUT INSERTED.ID, INSERTED.VALID_FROM, INSERTED.VALID_TO,
           INSERTED.SHOW_INDICATOR, INSERTED.IMG_URL, INSERTED.DURATION,
           INSERTED.QR_URL, INSERTED.COURT, INSERTED.DIST_CHAN
    WHERE MANDT = @client AND ID = @id
  `;

  return (await runSelectSingleQuery(query, {
    client: { type: mssql.Char(3), value: MANDT },
    id: { type: mssql.NVarChar(3), value: id },
    validFrom: { type: mssql.NVarChar(8), value: payload.validFrom },
    validTo: { type: mssql.NVarChar(8), value: payload.validTo },
    showIndicator: { type: mssql.NVarChar(1), value: payload.showIndicator },
    imgUrl: { type: mssql.NVarChar(50), value: payload.imgUrl },
    duration: { type: mssql.NVarChar(10), value: payload.duration },
    qrUrl: { type: mssql.NVarChar(50), value: payload.qrUrl },
    court: { type: mssql.NVarChar(20), value: payload.court },
    distChan: { type: mssql.NVarChar(2), value: payload.distChan },
  })) as IAdvImage | undefined;
}

async function deleteAdvImage(id: string): Promise<string | undefined> {
  const query = `
    DELETE FROM ${TABLE}
    OUTPUT DELETED.IMG_URL
    WHERE MANDT = @client AND ID = @id
  `;

  const deleted = (await runSelectSingleQuery(query, {
    client: { type: mssql.Char(3), value: MANDT },
    id: { type: mssql.NVarChar(3), value: id },
  })) as { IMG_URL: string } | undefined;

  return deleted?.IMG_URL;
}

function validateAdvPayload(payload: IPayloadInsertAdv): string[] {
  const errors: string[] = [];
  if (!/^\d{8}$/.test(payload.validFrom))
    errors.push("VALID_FROM harus YYYYMMDD");
  if (!/^\d{8}$/.test(payload.validTo))
    errors.push("VALID_TO harus YYYYMMDD");
  if (payload.duration.length > 10) errors.push("DURATION maks 10 karakter");
  if (payload.qrUrl.length > 50) errors.push("QR_URL maks 50 karakter");
  if (payload.court.length > 20) errors.push("COURT maks 20 karakter");
  if (payload.distChan.length !== 2) errors.push("DIST_CHAN harus 2 karakter");
  return errors;
}

async function removeStoredImage(value: string): Promise<void> {
  if (!value || /^https?:\/\//i.test(value)) return;

  const filename = path.basename(value);
  const imagePath = path.resolve(uploadDirectory, filename);
  if (path.dirname(imagePath) !== uploadDirectory) return;

  try {
    await fs.promises.unlink(imagePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
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

      const errors = validateAdvPayload(payload);

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

  router.put(
    "/images/:id",
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
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      if (!/^\d{1,3}$/.test(id)) {
        if (req.file) await removeStoredImage(req.file.filename);
        return res.status(400).json({ success: false, message: "ID tidak valid" });
      }
      const recordId = id.padStart(3, "0");

      try {
        const existing = await getAdvImageById(recordId);
        if (!existing) {
          if (req.file) await removeStoredImage(req.file.filename);
          return res.status(404).json({ success: false, message: "Gambar tidak ditemukan" });
        }

        const body = req.body as Record<string, unknown>;
        const payload: IPayloadInsertAdv = {
          validFrom: String(body.VALID_FROM ?? existing.VALID_FROM),
          validTo: String(body.VALID_TO ?? existing.VALID_TO),
          showIndicator:
            body.SHOW_INDICATOR === undefined
              ? existing.SHOW_INDICATOR
              : body.SHOW_INDICATOR === "X" || body.SHOW_INDICATOR === "true"
                ? "X"
                : "",
          imgUrl: req.file
            ? `/IMAGES/SPONSOR/${req.file.filename}`
            : existing.IMG_URL,
          duration: String(body.DURATION ?? existing.DURATION),
          qrUrl: String(body.QR_URL ?? existing.QR_URL),
          court: String(body.COURT ?? existing.COURT),
          distChan: String(body.DIST_CHAN ?? existing.DIST_CHAN),
        };

        const errors = validateAdvPayload(payload);
        if (payload.imgUrl.length > 50) errors.push("IMG_URL maks 50 karakter");
        if (errors.length) {
          if (req.file) await removeStoredImage(req.file.filename);
          return res.status(400).json({ success: false, message: errors.join(", ") });
        }

        const updated = await updateAdvImage(recordId, payload);
        if (!updated) {
          if (req.file) await removeStoredImage(req.file.filename);
          return res.status(404).json({ success: false, message: "Gambar tidak ditemukan" });
        }

        if (req.file && existing.IMG_URL !== payload.imgUrl) {
          try {
            await removeStoredImage(existing.IMG_URL);
          } catch (cleanupError) {
            console.error("Gagal menghapus file gambar lama:", cleanupError);
          }
        }

        return res.status(200).json({
          success: true,
          data: { ...updated, img_url: toFullUrl(updated.IMG_URL) },
        });
      } catch (error) {
        if (req.file) await removeStoredImage(req.file.filename);
        console.error("Gagal memperbarui gambar:", error);
        return res.status(500).json({ success: false, message: "Gagal memperbarui gambar" });
      }
    },
  );

  router.delete("/images/:id", verifyToken, async (req, res) => {
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
        await removeStoredImage(deletedImage);
      } catch (cleanupError) {
        console.error("Gagal menghapus file gambar:", cleanupError);
      }
      return res.status(200).json({ success: true, message: "Gambar berhasil dihapus" });
    } catch (error) {
      console.error("Gagal menghapus gambar:", error);
      return res.status(500).json({ success: false, message: "Gagal menghapus gambar" });
    }
  });

  return router;
}