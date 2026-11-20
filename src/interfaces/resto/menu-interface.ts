// interfaces/resto/menu-interface.ts
export interface IRestoMenuItem {
    material: string;
    materialDesc: string;
    materialCondition: string;
    unit: string;
    unitDesc: string;
    unitPrice: number;
    imgUrl: string;
    category: "Minuman" | "Makanan" | "";
}

export interface IResponseMenu {
    d: {
        results: IRestoMenuItem[]
    }
}