import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const employees = [
    { name: "Daniel V. Lie", division: "Global Chief Executive" },
    { name: "Karib Chiang", division: "Technology & Operation" },
    { name: "Dyah Prajnaparamita", division: "Technology & Operation" },
    { name: "Vania Sari Muchardie", division: "Organization Support" },
    { name: "Honey Fatricya", division: "Organization Support" },
    { name: "Stefany Arlianty", division: "Content Design" },
    { name: "Alfridho Yuliananda", division: "Content Design" },
    { name: "Inayatul Noor Amaliah", division: "Content Design" },
    { name: "Frista Diah Ramadhani", division: "Content Design" },
    { name: "Amelia Nur Azizah", division: "Content Design" },
    { name: "Nabila Paradays", division: "Content Design" },
    { name: "Ratna Indah Screenaningrum", division: "Content Design" },
    { name: "Agung Trisno Atmojo", division: "Content Design" },
    { name: "Fredy Wijaya", division: "Content Design" },
    { name: "Asep Badrudin", division: "Content Design" },
    { name: "Hanafiah Yunan Putri", division: "Content Design" },
    { name: "Andre Alfadjrid", division: "Content Design" },
    { name: "Hari Mujana", division: "Content Design" },
    { name: "Stepanus", division: "Interaction Design" },
    { name: "Heri Irwanto", division: "Interaction Design" },
    { name: "Tedy Iman Priyo Lestanto", division: "Interaction Design" },
    { name: "Yusuf Faisal Agus Saputro", division: "Software Engineering & QA" },
    { name: "Agunahwan Absin", division: "Software Engineering & QA" },
    { name: "Muhammad Reza", division: "Software Engineering & QA" },
    { name: "Christover Ramanda Moa", division: "Software Engineering & QA" },
    { name: "Muhammad Rizky Husain", division: "Software Engineering & QA" },
    { name: "Wahyu Candra Indhiarta", division: "Software Engineering & QA" },
    { name: "Muhammad Hafizh Abdillah", division: "Software Engineering & QA" },
    { name: "Fahmi Fikri Kurniawan", division: "Customer Support" },
    { name: "Putra Indra Tri Cahya", division: "Customer Support" },
    { name: "Cherly Diansacharina Tri Wahyuningsuara", division: "Customer Support" },
    { name: "Resfi Anggraeni", division: "General Affairs" },
    { name: "Mediani Prima Ismary", division: "General Affairs" },
    { name: "Mayang Gita", division: "Sales" },
    { name: "Danny Zainaldi", division: "Project Management" },
];

