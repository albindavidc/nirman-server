import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ExportProjectAttendanceQuery } from '../../../../application/queries/project/export-project-attendance.query';
import {
  IProjectMemberRepository,
  PROJECT_MEMBER_REPOSITORY,
} from '../../../../domain/repositories/project-member-repository.interface';
import {
  IAttendanceRepository,
  ATTENDANCE_REPOSITORY,
} from '../../../../domain/repositories/attendance-repository.interface';
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from '../../../../domain/repositories/project-repository.interface';
import PDFDocument from 'pdfkit';

@QueryHandler(ExportProjectAttendanceQuery)
export class ExportProjectAttendanceHandler implements IQueryHandler<ExportProjectAttendanceQuery> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projectMemberRepository: IProjectMemberRepository,
    @Inject(ATTENDANCE_REPOSITORY)
    private readonly attendanceRepository: IAttendanceRepository,
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

    // Fetch Project Members with user details
    const members =
      await this.projectMemberRepository.findByProjectId(projectId);

    // Fetch Attendance for the day
    const attendanceRecords =
      await this.attendanceRepository.findByProjectAndDateRange(
        projectId,
        startOfDay,
        endOfDay,
      );

    // Create attendance map for quick lookup
    const attendanceMap = new Map(attendanceRecords.map((a) => [a.userId, a]));

    // Prepare Data
    const data = members.map((member, index) => {
      const record = attendanceMap.get(member.userId);

      return {
        slNo: index + 1,
        name: member.user
          ? `${member.user.firstName} ${member.user.lastName}`
          : 'Unknown',
        role: member.role.charAt(0).toUpperCase() + member.role.slice(1),
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
        hours: record?.workHours ? `${record.workHours}h` : '-',
        status: record?.status
          ? record.status
              .replace('_', ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase())
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
