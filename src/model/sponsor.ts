import { runInsertQuery, runSelectQuery, runSelectSingleQuery } from "../config/db/db-helperQuery";
import mssql from "mssql";
import { IAdvImage, IPayloadInsertAdv } from "../interfaces/sponsor/sponsor-interfaces";
import path from "path";
import fs from "fs";

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

export async function getAdvImageById(id: string): Promise<IAdvImage | undefined> {
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

export async function updateAdvImage(
  id: string,
  payload: IPayloadInsertAdv,
): Promise<IAdvImage | undefined> {
  const query = `
    UPDATE ${TABLE}
    SET VALID_FROM = @validFrom,
        VALID_TO = @validTo,
        SHOW_INDICATOR = @showIndicator,
        DURATION = @duration,
        QR_URL = @qrUrl,
        COURT = @court,
        DIST_CHAN = @distChan
    OUTPUT INSERTED.ID, INSERTED.VALID_FROM, INSERTED.VALID_TO,
           INSERTED.SHOW_INDICATOR, INSERTED.DURATION,
           INSERTED.QR_URL, INSERTED.COURT, INSERTED.DIST_CHAN
    WHERE MANDT = @client AND ID = @id
  `;

  return (await runSelectSingleQuery(query, {
    client: { type: mssql.Char(3), value: MANDT },
    id: { type: mssql.NVarChar(3), value: id },
    validFrom: { type: mssql.NVarChar(8), value: payload.validFrom },
    validTo: { type: mssql.NVarChar(8), value: payload.validTo },
    showIndicator: { type: mssql.NVarChar(1), value: payload.showIndicator },
    duration: { type: mssql.NVarChar(10), value: payload.duration },
    qrUrl: { type: mssql.NVarChar(50), value: payload.qrUrl },
    court: { type: mssql.NVarChar(20), value: payload.court },
    distChan: { type: mssql.NVarChar(2), value: payload.distChan },
  })) as IAdvImage | undefined;
}

export async function deleteAdvImage(id: string): Promise<string | undefined> {
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

export function validateAdvPayload(payload: IPayloadInsertAdv): string[] {
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

export function validateFlyerPayload(payload: {imgUrl: string; distChan: string;}): string[] {
  const errors: string[] = [];
  if (payload.distChan.length !== 2) errors.push("distChan harus 2 karakter");
  return errors;
}

export async function removeStoredImage(value: string, sponsorUploadDirectory: string): Promise<void> {
  if (!value || /^https?:\/\//i.test(value)) return;

  const filename = path.basename(value);
  const imagePath = path.resolve(sponsorUploadDirectory, filename);
  if (path.dirname(imagePath) !== sponsorUploadDirectory) return;

  try {
    await fs.promises.unlink(imagePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}