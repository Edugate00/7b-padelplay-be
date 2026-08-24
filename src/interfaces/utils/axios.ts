import { AxiosPromise } from 'axios';

export interface IErrorAxios {
  success: boolean;
  message: string;
  statusCode: number;
  details: AxiosPromise<ErrorCallback>;
}
