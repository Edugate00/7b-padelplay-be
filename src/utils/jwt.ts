import { JwtExpires } from "../types/token/types-token";

export function generateDynamicExpiresJWT(
  expiration: JwtExpires,
  fromDate: Date
) {
  const expirationDate = new Date(fromDate);

  // Parse durasi input (misalnya '15m', '1h', '2d')
  const match = expiration.toString().match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error("Invalid expiration format. Use '15m', '1h', '2d', etc.");
  }

  const value = parseInt(match[1]!);
  const unit = match[2];

  // Menambahkan durasi ke tanggal saat ini berdasarkan unit
  switch (unit) {
    case "s": // seconds
      expirationDate.setSeconds(expirationDate.getSeconds() + value);
      break;
    case "m": // minutes
      expirationDate.setMinutes(expirationDate.getMinutes() + value);
      break;
    case "h": // hours
      expirationDate.setHours(expirationDate.getHours() + value);
      break;
    case "d": // days
      expirationDate.setDate(expirationDate.getDate() + value);
      break;
    default:
      throw new Error(
        "Invalid time unit. Use 's' for seconds, 'm' for minutes, 'h' for hours, 'd' for days."
      );
  }

  return expirationDate;
}
