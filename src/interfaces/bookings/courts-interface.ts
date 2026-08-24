export interface IResultsCourtsAvailbility {
  d: {
    results: [
      {
        bookingDate: string;
        customerID: string;
        startSlot: number;
        maxSlot: number;
        Time: {
          results: IResultTimeAvailbility[];
        };
        Court: {
          results: IResultCourtAvailbility[];
        };
        AllCourts: IResultAllCourts;
      },
    ];
  };
}

export interface IResultTimeAvailbility {
  time: string;
  price: string;
  priceType: string;
}

export interface IResultAllCourts {
  results: IListCourts[];
}

export interface IResultListCourts {
  results: IListCourts[];
}

export interface IListCourts {
  CustomerGroup: string;
  CourtId: string;
  CourtDesc: string;
  Material: string;
  StartSlot: string;
  TotalSlot: string;
  Unit: string;
}

export interface IResultTimeAvailbility {
  time: string;
  price: string;
  tax: string;
  priceType: string;
  discount: string;
}

export interface IResultsCourtsAvailbility {
  d: {
    results: [
      {
        bookingDate: string;
        customerID: string;
        startSlot: number;
        maxSlot: number;
        Time: {
          results: IResultTimeAvailbility[];
        };
        Court: {
          results: IResultCourtAvailbility[];
        };
        AllCourts: IResultAllCourts;
      },
    ];
  };
}
export interface IResultCourtAvailbility {
  bookingId: string;
  timeSlot: string;
  price: string;
  courtID: string;
  courtDesc: string;
  StatusPayment: string;
  Email: string;
  Phone: string;
}
export interface IConvertedAllCourts {
  Star: IAllCourts[];
  Guest: IAllCourts[];
  Member: IAllCourts[];
}

export interface IConvertedCourtList {
  StartSlot: number;
  MaxSlot: number;
  CreatedAt: number;
  ListCourts: ICourts[];
  ListTimes: ITimeCourt[];
  // ListCourts: ICourts[];
}

export interface IAllCourts {
  CourtID: string;
  CourtDesc: string;
  EncryptedID: string;
  Material?: string;
  Unit: string;
}
export interface ICourts {
  CourtID: string;
  CourtDesc: string;
  BookedSlot: number | string;
  Email: string;
  Phone?: string;
  BookingId: string;
}

export interface ITimeCourt {
  Time: string;
  Tax?: string | number;
  Price: number | string;
  Discount?: string | number;
  isExtended?: string[];
}
