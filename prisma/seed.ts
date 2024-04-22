import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await hash('User123', 12);
  const user1 = await prisma.user.upsert({
    where: {
      id: 1,
    },
    create: {
      username: 'user1',
      password,
    },
    update: {},
  });

  const user2 = await prisma.user.upsert({
    where: {
      id: 2,
    },
    create: {
      username: 'user2',
      password,
    },
    update: {},
  });

  console.log({
    user1,
    user2,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
