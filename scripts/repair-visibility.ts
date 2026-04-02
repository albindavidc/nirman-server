import 'dotenv/config';
import { PrismaClient, Prisma } from '../src/generated/client/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  try {
    await prisma.$connect();
    console.log('Connected to database.');

    // Repair Vendors
    const vendors = await prisma.vendor.findMany();
    console.log(`Found ${vendors.length} vendors. Repairing...`);
    for (const v of vendors) {
      process.stdout.write(`Reparing Vendor ${v.companyName}... `);
      await prisma.vendor.update({
        where: { id: v.id },
        data: { isDeleted: false },
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
        data: { isDeleted: false },
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
