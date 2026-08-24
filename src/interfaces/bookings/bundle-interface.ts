export interface IResultBundle {
  d: {
    results: [
      {
        ListBundle2: {
          results: IResultListBundle[];
        };
      },
    ];
  };
}

export interface IResultListBundle {
  BundleId: string;
  BundleName: string;
  BundleDesc: string;
  Hour: string;
  Unit: string;
  Price?: string;
  ParentPrice?: string;
  ChildPrice?: string;
  Currency: string;
  Category: string;
  Comgroup: string;
}

export interface IResultMinMaxSlotsByCat {
  type: string;
  dayCategory: string;
  minSlot: string;
  maxSlot: string;
}

export interface IConvertedListBundle {
  bundleId: string;
  bundleName: {
    bundleId: string;
    unit: string;
    category: string;
  }[];
  bundleDesc: string;
  hour: number;
  quantity?: string;
  slotsRange: [string, string, string][];
  price: number;
  taxPrice: number;
  currency: string;
  unit: string;
  isWeekdays: boolean;
  saverCount: number;
  midCount: number;
  peakCount: number;
  supremeCount: number;
  beyondCount: number;
  liteCount: number;
  regularCount: number;
  primeCount: number;
}
