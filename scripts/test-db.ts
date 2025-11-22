
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        await prisma.$connect();
        console.log('Successfully connected to database!');

        const userCount = await prisma.user.count();
        console.log(`Found ${userCount} users.`);

        await prisma.$disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error connecting to database:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();
