import 'dotenv/config';
import { PrismaClient } from '../src/generated/client/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  try {
    await prisma.$connect();
    console.log('Connected to database.');

    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users:`);
    users.forEach((u) => {
      console.log(
        `- ID: ${u.id}, Email: '${u.email}' (type: ${typeof u.email}), Deleted: ${u.isDeleted} (type: ${typeof u.isDeleted}), Role: ${u.role}`,
      );
    });

    console.log('--- Testing findFirst with ONLY email ---');
    const emailUser = await prisma.user.findFirst({
      where: { email: 'wyji@mailinator.com' },
    });
    console.log(`findFirst(email) result:`, emailUser ? 'Found' : 'NULL');

    console.log('--- Testing findFirst with ONLY isDeleted: false ---');
    const activeUser = await prisma.user.findFirst({
      where: { isDeleted: false },
    });
    console.log(`findFirst(isDeleted) result:`, activeUser ? 'Found' : 'NULL');

    console.log('--- Testing findFirst with BOTH ---');
    const specificUser = await prisma.user.findFirst({
      where: {
        email: 'wyji@mailinator.com',
        isDeleted: false,
      },
    });
    console.log(`findFirst(both) result:`, specificUser ? 'Found' : 'NULL');
  } catch (e) {
    console.error('Error connecting or querying:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
