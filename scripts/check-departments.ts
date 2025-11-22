
import { prisma } from '@/lib/prisma';

async function main() {
    const departments = await prisma.department.findMany();
    console.log('Departments:', departments);

    const staff = await prisma.user.findMany({
        where: { role: 'STAFF' },
        include: { department: true }
    });
    console.log('Staff:', staff.map(s => ({ name: s.name, dept: s.department?.name })));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
