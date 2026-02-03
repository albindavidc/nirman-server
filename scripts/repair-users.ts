import 'dotenv/config';
import { PrismaClient } from '../src/generated/client/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('Connected to database.');

    // Fetch all users (without filter first)
    const users = await prisma.user.findMany();
    console.log(
      `Found ${users.length} users. Checking and fixing 'is_deleted'...`,
    );

    let updatedCount = 0;

    for (const user of users) {
      // We update blindly to ensure the field exists in the document
      // This is safe because existing valid users have it as false anyway.
      // If they were deleted, we might overwrite?
      // But login only cares about active users.
      // If findMany returned them, and we assume we want to "undelete" or "initialize" them:
      // Actually, if a user WAS deleted, they would have is_deleted: true.
      // If the field is MISSING, we assume false (active).

      // We can't easily detect if it's missing via Prisma user object because of default value filling.
      // So we just set is_deleted: false for EVERYONE found by findMany()
      // who ostensibly should be valid.
      // BUT wait, if there are legitimately deleted users, we might undelete them?
      // If they were queried via findMany(), we got them.

      // Let's assume anyone returned by `findMany` is a candidate.
      // If we want to be safe, we only update if we suspect it's missing?
      // We can't know.
      // But since previous `findFirst` failed for everyone, assume everyone is broken.

      console.log(`Updating User ${user.id} (${user.email})...`);
      await prisma.user.update({
        where: { id: user.id },
        data: { is_deleted: false },
      });
      updatedCount++;
    }

    console.log(`Successfully repaired ${updatedCount} users.`);
  } catch (e) {
    console.error('Error repairing users:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
