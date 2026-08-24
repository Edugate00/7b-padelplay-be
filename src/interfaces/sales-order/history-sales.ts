export interface IResponseHistorySales {
    d: {
        results: [{
            dist_chan: string;
            creation_date: string;
            has_more: string;
            HistorySalesGRO: {
                results: IResultHistorySales[]
            },
            ShopHistorySales: {
                results: IResultShopHistorySales[]
            }
        }]
    }
}

export interface IResultHistorySales {
    Email: string;
    NetValue: string;
    Name: string;
    OrdReason: string;
    OrdItem: string;
    CourtId: string;
    CreationDate: string;
    CreationTime: string;
    SdDoc: string;
    MatGroup: string;
    SoldTo: string;
}

export interface IResultHistoryPackage {
    PurchaseDate: string;
    PurchasePlaytime: string;
    PrimeQuantity: string;
    RegularQuantity: string;
    CourtList: string;
    TransactionDateTime: string;
    SalesDocNumber: string;
}

export interface IResultShopHistorySales {
    SdDoc: string;
    Amount: string;
    CreationDate: string;
    CreationTime: string;
    Material: string;
    MaterialDesc: string;
    Assignment: string;
    Quantity: string;
    Payer: string;
}