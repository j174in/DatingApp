export type Pagination = {
  currentPage: number;
  pageSize: number;
  count: number;
  totalPages: number;
};

export type PaginatedResult<T> = {
  metadata: Pagination;
  items: T[];
};
