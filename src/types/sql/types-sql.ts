import {
  type ISqlType,
  type ISqlTypeFactoryWithNoParams,
  type ISqlTypeFactoryWithLength,
  type ISqlTypeFactoryWithScale,
  type ISqlTypeFactoryWithPrecisionScale,
  type ISqlTypeFactoryWithTvpType,
} from "mssql";

type SqlTypeArg =
  | ISqlType
  | ISqlTypeFactoryWithNoParams
  | ISqlTypeFactoryWithLength
  | ISqlTypeFactoryWithScale
  | ISqlTypeFactoryWithPrecisionScale
  | ISqlTypeFactoryWithTvpType;

type SqlParam = {
  type: SqlTypeArg;
  value: unknown;
};

export type SqlParams = Record<string, SqlParam>;
