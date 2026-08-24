export interface IResultBapiret {
  d: { Return: IReturnBapiret };
}

export interface IResultBapiret2 {
  d: { return: IReturnBapiret };
}

export interface IReturnBapiret {
  Type: string;
  Id: string;
  Number: string;
  Message: string;
  LogNo: string;
  LogMsgNo: string;
  MessageV1: string;
  MessageV2: string;
  MessageV3: string;
  MessageV4: string;
  Parameter: string;
  Row: string;
  Field: string;
  System: string;
}

export interface IResponseError {
  status: string;
  success: boolean;
  details: IReturnBapiReturn;
}

export interface IReturnBapiReturn {
  Type: string;
  Id: string;
  Number: string;
  Message: string;
  MessageV1: string;
  MessageV2: string;
  MessageV3: string;
  MessageV4: string;
  Parameter: string;
}
