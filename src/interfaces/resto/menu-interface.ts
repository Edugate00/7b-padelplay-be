// interfaces/resto/menu-interface.ts
export interface IRestoMenuRaw {
    materialName: string;
    materialDesc: string;
    materialCondition: string;
    unit: string;
    unitDesc: string;
    unitPrice: string;
    imgUrl: string;
}

export interface IRestoMenuItem {
    material: string;
    materialDesc: string;
    materialCondition: string;
    unit: string;
    unitDesc: string;
    unitPrice: number;
    imgUrl: string;
    category: "Minuman" | "Makanan" | "Lainnya";
    hasPrice: boolean;
}