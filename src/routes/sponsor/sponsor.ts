import express from "express";
import multer from "multer";
import mssql from "mssql";
import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";
import verifyToken from "../../middleware/validators/verify-token";
import { IAdvImage, IPayloadInsertAdv } from "../../interfaces/sponsor/sponsor-interfaces";
import { runInsertQuery, runSelectQuery, runSelectSingleQuery } from "../../config/db/db-helperQuery";
import { encryptFile } from "../../utils/encrypt/encryptFile";

const router = express.Router();

const uploadDirectory = path.resolve("assets", "images", "sponsor");
fs.mkdirSync(uploadDirectory, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadDirectory),
    filename: (_req, file, callback) => {
      const filename = path
        .basename(file.originalname)
        .replace(/[^a-zA-Z0-9._-]/g, "_");
      callback(null, encryptFile(filename) || `${randomBytes(5).toString("hex")}.png`);
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
    : `${process.env.BACKEND_BASE_URL}/assets/images/sponsor/${path.basename(value).toLowerCase()}`;

const MANDT = process.env.CLIENT;
const TABLE = `${process.env.DB_NAME!.toLowerCase()}.ZPDL_ADV`;


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
    SELECT ID AS id, VALID_FROM AS validFrom, VALID_TO AS validTo, SHOW_INDICATOR AS showIndicator,
           IMG_URL AS imgUrl, DURATION AS duration, QR_URL AS qrUrl, COURT AS court, DIST_CHAN AS distChan
    FROM ${TABLE}
    WHERE MANDT = @client
      AND IMG_URL <> ''${extraWhere}
    ORDER BY ID
  `;

  return (await runSelectQuery(query, params)) as IAdvImage[];
}

export async function insertAdvImage(
  p: IPayloadInsertAdv,
) {
  const query = `
    INSERT INTO ${TABLE}
      (
          MANDT,
          ID,
          VALID_FROM,
          VALID_TO,
          SHOW_INDICATOR,
          IMG_URL,
          DURATION,
          QR_URL,
          COURT,
          DIST_CHAN
      )
      VALUES
      (
          @client,
          RIGHT(
              '000' + CAST(
                  ISNULL(
                      (SELECT MAX(TRY_CAST(ID AS INT)) FROM ${TABLE}),
                      0
                  ) + 1
                  AS VARCHAR(10)
              ),
              3
          ),
          @validFrom,
          @validTo,
          @showIndicator,
          @imgUrl,
          @duration,
          @qrUrl,
          @court,
          @distChan
      );
  `;

  const result = await runInsertQuery(query, {
    client: { type: mssql.Char(3), value: MANDT },
    validFrom: { type: mssql.NVarChar(8), value: p.validFrom },
    validTo: { type: mssql.NVarChar(8), value: p.validTo },
    showIndicator: { type: mssql.NVarChar(1), value: p.showIndicator },
    imgUrl: { type: mssql.NVarChar(255), value: p.imgUrl },
    duration: { type: mssql.NVarChar(10), value: p.duration },
    qrUrl: { type: mssql.NVarChar(50), value: p.qrUrl },
    court: { type: mssql.NVarChar(20), value: p.court },
    distChan: { type: mssql.NVarChar(2), value: p.distChan },
  })

  return result;
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
    errors.push("validFrom harus YYYYMMDD");
  if (!/^\d{8}$/.test(payload.validTo))
    errors.push("validTo harus YYYYMMDD");
  if (payload.duration.length > 10) errors.push("duration maks 10 karakter");
  if (payload.court.length > 20) errors.push("court maks 20 karakter");
  if (payload.distChan.length !== 2) errors.push("distChan harus 2 karakter");
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

export default function sponsorRouter() {
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
        data: rows
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
          validFrom: String(body.VALID_FROM ?? existing.validFrom),
          validTo: String(body.VALID_TO ?? existing.validTo),
          showIndicator:
            body.showIndicator === undefined
              ? existing.showIndicator
              : body.showIndicator === "X" || body.showIndicator === "true"
                ? "X"
                : "",
          imgUrl: req.file
            ? `/assets/images/sponsor/${req.file.filename}`
            : existing.imgUrl,
          duration: String(body.DURATION ?? existing.duration),
          qrUrl: String(body.QR_URL ?? existing.qrUrl),
          court: String(body.COURT ?? existing.court),
          distChan: String(body.DIST_CHAN ?? existing.distChan),
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

        if (req.file && existing.imgUrl !== payload.imgUrl) {
          try {
            await removeStoredImage(existing.imgUrl);
          } catch (cleanupError) {
            console.error("Gagal menghapus file gambar lama:", cleanupError);
          }
        }

        return res.status(200).json({
          success: true,
          data: { ...updated, img_url: toFullUrl(updated.imgUrl) },
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


  router.get("/", (req, res) => {
    res.send("Welcome to the sponsor routes");
  });

  return router;
}