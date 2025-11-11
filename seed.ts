import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create test user
  await prisma.user.upsert({
    where: {
      email: "dev@opennewswire.net",
    },
    update: {},
    create: {
      email: "dev@opennewswire.net",
      name: "Open Newswire Dev",
      password_hash: "$argon2id$v=19$m=19456,t=2,p=1$mTY1TJH7wqsEQpGvZDh17Q$JNzmXJXJCX3oYShRvX1Oh7/oqFbkM20y0TqNczeRgcU", // "opennewswire", hashed
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
