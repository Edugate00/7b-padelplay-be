import { IReturnBapiret } from "../utils/return";

export interface IResultChangeSttsPymnt {
  d: {
    ReturnChangeStatusPayment: {
      results: IReturnBapiret[];
    };
  };
}

export interface IPayloadODataChangeSttsPaymnt {
  ReturnChangeStatusPayment: [];
  StatusPayment: string;
  OrderNumber: string;
  // UseFor: string;
  isShop?: string;
  ExtInvoiceId?: string;
  // AyoCustInfo?: {
  //   Email: string;
  //   Name: string;
  //   Phone: string;
  // };
}

export interface IResultInputApprovalCode {
  d: {
    ReturnInputApprovalCode: {
      results: IReturnBapiret[];
    };
  };
}

export interface IPayloadODataInputApprovalCode {
  ReturnInputApprovalCode: [];
  StatusPayment: string;
  OrderNumber: string;
  DocDate: string;
  // UseFor: string;
  isShop?: string;
  ExtInvoiceId?: string;
  // AyoCustInfo?: {
  //   Email: string;
  //   Name: string;
  //   Phone: string;
  // };
}
