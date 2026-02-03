import 'dotenv/config';
import { PrismaClient } from '../src/generated/client/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('Connected to database.');

    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users:`);
    users.forEach((u) => {
      console.log(
        `- ID: ${u.id}, Email: '${u.email}' (type: ${typeof u.email}), Deleted: ${u.is_deleted} (type: ${typeof u.is_deleted}), Role: ${u.role}`,
      );
    });

    console.log('--- Testing findFirst with ONLY email ---');
    const emailUser = await prisma.user.findFirst({
      where: { email: 'wyji@mailinator.com' },
    });
    console.log(`findFirst(email) result:`, emailUser ? 'Found' : 'NULL');

    console.log('--- Testing findFirst with ONLY is_deleted: false ---');
    const activeUser = await prisma.user.findFirst({
      where: { is_deleted: false },
    });
    console.log(`findFirst(is_deleted) result:`, activeUser ? 'Found' : 'NULL');

    console.log('--- Testing findFirst with BOTH ---');
    const specificUser = await prisma.user.findFirst({
      where: {
        email: 'wyji@mailinator.com',
        is_deleted: false,
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
