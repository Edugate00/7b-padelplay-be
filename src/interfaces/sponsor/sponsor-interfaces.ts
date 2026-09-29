export interface IAdvImage {
  ID: string;
  VALID_FROM: string;
  VALID_TO: string;
  SHOW_INDICATOR: string;
  IMG_URL: string;
  DURATION: string;
  QR_URL: string;
  COURT: string;
  DIST_CHAN: string;
}

export interface IPayloadInsertAdv {
  validFrom: string; // YYYYMMDD
  validTo: string; // YYYYMMDD
  showIndicator: string; // 'X' atau ''
  imgUrl: string; // path relatif, maks 50 karakter
  duration: string;
  qrUrl: string;
  court: string;
  distChan: string;
}
