import { Query } from '@nestjs/cqrs';

export class ExportProjectAttendanceQuery extends Query<PDFKit.PDFDocument> {
  constructor(public readonly projectId: string) {
    super();
  }
}
