export function setDateFormatted(date: Date) {
  // --> expected YYYYMMDD
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // +1 karena getMonth() mulai dari 0
  const day = date.getDate().toString().padStart(2, "0"); // memastikan 2 digit

  return `${year}${month}${day}`;
}

// Helper function to parse YYYYMMDD format
function parseSAPDate(date: string): { year: string; month: string; day: string } {
  return {
    year: date.substring(0, 4),
    month: date.substring(4, 6),
    day: date.substring(6, 8),
  };
}

export function setDateStandard(date: string) {
  const { year, month, day } = parseSAPDate(date);
  return `${day}-${month}-${year}`;
}

export function setTimeFormatted(date: Date) {
  // --> expected HHMMSS
  const hours = date.getHours().toString().padStart(2, "0"); // memastikan 2 digit
  const minutes = date.getMinutes().toString().padStart(2, "0"); // memastikan 2 digit
  const seconds = date.getSeconds().toString().padStart(2, "0"); // memastikan 2 digit

  return `${hours}${minutes}${seconds}`;
}

export function formatSAPTime(utime: string | number): string {
  // Pastikan jadi string dan panjang 6 digit
  const timeStr = utime.toString().padStart(6, "0");

  const hh = timeStr.substring(0, 2);
  const mm = timeStr.substring(2, 4);
  const ss = timeStr.substring(4, 6);

  return `${hh}:${mm}:${ss} WIB`;
}

export const generateBookingDate = (bookingDate: string) => {
  const [day, month, year] = bookingDate.split("-").map(Number) as [
    number,
    number,
    number
  ];
  const date = new Date(year, month - 1, day);
  return setDateFormatted(date);
};

// Ex : Rabu, 10 - 09 -2025 16:10:17
export function formatTsDateTime(
  createdDate?: string | null,
  createdTime?: string | null
): string {
  if (!createdDate && !createdTime) return "";

  let year = 1970,
    month = 0,
    day = 1,
    hour = 0,
    minute = 0,
    second = 0;

  // Jika ada tanggal SAP (YYYYMMDD)
  if (createdDate && /^\d{8}$/.test(createdDate)) {
    year = Number(createdDate.substring(0, 4));
    month = Number(createdDate.substring(4, 6)) - 1; // bulan 0-based
    day = Number(createdDate.substring(6, 8));
  }

  // Jika ada waktu SAP (HHMMSS)
  if (createdTime && /^\d{6}$/.test(createdTime)) {
    hour = Number(createdTime.substring(0, 2));
    minute = Number(createdTime.substring(2, 4));
    second = Number(createdTime.substring(4, 6));
  }

  const dateObj = new Date(year, month, day, hour, minute, second);

  // Ambil komponen waktu dan tanggal
  const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
  const dd = String(day).padStart(2, "0");
  const mm = String(month + 1).padStart(2, "0");
  const yyyy = String(year);
  const hh = String(hour).padStart(2, "0");
  const mi = String(minute).padStart(2, "0");
  const ss = String(second).padStart(2, "0");

  // Tentukan format hasil sesuai input yang tersedia
  if (createdDate && createdTime) {
    return `${dayName}, ${dd}-${mm}-${yyyy} ${hh}:${mi}:${ss} WIB`;
  }
  if (createdDate && !createdTime) {
    return `${dayName}, ${dd}-${mm}-${yyyy}`;
  }
  if (!createdDate && createdTime) {
    return `${hh}:${mi}:${ss} WIB`;
  }

  return "";
}

// Birthdate: optional/null; terima "yyyy-mm-dd" atau "dd-mm-yyyy"/"dd/mm/yyyy" atau Date
export const toSapDats = (y: number, m: number, d: number) =>
  `${String(y).padStart(4, "0")}${String(m).padStart(2, "0")}${String(
    d
  ).padStart(2, "0")}`;

export function formatDateToISO(date: string): string {
  // Konversi YYYYMMDD menjadi YYYY-MM-DD
  if (!/^\d{8}$/.test(date)) {
    throw new Error("Invalid date format. Expected YYYYMMDD");
  }

  const { year, month, day } = parseSAPDate(date);
  return `${year}-${month}-${day}`;
}

export const isValidYMD = (y: number, m: number, d: number) => {
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() + 1 === m &&
    dt.getUTCDate() === d
  );
};