async function main() {
    console.log('Cleaning up existing data...');
    await prisma.userAnswer.deleteMany({});
    await prisma.vote.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.candidate.deleteMany({});
    await prisma.question.deleteMany({});

    console.log('Seeding Admin...');
    await prisma.user.create({
        data: {
            name: 'Admin',
            pin: '9999',
            division: 'ADMIN',
            isAdmin: true,
            isJoined: true,
        },
    });

    console.log('Seeding employees...');
    for (let i = 0; i < employees.length; i++) {
        const emp = employees[i];
        const pin = (1001 + i).toString();
        await prisma.user.create({
            data: {
                name: emp.name,
                pin: pin,
                division: emp.division,
                isAdmin: false,
                isJoined: false,
                collectedWater: 0,
                contributedWater: 0,
                score: 0,
            },
        });
    }

    console.log('Seeding candidates (Teams & Digimers)...');
    await prisma.candidate.createMany({
        data: [
            // Teams
            { id: 't1', name: 'Tech Wizards', division: 'Technology & Operation', type: 'team', imageUrl: '' },
            { id: 't2', name: 'Design Masters', division: 'Content Design', type: 'team', imageUrl: '' },
            { id: 't3', name: 'Support Heroes', division: 'Customer Support', type: 'team', imageUrl: '' },
            // Individual Digimers (Sampling from real employees)
            { id: 'd1', name: 'Muhammad Rizky Husain', division: 'Software Engineering & QA', type: 'digimer', imageUrl: '' },
            { id: 'd2', name: 'Hanafiah Yunan Putri', division: 'Content Design', type: 'digimer', imageUrl: '' },
            { id: 'd3', name: 'Muhammad Hafizh Abdillah', division: 'Software Engineering & QA', type: 'digimer', imageUrl: '' },
        ]
    });

    console.log('Seeding trivia questions...');
    const questions = [
        // Q1 - Company founding year
        {
            index: 1,
            text: 'Digima ASIA berdiri pada tahun berapa? (Jangan jawab ngawur ya, hidup karir kamu di sini!)',
            options: JSON.stringify(['2012', '2014', '2016', '2020']),
            answer: 2,
        },
        // Q2 - Core business
        {
            index: 2,
            text: 'Apa "jualan utama" Digima ASIA yang bikin kita beda dari perusahaan lain?',
            options: JSON.stringify(['Jual kopi & snack kantor', 'Digital Learning & Certification', 'Buka warung nasi padang', 'Jasa bikin meme']),
            answer: 1,
        },
        // Q3 - HQ Location
        {
            index: 3,
            text: 'Di mana markas besar Digima ASIA berada? (Clue: bukan di bulan)',
            options: JSON.stringify(['Jakarta Selatan', 'Bandung', 'Gading Serpong, Tangerang', 'Bali (enak banget kalo iya)']),
            answer: 2,
        },
        // Q4 - Strategic partner
        {
            index: 4,
            text: 'Digima ASIA punya kolaborasi strategis dengan perusahaan mana yang merupakan bagian dari Salim Group?',
            options: JSON.stringify(['Indofood', 'Intikom', 'Indomobil', 'Indomaret']),
            answer: 1,
        },
        // Q5 - Vision/Tagline
        {
            index: 5,
            text: 'Apa tagline resmi Digima ASIA yang selalu kita banggakan?',
            options: JSON.stringify(['"We Make It Simple"', '"Integrated Digital Learning & Certification Ecosystem"', '"Just Do It"', '"Connecting People"']),
            answer: 1,
        },
        // Q6 - CEO
        {
            index: 6,
            text: 'Siapakah Global Chief Executive (a.k.a. Bos Besar) Digima ASIA?',
            options: JSON.stringify(['Karib Chiang', 'Dyah Prajnaparamita', 'Daniel V. Lie', 'Muhammad Hafizh Abdillah (ngimpi)']),
            answer: 2,
        },
        // Q7 - Core values (funny)
        {
            index: 7,
            text: 'Manakah yang BUKAN merupakan core value Digima ASIA?',
            options: JSON.stringify(['Collaboration', 'Integrity', 'Procrastination', 'Reliability']),
            answer: 2,
        },
        // Q8 - Event name
        {
            index: 8,
            text: 'Event perusahaan tahunan kita yang kamu lagi ikuti sekarang namanya apa?',
            options: JSON.stringify(['Digima Got Talent', 'X-Celerate the Tree', 'Digima\'s Got Talent', 'Annual Boring Meeting']),
            answer: 1,
        },
        // Q9 - Mission
        {
            index: 9,
            text: 'Misi utama Digima ASIA adalah menjadi pelopor di bidang apa?',
            options: JSON.stringify(['Kuliner Nusantara', 'Digital Innovation & Strategic Execution', 'E-sports & Gaming', 'Ekspor Singkong ke Eropa']),
            answer: 1,
        },
        // Q10 - Fun fact about anniversary
        {
            index: 10,
            text: 'DIGIMAVERSARY ke-10 ini artinya Digima ASIA sudah berumur berapa tahun?',
            options: JSON.stringify(['8 tahun', '9 tahun', '10 tahun', 'Tua banget sih']),
            answer: 2,
        },
    ];

    for (const q of questions) {
        await prisma.question.create({ data: q });
    }

    console.log('Seeding finished successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
