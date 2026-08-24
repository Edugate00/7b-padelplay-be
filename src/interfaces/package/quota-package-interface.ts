export interface IQuotaPackagesResponse {
  PACKAGE_ID: string;
  PACKAGE_NAME: string;
  QUOTA: string | number;
  UNIT: string | number;
}

export interface IHeldQuotaPackagesResponse {
  PACKAGE_ID: string;
  HELD_QUOTA: string | number;
}

export interface IConvertedQuotaPackages {
  PackageID: string;
  PackageName: string;
  Quota: string | number;
  Unit: string | number;
}

