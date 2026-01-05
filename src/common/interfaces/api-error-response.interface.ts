export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  errors?: string[] | null;
  timestamp: string;
  path: string;
  errorCode?: string; // e.g., 'P2002' for Prisma unique constraint
}
