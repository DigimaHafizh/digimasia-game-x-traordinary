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

    // 2. Final Hardcoded Employees Mapping (Excel v2)
    const employees = [
        { name: "Agunahwan Absin", division: "Software Engineering & QA", pin: "1024" },
        { name: "Agung Trisno Atmojo", division: "Content Design", pin: "1013" },
        { name: "Alfridho Yuliananda", division: "Content Design", pin: "1007" },
        { name: "Amelia Nur Azizah", division: "Content Design", pin: "1010" },
        { name: "Andre Alfadjrid", division: "Content Design", pin: "1017" },
        { name: "Asep Badrudin", division: "Content Design", pin: "1015" },
        { name: "Candra Prasetyo", division: "Software Engineering & QA", pin: "1119" },
        { name: "Cherly Diansacharina Tri Wahyuningsuara", division: "Customer Support", pin: "1032" },
        { name: "Christover Ramanda Moa", division: "Software Engineering & QA", pin: "1026" },
        { name: "Daniel V. Lie", division: "Global Chief Executive", pin: "1001" },
        { name: "Danny Zainaldi", division: "Project Management", pin: "1036" },
        { name: "Dyah Prajnaparamita", division: "Technology & Operation", pin: "1003" },
        { name: "Fahmi Fikri Kurniawan", division: "Customer Support", pin: "1030" },
        { name: "Fredy Wijaya", division: "Content Design", pin: "1014" },
        { name: "Frista Diah Ramadhani", division: "Content Design", pin: "1009" },
        { name: "Hanafiah Yunan Putri", division: "Content Design", pin: "1019" },
        { name: "Hari Mujana", division: "Content Design", pin: "1018" },
        { name: "Heri Irwanto", division: "Interaction Design", pin: "1021" },
        { name: "Honey Fatricya", division: "Organization Support", pin: "1005" },
        { name: "Inayatul Noor Amaliah", division: "Content Design", pin: "1008" },
        { name: "Karib Chiang", division: "Technology & Operation", pin: "1002" },
        { name: "Mayang Gita", division: "Sales", pin: "1035" },
        { name: "Mediani Prima Ismary", division: "General Affairs", pin: "1034" },
        { name: "Muhammad Hafizh Abdillah", division: "Software Engineering & QA", pin: "1029" },
        { name: "Muhammad Reza", division: "Software Engineering & QA", pin: "1025" },
        { name: "Muhammad Rizky Husain", division: "Software Engineering & QA", pin: "1027" },
        { name: "Nabila Paradays", division: "Content Design", pin: "1011" },
        { name: "Putra Indra Tri Cahya", division: "Customer Support", pin: "1031" },
        { name: "Ratna Indah Screenaningrum", division: "Content Design", pin: "1012" },
        { name: "Resfi Anggraeni", division: "General Affairs", pin: "1033" },
        { name: "Stefany Arlianty", division: "Content Design", pin: "1006" },
        { name: "Stepanus", division: "Interaction Design", pin: "1016" },
        { name: "Tedy Iman Priyo Lestanto", division: "Interaction Design", pin: "1022" },
        { name: "Vania Sari Muchardie", division: "Organization Support", pin: "1004" },
        { name: "Wahyu Candra Indhiarta", division: "Software Engineering & QA", pin: "1028" },
        { name: "Yusuf Faisal Agus Saputro", division: "Software Engineering & QA", pin: "1023" },
    ];

    console.log(`Seeding ${employees.length} users...`);
    for (const emp of employees) {
        await prisma.user.upsert({
            where: { pin: emp.pin },
            update: {
                name: emp.name,
                division: emp.division,
            },
            create: {
                name: emp.name,
                pin: emp.pin,
                division: emp.division,
                isAdmin: false,
                isJoined: false,
            },
        });
    }

    // 3. Clear and Create Candidates (taken out dummy data)
    console.log('Clearing old candidates and votes...');
    await prisma.vote.deleteMany({});
    await prisma.candidate.deleteMany({});

    console.log('Seeding real candidates...');
    await prisma.candidate.createMany({
        data: [
            // Team of the Year (TOTY)
            { id: 'toty-se-qa', name: 'Software Engineering & QA', division: 'TECH', type: 'team', imageUrl: '/assets/candidates/TOTY_SE & QA.png' },
            { id: 'toty-cd', name: 'Content Design', division: 'CD', type: 'team', imageUrl: '/assets/candidates/TOTY_CD.png' },
            { id: 'toty-sales-pm', name: 'Project Management & Sales', division: 'SALES', type: 'team', imageUrl: '/assets/candidates/TOTY_Sales & PM.png' },
            { id: 'toty-ix', name: 'Interaction Design', division: 'DESIGN', type: 'team', imageUrl: '/assets/candidates/TOTY_IX.png' },
            { id: 'toty-cs', name: 'Customer Support', division: 'CS', type: 'team', imageUrl: '/assets/candidates/TOTY_CS.png' },
            { id: 'toty-ga-os', name: 'General Affairs & Organization Support', division: 'GA', type: 'team', imageUrl: '/assets/candidates/TOTY_GA & OS.png' },

            // Digimer of the Year (DOTY)
            { id: 'doty-rizky', name: 'Muhammad Rizky Husain', division: 'Software Engineering & QA', type: 'digimer', imageUrl: '/assets/candidates/DOTY_Rizky.png' },
            { id: 'doty-stepanus', name: 'Stepanus', division: 'Interaction Design', type: 'digimer', imageUrl: '/assets/candidates/DOTY_Stepanus.png' },
            { id: 'doty-honey', name: 'Honey Fatricya', division: 'Organization Support', type: 'digimer', imageUrl: '/assets/candidates/DOTY_Honey.png' },
        ]
    });

    // 4. Create Trivia Questions
    console.log('Seeding trivia questions...');
    const questions = [
        {
            index: 1,
            text: 'Kapan tanggal bulan dan tahun tepatnya ulang tahun digima ASIA?',
            options: JSON.stringify(['14 Juni 2016', '19 Juni 2016', '25 Juni 2016', '26 Juni 2016']),
            answer: 0
        },
        {
            index: 2,
            text: 'Huruf “A” pada HEART sebagai core values digima ASIA mewakili…',
            options: JSON.stringify(['Achievement', 'Accelerated Growth', 'Adaptability', 'Accountability']),
            answer: 1
        },
        {
            index: 3,
            text: 'Apa filosofi di balik penulisan “digima ASIA”?',
            options: JSON.stringify([
                'digima dengan huruf kecil melambangkan sikap humble dan ASIA dengan huruf kapital mencerminkan visi untuk dikenal di tingkat Asia',
                'Saat mau membuat logo, ukuran huruf digima tidak sengaja lebih kecil dan akhirnya diteruskan sampai sekarang',
                'Penulisan ASIA dengan kapital menjadi reminder bahwa mimpi perusahaan lebih besar dari apapun',
                'Semua jawaban salah'
            ]),
            answer: 0
        },
        {
            index: 4,
            text: 'digimer dengan stastus PKWT mendapatkan benefit untuk memilih hadiah ulang tahun, salah satunya hadiahnya yaitu...',
            options: JSON.stringify(['Voucher Makan Bakmi Koga', 'Makan Bergizi Gratis', '1 hari libur', 'Sepatu PUMA baru']),
            answer: 2
        },
        {
            index: 5,
            text: 'Apa kepanjangan dari MoLeaWiz?',
            options: JSON.stringify(['Mobile Learning Wizard', 'More Learning Wizards', 'Mobility Learning Wizard', 'Motivated Learners Wizards']),
            answer: 2
        },
        {
            index: 6,
            text: 'Jika sebuah perusahaan ingin meningkatkan kompetensi karyawannya dan datang ke digima ASIA, “paket andalan” apa yang bisa kita tawarkan?',
            options: JSON.stringify([
                'Seminar, Outing, Gathering',
                'LaaS, Learning Content Development, Strategic Execution & Implementation',
                'Podcast, Vlog, Webinar',
                'Laptop, Proyektor, Wi-Fi'
            ]),
            answer: 1
        },
        {
            index: 7,
            text: 'Jika ada digimers yang selalu memperhatikan kualitas, detail, dan hasil terbaik dalam pekerjaannya, ia sedang menerapkan nilai…',
            options: JSON.stringify(['Harmony', 'Excellence', 'Teamwork', 'Accelerated Growth']),
            answer: 1
        },
        {
            index: 8,
            text: 'Mana yang paling membuat jantung digimers berdebar?',
            options: JSON.stringify(['Deadline hari ini', 'Meeting mendadak', 'Pesan “Boleh call sebentar?”', 'Semua benar']),
            answer: 3
        },
        {
            index: 9,
            text: 'Selama 10 tahun perjalanan digima ASIA, mana yang paling tidak berubah?',
            options: JSON.stringify(['Semangat untuk terus berkembang', 'Jumlah revisi project', 'Deadline yang selalu menarik', 'Kebutuhan akan kopi']),
            answer: 0
        },
        {
            index: 10,
            text: 'Tim manakah yang saat ini memiliki anggota terbanyak di digima ASIA?',
            options: JSON.stringify(['HR', 'CD', 'CS', 'SE']),
            answer: 1
        },
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
