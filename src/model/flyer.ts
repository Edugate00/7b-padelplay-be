import { runInsertQuery, runSelectQuery, runSelectSingleQuery } from "../config/db/db-helperQuery";
import mssql from "mssql";
import { IAdvImage, IPayloadInsertAdv } from "../interfaces/sponsor/sponsor-interfaces";
import path from "path";
import fs from "fs";
import { logger } from "../config/logger/pino";

const MANDT = process.env.CLIENT;
const TABLE = `${process.env.DB_NAME!.toLowerCase()}.ZPDL_IMAGES`;

export async function getFlyerImages(
    filter: { distChan?: string } = {},
): Promise<{ imgType: string; imgUrl: string }[]> {
    const params: Record<string, { type: any; value: any }> = {
        client: { type: mssql.Char(3), value: MANDT },
        distChan: { type: mssql.Char(3), value: filter.distChan || "91" }
    };

    const query = `
    SELECT IMG_TYPE AS imgType, IMG_URL AS imgUrl FROM ${TABLE}
        WHERE OBJ_ID = @distChan
        AND IMG_TYPE LIKE 'FLYER%'
        AND MANDT = @client
  `;

    return (await runSelectQuery(query, params)) as { imgType: string; imgUrl: string }[];
}

export async function insertFlyerImage(
    p: { imgUrl: string; distChan: string; imgType: string },
) {
    try {
        const query = `
      INSERT INTO ${TABLE}
        (
          MANDT,
          OBJ_TYPE,
          OBJ_ID,
          IMG_TYPE,
          IMG_URL
        )
      VALUES
        (
          @client,
          'DISTCHAN',
          @distChan,
          @imgType,
          @imgUrl
        );
    `;

        const result = await runInsertQuery(query, {
            client: { type: mssql.Char(3), value: MANDT },
            imgUrl: { type: mssql.NVarChar(255), value: p.imgUrl },
            imgType: { type: mssql.NVarChar(20), value: p.imgType },
            distChan: { type: mssql.NVarChar(2), value: p.distChan },
        });

        return result;
    } catch (error) {
        logger.error({
            error,
            distChan: p.distChan,
            imgType: p.imgType,
        }, "Failed to insert flyer image");
        throw error;
    }
}

export async function deleteFlyerImage(imgUrl: string): Promise<string | undefined> {
    const query = `
    DELETE FROM ${TABLE}
    OUTPUT DELETED.IMG_URL
    WHERE MANDT = @client AND IMG_URL = @imgUrl
  `;

    const deleted = (await runSelectSingleQuery(query, {
        client: { type: mssql.Char(3), value: MANDT },
        imgUrl: { type: mssql.NVarChar(100), value: imgUrl },
    })) as { IMG_URL: string } | undefined;

    return deleted?.IMG_URL;
}