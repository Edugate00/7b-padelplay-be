import { axiosService } from "../../config/axios/axiosInstance";
import { IQueryParamsOData } from "../../interfaces/utils/odata";

const generateQueryParams = (params: IQueryParamsOData, endpoint: string) => {
  const mandt = process.env.CLIENT || (388 as number);
  const endpointWithParams = endpoint + "?";

  // --> loop keys of params
  const queryURL = Object.keys(params)
    .map((key) => {
      const k = key as keyof IQueryParamsOData;
      return `${k}=${params[k]}`;
    })
    .join("&");
  const fullpath = endpointWithParams + queryURL + `&sap-client=${mandt}`;
  return fullpath as string;
};

export async function requestReadWithParams<T = unknown>(
  params: IQueryParamsOData,
  endpoint: string
): Promise<T> {
  const sap = axiosService("SAP");

  // pastikan string tanpa cast "as string"
  const raw = generateQueryParams(params, endpoint);
  const fullpath = typeof raw === "string" ? raw : String(raw);
  const { data } = await sap.get<T>(fullpath);
  return data;
}

export async function requestRead<T = unknown>(endpoint: string): Promise<T> {
  // env var itu string; fallback ke "388"
  const client = process.env.CLIENT ?? "388";
  const sap = axiosService("SAP");
  const { data } = await sap.get<T>(endpoint, {
    params: { "sap-client": client }, // axios akan append ?client=...
  });

  return data;
}
