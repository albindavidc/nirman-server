/**
 * DTO for pagination metadata
 */
export class PaginationMetaDto {
  totalItems!: number;
  page!: number;
  limit!: number;
  totalPages!: number;
}
