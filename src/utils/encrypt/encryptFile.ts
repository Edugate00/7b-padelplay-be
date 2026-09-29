import crypto from "crypto";

export function encryptFile(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}