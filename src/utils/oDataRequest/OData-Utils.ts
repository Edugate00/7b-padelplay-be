import { requestRead } from "./OData-Request";

export async function getDayType(
  dateStr: string,
  time: string,
  distChan: string
) {
  const parts = dateStr.split("-");
  if (parts.length !== 3) {
    throw new Error(
      `Invalid date format: expected dd-mm-yyyy, got "${dateStr}"`
    );
  }

  const [dayStr, monthStr, yearStr] = parts;
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
    throw new Error(`Invalid numeric date values: "${dateStr}"`);
  }

  const dateFormat = `${year}${month.toString().padStart(2, "0")}${day
    .toString()
    .padStart(2, "0")}`;

  const endpoint = `ZPAD_UTILS_SRV/getCategoryTimeSet(time='${time}',bookingDate='${dateFormat}',distChan='${distChan}')`;

  const data = await requestRead(endpoint);
  return data;
}
