// Trim semua nilai string (shallow), tanpa any, dan tetap mempertahankan tipe T
export function trimAllStrings<T extends Record<string, unknown>>(obj: T): T {
  const out = {} as { [K in keyof T]: T[K] };

  (Object.keys(obj) as Array<keyof T>).forEach((key) => {
    const val = obj[key];
    out[key] = typeof val === "string" ? (val.trim() as T[typeof key]) : val;
  });

  return out;
}
export function normalizeError(err: unknown): {
  message: string;
  details?: unknown;
  status?: number;
  success?: boolean;
} {
  const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null;

  const getString = (
    r: Record<string, unknown>,
    k: string,
  ): string | undefined => {
    const v = r[k];
    return typeof v === "string" ? v : undefined;
  };

  const getNumber = (
    r: Record<string, unknown>,
    k: string,
  ): number | undefined => {
    const v = r[k];
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
  };

  // 1) App error: { status, message, success?, details? }
  if (isRecord(err) && "status" in err) {
    const r = err as Record<string, unknown>;
    const status = getNumber(r, "status");
    const message = getString(r, "message") ?? "Unexpected error";
    const success =
      typeof r["success"] === "boolean" ? (r["success"] as boolean) : false;
    const details = "details" in r ? r["details"] : undefined;

    return {
      message,
      success,
      ...(status !== undefined ? { status } : {}),
      ...(details !== undefined ? { details } : {}),
    };
  }

  // 2) Axios error (err.response.*)
  if (isRecord(err) && "response" in err) {
    const resp = (err as Record<string, unknown>)["response"];
    if (isRecord(resp)) {
      const respRec = resp as Record<string, unknown>;
      const data = isRecord(respRec["data"])
        ? (respRec["data"] as Record<string, unknown>)
        : undefined;
      const status = getNumber(respRec, "status");
      const statusText = getString(respRec, "statusText") ?? "";
      const msgFromData =
        (data && (getString(data, "message") ?? getString(data, "error"))) ??
        "";

      const message = msgFromData || statusText || "Request failed";

      return {
        message,
        success: false,
        ...(status !== undefined ? { status } : {}),
        ...(data !== undefined ? { details: data } : {}),
      };
    }
  }

  // 3) Array issues (mis. validation)
  if (Array.isArray(err)) {
    const first = err[0] as unknown;
    let message = "Validation failed";
    if (isRecord(first)) {
      message =
        getString(first, "message") ??
        getString(first, "MESS") ??
        getString(first, "text") ??
        "Validation failed";
    }
    return {
      message,
      success: false,
      status: 422,
      details: err,
    };
  }

  // 4) Native Error
  if (err instanceof Error) {
    let status: number | undefined;
    let details: unknown;

    if (isRecord(err)) {
      if ("status" in err)
        status = getNumber(err as Record<string, unknown>, "status");
      if ("details" in err)
        details = (err as Record<string, unknown>)["details"];
    }

    return {
      message: err.message,
      success: false,
      ...(status !== undefined ? { status } : {}),
      ...(details !== undefined ? { details } : {}),
    };
  }

  // 5) Fallback object / primitive
  if (isRecord(err)) {
    const message =
      getString(err, "Message") ??
      getString(err, "MessageV1") ??
      getString(err, "MessageV2") ??
      "Unexpected error";
    const status = getNumber(err, "Number");

    return {
      message,
      success: false,
      ...(status !== undefined ? { status } : {}),
      details: err,
    };
  }

  // Primitive/string
  return { message: String(err ?? "Unexpected error"), success: false };
}

export function stripExtraFields<T>(obj: T, keys: (keyof T)[]): T {
  return keys.reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {} as T);
}

export function generateURLFrontend(endpoint: string) {
  const isProduction = process.env.NODE_ENV !== "local";
  const prdUrl = process.env.FRONTEND_URL_RESET_PASSWORD + endpoint;
  const devUrl = process.env.FRONTEND_DEVELOPMENT_URL + endpoint;
  const verifiedUrl = isProduction ? prdUrl : devUrl;

  return verifiedUrl;
}

export function getLastSegment(url: string): string {
  return url.split('/').pop() ?? '';
}