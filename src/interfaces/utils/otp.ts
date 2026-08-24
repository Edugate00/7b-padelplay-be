export interface OtpRecord {
  hash: string;
  attempts: number;
}

export interface OtpStore {
  getOtp(email: string): Promise<OtpRecord | null>;
  setOtp(email: string, record: OtpRecord, ttlSec: number): Promise<void>;
  delOtp(email: string): Promise<void>;
  getTtlMs(email: string): Promise<number>; // sisa TTL ms
  setWithRemainTtl(email: string, record: OtpRecord): Promise<void>; // update tanpa perpanjang TTL

  // rate limit & quota
  isCooldown(email: string): Promise<boolean>;
  setCooldown(email: string, seconds: number): Promise<void>;
  incrDailyQuota(email: string): Promise<number>;
  setDailyQuotaTtlIfNew(email: string): Promise<void>;
}

