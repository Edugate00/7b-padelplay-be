import { IReturnBapiret } from "../utils/return";

export interface IResponseDetailSalesOrder {
  SALES_ORDER_ID: string;
  SALES_ORDER_STATUS: string;
  SALES_ORDER_PRICE: number;
}

export interface IDetailSalesOrder {
  id: string;
  status: string;
}

export interface IDataCustomerSalesOrder {
  EMAIL: string;
  FULLNAME: string;
  SALES_ORDER_ID: string;
  SALES_ORDER_STATUS: string;
  SALES_ORDER_PRICE: number;
  SALES_ORDER_DATE: string;
  SALES_ORDER_TIME: string;
}

export interface IResponseDetailSO {
  d: {
    results: IResultDataDetailSO[];
  };
}

export interface IResultDetailSOBundles {
  results: IResultListBundles[];
}
export interface IResultListBundles {
  OrderItem: string;
  Material: string;
  BundleDesc: string;
  BasePrice: string;
  Court: string;
  Time: string;
  TaxPrice: string;
  BundlePrice: string;
  ItemCateg: string;
  BookingDate: string;
  Location: string;
}

export interface IResultDataDetailSO {
  BookingID: string;
  CreatedDate: string;
  SourceType: string;
  CreatedTime: string;
  StatusPayment: string;
  DataCustomer: IResultDataCustomer;
  Return: IReturnBapiret;
  ListAddOns: IResultDetailSOAddOns;
  ListCoaches: IResultDetailSOCoaches;
  ListCourt: IResultDetailSOCourt;
  ListPackage: IResultDetailPackage;
  ListSN: IResultDetailListSN;
  listBundles: IResultDetailSOBundles;
}
export interface IResultDetailSOAddOns {
  results: IResultListAddOns[];
}

export interface IResultDetailSOCoaches {
  results: IResultListCoaches[];
}
export interface IResultDetailSOCourt {
  results: IResultListCourt[];
}
export interface IResultDetailPackage {
  results: IResultListPackage[];
}

interface IResultDetailListSN {
  results: IResultListSN[];
}

export interface IResultListSN {
  MaterialId: string;
  SerialNumber: string;
}

export interface IResultListPackage {
  OrderItem: string;
  ParentId: string;
  ParentDesc: string;
  QuantityParent: string;
  MaterialId: string;
  MaterialDesc: string;
  Price: string;
  Quantity: string;
  StatusGi: string;
}

export interface IResultListCoaches {
  OrderItem: string;
  BookingDate: string;
  CoachID: string;
  CoachName: string;
  Time: string;
  StatusPayment: string;
}

export interface IResultListCourt {
  OrderItem: string;
  BookingDate: string;
  BasePrice: string;
  DiscountPrice: string;
  TaxPrice: string;
  CourtID: string;
  CourtPrice: string;
  IsCheckin: string;
  Type: string;
  Time: string;
  PaymentPackage: string;
}

export interface IResultListAddOns {
  OrderItem: string;
  BookingDate: string;
  MaterialDesc: string;
  Price: string;
  DiscountPrice: string;
  Type: string;
  Quantity: string;
  Unit: string;
  TotalPrice: string;
  StatusGi: string;
}

export interface IResultDataCustomer {
  CustomerName: string;
  Email: string;
  PhoneNumber: string;
  AyoId: string;
}

export interface IResultListCourts {
  OrderItem: string;
  BookingDate: string;
  Type: number;
  CourtId: string;
  Time: string;
  CourtPrice: number;
}

export interface IConvertedListCourts {
  OrderItem: string;
  BookingDate: string;
  CourtId: string;
  TimeSlot: Array<{ Time: string; Type: string; Price: number }>;
}

export interface IResultListCoach {
  OrderItem: string;
  BookingDate: string;
  CoachId: string;
  CoachName: string;
  Time: string[];
  CoachPrice: number;
}

export interface IConvertedListCoach {
  OrderItem: string;
  BookingDate: string;
  CoachId: string;
  CoachName: string;
  TimeSlot: string[];
  Price: number;
}

export interface IConvertedDetailSO {
  BookingID: string;
  SourceType: string;
  TsDateTime: string;
  StatusPayment: string;
  Pricing: IConvertedPricing;
  CustomerData: IResultDataCustomer;
  BookingDetail: IConvertedBookingDetail[];
}

export interface IConvertedDetailSOBundle {
  OrderNum?: string;
  OrderItem?: string;
  Material?: string;
  BundleDesc: string;
  BasePrice: string | number;
  TaxPrice: string | number;
  BundlePrice: string | number;
  Child: {
    BundleDesc: string;
    Quantity: string | number;
  }[];
  BookingDate: string;
  IsCheckin: boolean;
  Courts: IConvertedDetailSOBundleChild[];
}

export interface IConvertedDetailSOBundleChild {
  OrderItem?: string;
  Material?: string;
  Court: string;
  Time: string;
  BundleDesc: string;
}

export interface IConvertedBookingDetail {
  OrderItem: string;
  ListCourt: IConvertedDetailSOListCourt[];
  ListCoaches: IConvertedDetailSOListCoach[];
  ListAddOns: IConvertedAddOnsGrouped;
  ListBundles: IConvertedDetailSOBundle[];
  ListPackage: IConvertedPackageGroup[];
}

export interface IConvertedDetailSOListCourt {
  CourtID: string;
  CourtDesc: string;
  CourtPrice: string | number;
  DiscountPrice: string | number;
  BasePrice: string | number;
  TaxPrice: string | number;
  Type: string;
  Time: string;
  CheckIn: boolean;
  PaymentPackage: boolean;
}

export interface IConvertedDetailSOListCoach {
  //   CoachID: string;
  CoachName: string;
  CoachPrice: string | number;
  Status: string;
  TimeSlot: string[];
}
export interface IConvertedDetailSOListAddOns {
  MaterialName: string;
  Price: string | number;
  Unit: string;
  Type: string;
  IsIssued: boolean;
}

export interface IConvertedAddOnItem {
  MaterialID: string;
  MaterialName: string;
  Price: string | number;
  DiscountPrice: string | number;
  Quantity: number;
  IsIssued: boolean;
  Unit: string;
  SalesDoc: string;
  ListSN: string[];
  OrderItem: string;
  TypeDoc: string;
  ItemCateg: string;
}

export interface IConvertedDataCustomer {
  CustomerName: string;
  Email: string;
  PhoneNumber: string;
}

export type IConvertedAddOnsGrouped = Record<
  string, // Type: "ZR", "ZS"
  {
    Items: IConvertedAddOnItem[];
  }
>;

export interface IPricingTotal {
  OrderNumber: string;
  Price: string | number;
}

export interface IConvertedPricing {
  TotalAddOns: IPricingTotal[];
  TotalCourts: IPricingTotal[];
  TotalCoaches: IPricingTotal[];
  TotalPackage: IPricingTotal[];
  TotalPrice: IPricingTotal[];
  TotalBundles: IPricingTotal[];
}

export type IConvertedPackageItem = {
  MaterialId: string;
  MaterialDesc: string;
  Quantity: number | string;
};

export type IConvertedPackageGroup = {
  ParentId: string;
  ParentDesc: string;
  QuantityParent: number | string;
  Price: string | number;
  Items: IConvertedPackageItem[];
};

export type ISalesOrderItemDetail = {
  itemNumber: number;
  externalItemNumber?: string | undefined;
  materialNumber: string;
  materialDesc: string;
  materialCategory?: string | undefined;
  quantity: number;
  unit: string;
  price: number;
  totalPrice: number;
  bookingDate?: string | undefined;
  qrText: string;
};
