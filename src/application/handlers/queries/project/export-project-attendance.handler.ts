import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ExportProjectAttendanceQuery } from '../../../../application/queries/project/export-project-attendance.query';
import {
  IProjectWorkerRepository,
  PROJECT_WORKER_REPOSITORY,
} from '../../../../domain/repositories/project/project-worker-repository.interface';
import { ATTENDANCE_QUERY_READER } from '../../../../domain/repositories/project-attendance/attendance-repository.interface';
import { IAttendanceQueryReader } from '../../../../domain/repositories/project-attendance/attendance.query-reader.interface';
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from '../../../../domain/repositories/project/project-repository.interface';
import PDFDocument from 'pdfkit';

@QueryHandler(ExportProjectAttendanceQuery)
export class ExportProjectAttendanceHandler implements IQueryHandler<ExportProjectAttendanceQuery> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
    @Inject(PROJECT_WORKER_REPOSITORY)
    private readonly projectWorkerRepository: IProjectWorkerRepository,
    @Inject(ATTENDANCE_QUERY_READER)
    private readonly attendanceQueryReader: IAttendanceQueryReader,
  ) {}

  async execute(
    query: ExportProjectAttendanceQuery,
  ): Promise<PDFKit.PDFDocument> {
    const { projectId } = query;
    const today = new Date();

    // Set time to start of day and end of day for filtering
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch Project
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new Error('Project not found');
    }

    // Fetch Project Workers with user details
    const workers =
      await this.projectWorkerRepository.findByProjectId(projectId);

    // Fetch Attendance for the day
    const attendanceRecords =
      await this.attendanceQueryReader.findByProjectAndDateRange(
        projectId,
        startOfDay,
        endOfDay,
      );

    // Create attendance map for quick lookup
    const attendanceMap = new Map(attendanceRecords.map((a) => [a.userId, a]));

    // Prepare Data
    const data = workers.map((worker, index) => {
      const record = attendanceMap.get(worker.userId);

      return {
        slNo: index + 1,
        name: worker.user
          ? `${worker.user.firstName} ${worker.user.lastName}`
          : 'Unknown',
        role: worker.role.charAt(0).toUpperCase() + worker.role.slice(1),
        site: record?.location || 'Main Building',
        checkIn: record?.checkIn
          ? record.checkIn.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '-',
        checkOut: record?.checkOut
          ? record.checkOut.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '-',
        hours: record?.workHours ? `${record.workHours.value}h` : '-',
        status: record?.status
          ? record.status.value
              .replace('_', ' ')
              .replace(/\b\w/g, (l: string) => l.toUpperCase())
          : 'Absent',
      };
    });

    // Generate PDF
    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    // -- Background --
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#121212');

    // -- Header --
    doc
      .fontSize(20)
      .fillColor('#E9C16C')
      .text('Project Attendance Report', { align: 'center' });

    doc.moveDown(0.5);

    const projectCode = `PRJ-${new Date().getFullYear()}-${projectId.substring(0, 3).toUpperCase()}`;

    doc
      .fontSize(12)
      .fillColor('#FFFFFF')
      .text(`Project: ${project.name} (${projectCode})`, { align: 'center' });

    doc
      .fontSize(10)
      .fillColor('#AAAAAA')
      .text(
        `Date: ${today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
        { align: 'center' },
      );

    doc.moveDown(2);

    // -- Table --
    const tableTop = 150;
    const rowHeight = 30;
    const colX = {
      sl: 30,
      name: 70,
      role: 220,
      checkIn: 320,
      checkOut: 390,
      status: 460,
    };

    // Table Header
    doc.rect(30, tableTop, 535, rowHeight).fill('#333333');
    doc.fillColor('#E9C16C').fontSize(9).font('Helvetica-Bold');

    doc.text('SL', colX.sl, tableTop + 10);
    doc.text('NAME', colX.name, tableTop + 10);
    doc.text('ROLE', colX.role, tableTop + 10);
    doc.text('CHECK-IN', colX.checkIn, tableTop + 10);
    doc.text('CHECK-OUT', colX.checkOut, tableTop + 10);
    doc.text('STATUS', colX.status, tableTop + 10);

    // Table Rows
    let y = tableTop + rowHeight;
    doc.font('Helvetica').fontSize(9);

    data.forEach((row, i) => {
      // Alternate Row Color
      if (i % 2 === 0) {
        doc.rect(30, y, 535, rowHeight).fill('#1E1E1E');
      } else {
        doc.rect(30, y, 535, rowHeight).fill('#252525');
      }

      doc.fillColor('#E0E0E0');

      doc.text(row.slNo.toString(), colX.sl, y + 10);
      doc.text(row.name, colX.name, y + 10, { width: 140, ellipsis: true });
      doc.text(row.role, colX.role, y + 10);
      doc.text(row.checkIn, colX.checkIn, y + 10);
      doc.text(row.checkOut, colX.checkOut, y + 10);

      // Status Color
      if (row.status === 'Absent') doc.fillColor('#ed4f4f');
      else if (row.status === 'Late') doc.fillColor('#ff9f43');
      else if (row.status === 'On Time') doc.fillColor('#2ecc71');

      doc.text(row.status, colX.status, y + 10);

      y += rowHeight;
    });

    doc.end();
    return doc;
  }
}
