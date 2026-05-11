const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const answers = await prisma.userAnswer.findMany({
        include: { question: true }
    });
    const counts = {};
    answers.forEach(a => {
        const idx = a.question.index;
        counts[idx] = (counts[idx] || 0) + 1;
    });
    console.log('Answers per question:', counts);

    const users = await prisma.user.count();
    console.log('Total users:', users);
}

check().finally(() => prisma.$disconnect());
