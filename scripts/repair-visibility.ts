import 'dotenv/config';
import { PrismaClient } from '../src/generated/client/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('Connected to database.');

    // Repair Vendors
    const vendors = await prisma.vendor.findMany();
    console.log(`Found ${vendors.length} vendors. Repairing...`);
    for (const v of vendors) {
      process.stdout.write(`Reparing Vendor ${v.company_name}... `);
      await prisma.vendor.update({
        where: { id: v.id },
        data: { is_deleted: false },
      });
      console.log('Done.');
    }

    // Repair Projects
    const projects = await prisma.project.findMany();
    console.log(`Found ${projects.length} projects. Repairing...`);
    for (const p of projects) {
      process.stdout.write(`Reparing Project ${p.name}... `);
      await prisma.project.update({
        where: { id: p.id },
        data: { is_deleted: false },
      });
      console.log('Done.');
    }

    console.log('Repair complete.');
  } catch (e) {
    console.error('Error querying:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
