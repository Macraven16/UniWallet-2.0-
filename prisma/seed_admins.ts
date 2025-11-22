import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database reset...');

    // Delete all users (cascade will handle related records like Student, Wallet, etc.)
    // But to be safe and clean, we can delete related first or rely on cascade.
    // Given schema has onDelete: Cascade for many relations, deleting User should work.
    // However, Transaction -> Wallet -> Student -> User.
    // Transaction has relation to Wallet. Wallet has relation to Student. Student has relation to User.
    // If we delete User, Student is deleted (Cascade).
    // If Student is deleted, Wallet is deleted (Cascade).
    // If Wallet is deleted, Transaction might complain if not Cascade.
    // Let's check schema:
    // Wallet -> transactions Transaction[] (no onDelete specified in Transaction model for wallet relation)
    // So we might need to delete Transactions first.

    await prisma.transaction.deleteMany({});
    await prisma.wallet.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.budget.deleteMany({});
    await prisma.savings.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.auditLog.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('All users and related data deleted.');

    // Create Master Admins
    const password = 'SecurePassword123!'; // We will share this with the user
    const hashedPassword = await bcrypt.hash(password, 10);

    const admins = [
        { email: 'admin@gctu.edu.gh', name: 'GCTU Master Admin' },
        { email: 'admin@raventech.com.gh', name: 'RavenTech Master Admin' },
    ];

    for (const admin of admins) {
        await prisma.user.create({
            data: {
                email: admin.email,
                name: admin.name,
                password: hashedPassword,
                role: 'MASTER_ADMIN',
            },
        });
        console.log(`Created Master Admin: ${admin.email}`);
    }

    console.log('Database reset and seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
