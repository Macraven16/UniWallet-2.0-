import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.student.count();
    console.log(`Students count: ${count}`);

    if (count > 0) {
        const s = await prisma.student.findFirst({ include: { user: true } });
        console.log('Sample student:', s?.user?.name);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
