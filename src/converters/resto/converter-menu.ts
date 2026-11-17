import { IRestoMenuItem, IRestoMenuRaw } from "../../interfaces/resto/menu-interface";

// Sementara: kategori dari awalan kode material (grup material belum ikut di respons OData)


export function convertRespMenu(raw: any): IRestoMenuItem[] {
  // requestReadWithParams belum saya lihat: baca beberapa kemungkinan bentuk
  const header =
    raw?.d?.results?.[0] ?? raw?.results?.[0] ?? (Array.isArray(raw) ? raw[0] : raw);
  const rows: IRestoMenuRaw[] = header?.listMenu?.results ?? header?.listMenu ?? [];

  return rows.map((r) => {
    const price = Number(r.unitPrice) || 0;
    return {
      material: r.materialName,
      materialDesc: r.materialDesc,
      materialCondition: r.materialCondition || "ZS", // BONUS kosong di master, supaya lolos filter ZS/ZT di UI
      unit: r.unit,
      unitDesc: r.unitDesc,
      unitPrice: price,
      imgUrl: r.imgUrl,
      category: r.category,
      hasPrice: price > 0,
    };
  });
}