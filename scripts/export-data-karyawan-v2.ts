import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();

async function exportToExcel() {
    console.log('Fetching employees from database...');
    const users = await prisma.user.findMany({
        where: { isAdmin: false },
        orderBy: { name: 'asc' },
    });

    const data = users.map((user) => ({
        'Nama Karyawan': user.name,
        'Division': user.division,
        'PIN Access': user.pin,
        'Role': user.isAdmin ? 'Admin' : 'Employee',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data PIN Karyawan');

    // Customize column widths
    const wscols = [
        { wch: 40 }, // Nama Karyawan
        { wch: 30 }, // Division
        { wch: 15 }, // PIN Access
        { wch: 15 }, // Role
    ];
    worksheet['!cols'] = wscols;

    const fileName = 'Data_PIN_Karyawan_Digimasia_v2.xlsx';
    const filePath = path.resolve(__dirname, '..', 'docs', 'archive', fileName);

    XLSX.writeFile(workbook, filePath);
    console.log(`Successfully exported to ${filePath}`);
}

exportToExcel()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
