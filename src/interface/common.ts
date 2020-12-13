export interface ListItem {
  id: number;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
  createdBy: string;
  updatedBy: string;
  [prop: string]: any;
}

export interface ListPagination {
  total: number;
  page: number;
  limit: number;
}

export interface ListData {
  list: ListItem[];
  pagination: Partial<ListPagination>;
}

export interface ListParams {
  [key: string]: any;
  offset?: number;
  limit?: number;
  sort?: string;
}

export interface ApiStateType {
  code?: number;
  msg?: string;
  data?: { [key: string]: any } | any;
}
