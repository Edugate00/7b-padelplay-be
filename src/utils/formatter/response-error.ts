import { IResultBapiret, IReturnBapiret } from "../../interfaces/utils/return";
import { Response } from "express";

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

export function getStatusCode(err: unknown, defaultCode = 500): number {
  if (isRecord(err)) {
    const raw =
      ("status" in err ? err.status : undefined) ??
      ("statusCode" in err
        ? (err as Record<string, unknown>).statusCode
        : undefined);

    if (typeof raw === "number") return raw;
    if (typeof raw === "string") {
      const n = Number(raw);
      if (Number.isFinite(n)) return n;
    }
  }
  return defaultCode;
}

export function getErrorMessage(
  err: unknown,
  defaultMessage = "Internal Server Error"
): string {
  if (err instanceof Error) return err.message || defaultMessage;

  if (isRecord(err) && "message" in err) {
    const msg = (err as Record<string, unknown>).message;
    if (typeof msg === "string") return msg;
  }

  if (typeof err === "string") return err;
  return defaultMessage;
}
function isResultBapiret(error: unknown): error is IResultBapiret {
  if (typeof error === "object" && error !== null && "d" in error) {
    const d = (error as Record<string, unknown>)["d"];
    if (typeof d === "object" && d !== null) {
      const maybeD = d as Record<string, unknown>;
      const dataReturn = maybeD.Return as Record<string, unknown>;
      return (
        typeof dataReturn["Number"] !== "undefined" &&
        typeof dataReturn["Message"] === "string"
      );
    }
  }
  return false;
}

export function handleError(error: unknown, res: Response) {
  if (isResultBapiret(error)) {
    const code = Number(error.d.Return.Number);
    return res.status(code <= 100 ? 409 : code).json({
      success: false,
      message: error.d.Return.Message,
    });
  }
  // fallback kalau bukan IResultBapiret
  console.error("Unexpected error:", error);
  return res.status(500).json({
    success: false,
    message: error instanceof Error ? error.message : "Internal Server Error",
  });
}

export function setResponseBapiret(
  returnData: IReturnBapiret[]
) {
  const errorMessages = returnData
    .filter((r) => r.Type === "E")
    .map((r) => ({ message: r.Message }));

  if (errorMessages.length > 0) {
    console.log(errorMessages)
    return {
      success: false,
      statusCode: 409,
      detailError: errorMessages,
    };
  }

  return false; // tidak ada error, lanjutkan proses
}
