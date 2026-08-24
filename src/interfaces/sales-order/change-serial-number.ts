import { IReturnBapiret } from "../utils/return";

export interface IPayloadChangeSerialNumber {
  bookingId: string;
  ordNumber: string;
  listSN: ListSn[];
  return: IReturnBapiret;
}

export interface ListSn {
  MaterialId: string;
  SeOld: string;
  SeNew: string;
}
