import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding data...');

    // 1. Create Admin
    await prisma.user.upsert({
        where: { pin: '9999' },
        update: {},
        create: {
            name: 'Admin',
            pin: '9999',
            division: 'ADMIN',
            isAdmin: true,
            isJoined: true,
        },
    });

    // 2. Create Users
    const users = [
        { name: 'Hafizh', pin: '1001', division: 'TECH' },
        { name: 'Mita', pin: '1002', division: 'DESIGN' },
        { name: 'Domet', pin: '1003', division: 'TECH' },
        { name: 'Rizky', pin: '1004', division: 'HR' },
        { name: 'Hana', pin: '1005', division: 'MARKETING' },
        { name: 'Frista', pin: '1006', division: 'FINANCE' },
        { name: 'Andre', pin: '1007', division: 'TECH' },
    ];

    for (const u of users) {
        await prisma.user.upsert({
            where: { pin: u.pin },
            update: {},
            create: {
                name: u.name,
                pin: u.pin,
                division: u.division,
                isAdmin: false,
                isJoined: false,
            },
        });
    }

    // 3. Create Dummy Candidates (if table empty)
    const candidateCount = await prisma.candidate.count();
    if (candidateCount === 0) {
        await prisma.candidate.createMany({
            data: [
                { id: 't1', name: 'Tech Wizards', division: 'TECH', type: 'team', imageUrl: '' },
                { id: 't2', name: 'Design Masters', division: 'DESIGN', type: 'team', imageUrl: '' },
                { id: 't3', name: 'Marketing Heroes', division: 'MARKETING', type: 'team', imageUrl: '' },
                { id: 'd1', name: 'Hafizh', division: 'TECH', type: 'digimer', imageUrl: '' },
                { id: 'd2', name: 'Mita', division: 'DESIGN', type: 'digimer', imageUrl: '' },
                { id: 'd3', name: 'Andre', division: 'TECH', type: 'digimer', imageUrl: '' },
            ]
        });
    }

    // 4. Create Trivia Questions
    console.log('Seeding trivia questions...');
    const questions = [
        { index: 1, text: 'Apa warna logo Digimasia?', options: JSON.stringify(['Merah', 'Biru', 'Hijau', 'Kuning']), answer: 1 },
        { index: 2, text: 'Tahun berapa Digimasia didirikan?', options: JSON.stringify(['2010', '2015', '2018', '2020']), answer: 2 },
        { index: 3, text: 'Apa core value utama kita?', options: JSON.stringify(['Speed', 'Quality', 'Integrity', 'All of above']), answer: 3 },
        { index: 4, text: 'Siapa CEO Digimasia saat ini?', options: JSON.stringify(['Bapak A', 'Bapak B', 'Bapak C', 'Bapak D']), answer: 0 },
        { index: 5, text: 'Berapa jumlah divisi di kantor kita?', options: JSON.stringify(['4', '6', '8', '10']), answer: 2 },
        { index: 6, text: 'Apa tagline event X-Celerate?', options: JSON.stringify(['Move Fast', 'Grow the Tree', 'Shoot for Star', 'Break the Limit']), answer: 1 },
        { index: 7, text: 'Di kota mana kantor pusat kita?', options: JSON.stringify(['Jakarta', 'Bandung', 'Surabaya', 'Medan']), answer: 0 },
        { index: 8, text: 'Apa nama maskot kita?', options: JSON.stringify(['Digi', 'Masia', 'Treey', 'Celer']), answer: 0 },
        { index: 9, text: 'Platform apa yang kita gunakan untuk chat?', options: JSON.stringify(['Slack', 'Discord', 'WhatsApp', 'Teams']), answer: 0 },
        { index: 10, text: 'Apa pencapaian terbesar kita tahun ini?', options: JSON.stringify(['Project A', 'Project B', 'IPO', 'X-Celerate']), answer: 3 },
    ];

    for (const q of questions) {
        await prisma.question.upsert({
            where: { index: q.index },
            update: q,
            create: q,
        });
    }

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
