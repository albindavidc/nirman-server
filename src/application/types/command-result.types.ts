export interface CommandResult<T = void> {
  success: boolean;
  id?: string;
  data?: T;
  error?: string;
}
