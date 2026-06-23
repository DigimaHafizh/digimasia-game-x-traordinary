import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: { name: { in: ['Muhammad Rizky Husain', 'Stepanus', 'Honey Fatricya'] } }
    });
    console.log(users.map(u => ({ name: u.name, division: u.division })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
