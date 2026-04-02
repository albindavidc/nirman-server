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

    // Check Vendors
    const totalVendors = await prisma.vendor.count();
    const visibleVendors = await prisma.vendor.count({
      where: { isDeleted: false },
    });
    console.log(
      `Vendors: Total=${totalVendors}, Visible(isDeleted:false)=${visibleVendors}`,
    );

    if (totalVendors > 0 && visibleVendors === 0) {
      console.log('ALERT: Vendors exist but are filtered out by isDeleted!');
    }

    // Check Projects
    const totalProjects = await prisma.project.count();
    const visibleProjects = await prisma.project.count({
      where: { isDeleted: false },
    });
    console.log(
      `Projects: Total=${totalProjects}, Visible(isDeleted:false)=${visibleProjects}`,
    );

    if (totalProjects > 0 && visibleProjects === 0) {
      console.log('ALERT: Projects exist but are filtered out by isDeleted!');
    }
  } catch (e) {
    console.error('Error querying:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
