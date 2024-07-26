export interface IFinancialData {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: Date;
  date_revision: Date;
}

export interface IFinancialResponse {
  data: IFinancialData[];
}
