import { IReturnBapiret } from "../utils/return";

export interface IResultCheckIn {
  d: {
    Return: IReturnBapiret;
  };
}

export interface IPayloadODataCheckIn {
  Return: [];
  BookingID: string;
}

export interface IPayloadODataGoodIssued {
  BookingID: string;
  OrderItem: string;
  Return: [];
  ListMaterial: IPayloadODataListMaterial[];
}

export interface IResultChangeSttsPymnt {
  d: {
    ReturnChangeStatusPayment: {
      results: IReturnBapiret[];
    };
  };
}
export interface IPayloadODataReturnGoodIssued {
  DeliveryDocument: string;
  Return: [];
}

export interface IPayloadODataReturnDelivery {
  user_id: string;
  dist_chan: string;
  return: [];
  list_material: IPayloadODataListMaterial[]
}

export interface IPayloadODataListMaterial {
  MaterialType: string;
  MaterialID: string;
  SerialNumber: string;
}

export interface IResultGoodIssued {
  d: { BookingID: string; OrderItem: string; Return: IReturnBapiret };
}

export interface IResultCreateSalesOrder {
  d: {
    ReturnCreate: {
      results: IReturnBapiret[];
    };
  };
}
