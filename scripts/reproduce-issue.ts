
import { prisma } from '@/lib/prisma';

async function main() {
    // 1. Create a test user
    const user = await prisma.user.create({
        data: {
            email: `test-${Date.now()}@example.com`,
            password: 'password',
            name: 'Test User',
            role: 'STAFF'
        }
    });
    console.log('Created user:', user.id);

    // 2. Try to update with empty string departmentId
    try {
        const updated = await prisma.user.update({
            where: { id: user.id },
            data: {
                departmentId: ""
            }
        });
        console.log('Updated user with empty string departmentId:', updated);
    } catch (e) {
        console.log('Failed to update with empty string departmentId');
        // console.error(e);
    }

    // 3. Try to update with null
    try {
        const updatedNull = await prisma.user.update({
            where: { id: user.id },
            data: {
                departmentId: null
            }
        });
        console.log('Updated user with null departmentId:', updatedNull.departmentId);
    } catch (e) {
        console.log('Failed to update with null');
        console.error(e);
    }

    // Cleanup
    await prisma.user.delete({ where: { id: user.id } });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
