import { IReturnBapiret } from "../utils/return";

export interface IPayloadInputSerialNumber {
  bookingId: string;
  ordNumber: string;
  listSN: ListSn[];
  return: IReturnBapiret;
}

export interface ListSn {
  serialNumber: string;
  materialId: string;
}

export interface IResultInputPayer {
  d: IPayloadInputSerialNumber;
}
