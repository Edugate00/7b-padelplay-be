import { IPayloadCreateSalesOrder } from "../bookings-order-interface";

export interface IItemsCreate {
  selectedAddOns: ISelectedAddOn[];
  selectedCourt: ISelectedCourt[];
  selectedTimesData: ISelectedTimesDatum[];
  // selectedClass: ISelectedClass[];
  selectedCoaches: ISelectedCoach[];
  selectedBundles: ISelectedBundle[]; // Menggunakan ISelectedClassJoin untuk menyimpan data bundle dengan informasi tambahan
  // selectedClassToJoin: ISelectedClassJoin[];
}
export interface ISelectedBundle {
  BookingID: number;
  BundleID: string;
  BundleName: {
    bundleId: string;
    unit: string;
    category: string;
    quantity?: string;
  }[];
  Unit: string;
  PrimeCount: number;
  RegularCount: number;
}
export interface ISelectedCoach {
  BookingID: number;
  CoachID: string;
  Player: number;
  TimeSlots: string[];
}

export interface ISelectedAddOn {
  BookingDate: string;
  BookingID: number;
  Items: IAddOns[];
}

export interface IAddOns {
  Item: string;
  ItemDesc: string;
  Quantity: number;
  Unit: string;
}

export interface ISelectedCourt {
  BookingDate: string;
  BookingID: number;
  Courts: IPayloadCourt[];
}

export interface IPayloadCourt {
  CourtDesc: string;
  CourtID: string;
  CoachID: string;
  Unit: string;
  Material: string;
  PayUsingPackage: boolean;
  Times: number[];
}

export interface ISelectedTimesDatum {
  BookingDate: string;
  BookingID: number;
  Times: number[];
}

export interface ISelectedClass {
  BookingDate: string;
  BookingID: number;
  Quantity: string;
  Unit: string;
  Material: string;
}
export interface ISelectedClassJoin extends ISelectedClass {
  RefDoc: string;
  Court: string;
  CoachCode: string;
}

export interface IProfileCreateSalesOrder {
  Name: string;
  PhoneNumber: string;
  Email: string;
}

export interface IPartnerCreate {
  PartnRole: string;
  PartnNumb: string;
}

export interface IBodyRequestCreateSalesOrder {
  ProfileCustomer: IProfileCreateSalesOrder;
  Payload: IItemsCreate;
  IsPayWithPackage: boolean;
}

export interface IPayloadODataCreateSO extends IProfileCreateSalesOrder {
  ItemsCreate: IPayloadCreateSalesOrder[];
  PartnerCreate: IPartnerCreate[];
  ReturnCreate: [];
}

export interface IMaterialCondition {
  MATERIAL_CONDITION: string;
}

export type ICategoryTimeResponse = {
  d: {
    categoryTime: string;
    bookingDate: string;
    time: string;
    distChan: string;
    __metadata: {
      id: string;
      uri: string;
      type: string;
    };
  };
};

export interface IConvertedQuotaPackages {
  PackageID: string;
  PackageName: string;
  Quota: string;
  Unit: string;
}

export interface IMaterialCoach {
  MATERIAL_ID: string;
  UNIT: string;
}
