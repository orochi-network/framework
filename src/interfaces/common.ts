export interface IModelCondition<T> {
  field: keyof T;
  operator?: '>' | '<' | '<=' | '>=' | '=' | '!=';
  value: string | number | boolean;
}

export enum EModelLock {
  write = 'WRITE',
  read = 'READ',
}

export type TOrder = 'asc' | 'desc';

export interface IOrderingBy {
  column: string;
  order: TOrder;
}

export interface IPagination {
  total?: number;
  offset: number;
  limit: number;
  order: IOrderingBy[];
}

export interface IRecordList<T> extends IPagination {
  records: T[];
}

export interface IRecord {
  [key: string]: any;
}

export interface IResponse<T> {
  success: boolean;
  deprecated?: boolean;
  result: Error | T | IRecordList<T>;
}
