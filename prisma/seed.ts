import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    // 1. Create Universities
    const universities = [
        { name: 'Ghana Communication Technology University (GCTU)', verified: true },
        { name: 'University of Ghana (UG)', verified: true },
        { name: 'Kwame Nkrumah University of Science and Technology (KNUST)', verified: true },
        { name: 'University of Cape Coast (UCC)', verified: true },
        { name: 'University of Professional Studies, Accra (UPSA)', verified: true },
        { name: 'Ghana Institute of Management and Public Administration (GIMPA)', verified: true },
        { name: 'University of Energy and Natural Resources (UENR)', verified: true },
        { name: 'University of Education, Winneba (UEW)', verified: true },
        { name: 'Koforidua Technical University (KTU)', verified: true },
        { name: 'Accra Technical University (ATU)', verified: true },
        { name: 'Takoradi Technical University (TTU)', verified: true },
        { name: 'Kumasi Technical University (KsTU)', verified: true },
        { name: 'Ashesi University', verified: true },
        { name: 'Central University', verified: true },
        { name: 'Valley View University', verified: true },
        { name: 'Knutsford University College', verified: true },
    ];

    for (const uni of universities) {
        await prisma.university.upsert({
            where: { id: uni.name.replace(/\s+/g, '_').toLowerCase() }, // Using a deterministic ID for upsert if possible, but here we rely on create mostly or findFirst
            update: {},
            create: {
                name: uni.name,
                verified: uni.verified,
                logo: '/logos/default.png',
                contactEmail: 'info@' + uni.name.split(' ')[0].toLowerCase() + '.edu.gh',
            },
        });
    }

    console.log('Universities seeded.');

    // 2. Create Departments
    const departments = [
        { name: 'Computer Science', description: 'Department of Computer Science' },
        { name: 'Business Administration', description: 'Department of Business Administration' },
        { name: 'Engineering', description: 'Department of Engineering' },
    ];

    for (const dept of departments) {
        await prisma.department.upsert({
            where: { name: dept.name },
            update: {},
            create: {
                name: dept.name,
                description: dept.description,
            },
        });
    }
    console.log('Departments seeded.');

    // 3. Create Admin User
    const adminEmail = 'bismarkgyawu@raventech.com.gh';
    const adminPassword = await bcrypt.hash('password', 10);

    await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: adminPassword,
            name: 'System Admin',
            role: 'ADMIN',
        },
    });
    console.log('Admin user seeded.');

    // 4. Create Staff User
    const staffEmail = 'staff@gctu.edu.gh';
    const staffPassword = await bcrypt.hash('password', 10);
    const csDept = await prisma.department.findUnique({ where: { name: 'Computer Science' } });

    if (csDept) {
        await prisma.user.upsert({
            where: { email: staffEmail },
            update: {},
            create: {
                email: staffEmail,
                password: staffPassword,
                name: 'Staff Member',
                role: 'STAFF',
                departmentId: csDept.id,
            },
        });
        console.log('Staff user seeded.');
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
