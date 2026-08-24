import { ResponseError } from "../interfaces/response/error";

// type guard untuk ResponseError
export function isResponseError(e: unknown): e is ResponseError {
  return (
    typeof e === "object" &&
    e !== null &&
    "statusCode" in e &&
    typeof (e as { statusCode?: unknown }).statusCode === "number"
  );
}