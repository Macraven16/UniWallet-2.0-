import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning up duplicate universities...');

    const universities = await prisma.university.findMany();
    const seen = new Map<string, string>();
    const duplicates: string[] = [];

    for (const uni of universities) {
        if (seen.has(uni.name)) {
            const keptId = seen.get(uni.name);
            console.log(`Duplicate found for ${uni.name}. Reassigning students from ${uni.id} to ${keptId}...`);

            // Reassign students
            await prisma.student.updateMany({
                where: { schoolId: uni.id },
                data: { schoolId: keptId },
            });

            // Reassign fee structures
            await prisma.feeStructure.updateMany({
                where: { schoolId: uni.id },
                data: { schoolId: keptId },
            });

            // Reassign courses
            await prisma.course.updateMany({
                where: { schoolId: uni.id },
                data: { schoolId: keptId },
            });

            duplicates.push(uni.id);
        } else {
            seen.set(uni.name, uni.id);
        }
    }

    if (duplicates.length > 0) {
        console.log(`Found ${duplicates.length} duplicates. Deleting...`);
        await prisma.university.deleteMany({
            where: {
                id: {
                    in: duplicates,
                },
            },
        });
        console.log('Duplicates deleted.');
    } else {
        console.log('No duplicates found.');
    }
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
