export interface PAGINATION_TYPE {
  limit: number;
  page: number;
  offset: number;
  totalPages: number;
  totalCount: number;
}

export interface VALIDATION_ERROR<T> {
  location: string;
  msg: string;
  path: keyof T;
  type: string;
  value: string;
}

export interface PasswordProps {
  length: number;
  includeUpperCase: boolean;
  includeLowerCase: boolean;
  includeNumber: boolean;
  includeSymbols: boolean;
}
