export interface QueryResult<T> {
  data: T;
  meta?: Record<string, unknown>;
}
