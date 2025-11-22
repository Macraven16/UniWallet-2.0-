import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.university.count();
    console.log(`Universities count: ${count}`);

    const unis = await prisma.university.findMany({ take: 5 });
    console.log('Sample universities:', unis);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
