export interface IFinancialData {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export interface IFinancialResponse<T> {
  data: T;
  message: string;
}

export type IDataUpdateProduct = Omit<IFinancialData, 'id'>;

export type ResponseWithMessage = Omit<IFinancialResponse<unknown>, 'data'>;
