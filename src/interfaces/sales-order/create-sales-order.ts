import { IReturnBapiret } from "../utils/return";

export interface IPayloadCreateSO {
  phoneNumber: string;
  email: string;
  name: string;
  bookingDate: string;
  salesDocument: string;
  distChan?: string;
  OrderPartners?: OrderPartners[];
  OrderItems: OrderItems[];
  return: IReturnBapiret;
}

export interface OrderPartners {
  PartnRole: string;
  PartnNumb: string;
}

export interface OrderItems {
  ItmNumber: string;
  Material: string;
  TargetQty: string;
  PriceDate: string;
  SalesUnit: string;
  Hours?: string;
}

export interface IResultCreateSO {
  d: IPayloadCreateSO;
}
