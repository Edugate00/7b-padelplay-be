import { IReturnBapiret } from "../utils/return";

export interface IPayloadChangePayer {
  payerId: string;
  bookingId: string;
  return: IReturnBapiret;
}

export interface IResultChangePayer {
  d: IPayloadChangePayer;
}
