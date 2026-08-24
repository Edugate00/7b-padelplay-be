export interface IConvertedAddOnsItems {
  ListMaterials: ListMaterial[];
}

export interface ListMaterial {
  Material: string;
  MaterialDesc: string;
  UnitPrice: number;
  Currency: string;
  Stock: number;
  Unit: string;
  UnitDesc: string;
}

export interface IResultAddOns {
  d: {
    results: [
      {
        bookingDate: string;
        salesOffice: string;
        ListMaterials: {
          results: IResultListMaterials[];
        };
      },
    ];
  };
}

export interface IResultListMaterials {
  material: string;
  materialDesc: string;
  unitPrice: string;
  currency: string;
  stock: string;
  unit: string;
  unitDesc: string;
  maxQuantity: string;
  disc: number;
  priceAfterDisc: number;
  materialCondition: string;
  imgUrl: string;
}
