export interface IBookingItem {
  Item: string;
  ItemDesc: string;
  Quantity: number;
  Unit: string;
  Price: number;
}

export interface ISelectedAddOn {
  BookingDate: string; // format: dd-mm-yyyy
  BookingID: number;
  Items: IBookingItem[];
}

export interface ICourt {
  CourtID: string;
  CourtDesc: string;
  Material: string;
  Unit: string;
  PayUsingPackage: boolean;
}

export interface ISelectedCourt {
  BookingDate: string;
  BookingID: number;
  Courts: ICourt[];
}

export interface ISelectedTimes {
  BookingDate: string;
  BookingID: number;
  Times: string[]; // format: "HH" (e.g., "01", "22")
}

export interface ISelectedCoach {
  BookingID: number;
  CoachID: string;
  Player: number;
  TimeSlots: string[]; // format: "HH"
}

export interface IProfileCustomer {
  Name: string;
  PhoneNumber: string;
  Email: string;
  CustomerID: string;
  IsMember: boolean;
}

export interface IPayloadBookingOrder {
  selectedAddOns?: ISelectedAddOn[];
  selectedCourt: ISelectedCourt[];
  selectedTimesData: ISelectedTimes[];
  selectedCoaches?: ISelectedCoach[];
}

export interface IPayloadClassBookingOrder {
  selectedCourt: ISelectedCourt[];
  classDetail: ClassDetail;
}

export interface IBookingOrderData {
  payload: IPayloadBookingOrder;
  isPayWithPackage: boolean;
  paymentMethod: string;
  profileCustomer: IProfileCustomer;
}

export interface IClassBookingOrderData {
  payload: IPayloadClassBookingOrder;
  paymentMethod: string;
  profileCustomer: IProfileCustomer;
}

export interface ClassDetail {
  ClassID?: string;
  UserID: string;
  SalesDoc?: string;
  SalesOrg?: string;
  DistChan?: string;
  Title: string;
  Price: number;
  StartTime: string;
  EndTime: string;
  SportsType: string;
  MaxSlot: string;
  Location: string;
  PlayDate: string;
  Difficulty: string;
}

export interface IProfileCreateSalesOrder {
  Name: string;
  Telephone: string;
  Email: string;
}

export interface IPayloadODataCreateSO extends IProfileCreateSalesOrder {
  ItemsCreate: IPayloadCreateSalesOrder[];
  PartnerCreate: IPartnerCreate[];
  ReturnCreate: [];
}

export interface IPayloadCreateSalesOrder {
  ItmNumber: string;
  Material: string;
  Ref1S: string;
  PriceDate: string;
  TargetQty: string;
  Cstcndgrp1: string;
  Cstcndgrp2: string;
  Cstcndgrp3: string;
  Cstcndgrp4: string;
  SalesUnit?: string;
  PoitmNoS: string;
  RefDoc?: string;
  PriceGrp?: string;
  ItemCateg?: string;
}

export interface IPartnerCreate {
  PartnRole: string;
  PartnNumb: string;
}
