
import { prisma } from '@/lib/prisma';

async function main() {
    const universities = await prisma.university.findMany();

    for (const uni of universities) {
        let code = uni.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
        if (code.length < 3) code = (code + "UNI").substring(0, 3);

        // Check if code exists
        let uniqueCode = code;
        let counter = 1;
        while (await prisma.university.findFirst({ where: { code: uniqueCode, NOT: { id: uni.id } } })) {
            uniqueCode = `${code}${counter}`;
            counter++;
        }

        console.log(`Updating ${uni.name} with code ${uniqueCode}`);
        await prisma.university.update({
            where: { id: uni.id },
            data: { code: uniqueCode }
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
