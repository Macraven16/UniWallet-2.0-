import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding students...');

    // Get a university
    const uni = await prisma.university.findFirst();
    if (!uni) {
        console.error('No university found. Run prisma/seed.ts first.');
        return;
    }

    // Create 3 sample students
    const students = [
        { name: 'Kwame Mensah', email: 'kwame@gctu.edu.gh', id: 'GCTU-2024-001' },
        { name: 'Ama Osei', email: 'ama@gctu.edu.gh', id: 'GCTU-2024-002' },
        { name: 'Kofi Boateng', email: 'kofi@gctu.edu.gh', id: 'GCTU-2024-003' },
    ];

    const password = await bcrypt.hash('password123', 10);

    for (const s of students) {
        // Create User
        const user = await prisma.user.upsert({
            where: { email: s.email },
            update: {},
            create: {
                email: s.email,
                password,
                name: s.name,
                role: 'STUDENT',
            },
        });

        // Create Student Profile & Wallet
        await prisma.student.upsert({
            where: { userId: user.id },
            update: {},
            create: {
                userId: user.id,
                schoolId: uni.id,
                studentIdNumber: s.id,
                grade: 'Level 200',
                campus: 'Main Campus',
                wallet: {
                    create: {
                        balance: 100.00, // Initial balance
                    }
                }
            },
        });
        console.log(`Created student: ${s.name}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
