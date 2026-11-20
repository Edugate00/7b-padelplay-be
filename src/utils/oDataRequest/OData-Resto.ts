// utils/oDataRequest/OData-Resto.ts
import { IQueryParamsOData } from "../../interfaces/utils/odata";
import { requestReadWithParams } from "./OData-Request";

export const getRestoMenu = async (distChan: string) => {
    const params = {
        $filter: `distChan eq '${distChan}'`,
    } as IQueryParamsOData;
    const endpoint = "/ZRESTO_SRV/listMenuSet";
    return requestReadWithParams(params, endpoint);
};