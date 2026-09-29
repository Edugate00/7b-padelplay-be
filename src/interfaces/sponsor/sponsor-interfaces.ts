export interface IAdvImage {
  id: string;
  validFrom: string;
  validTo: string;
  showIndicator: string;
  imgUrl: string;
  duration: string;
  qrUrl: string;
  court: string;
  distChan: string;
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
