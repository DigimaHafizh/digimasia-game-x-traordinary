/**
 * 📸 X-Celerate UI Gallery Capture Script
 * =========================================
 * Jalankan: node capture-ui-gallery.js
 * 
 * Script ini akan membuka browser 1920x1080, screenshot semua halaman,
 * lalu otomatis embed hasilnya ke file ui_gallery.html yang sudah ada.
 * 
 * Prasyarat: npm install puppeteer
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://digimasia-game-x-traordinary-fronte.vercel.app';
const PARTICIPANT_PIN = '1001';

// ⚙️ Konfigurasi Halaman yang Akan Di-screenshot
const PAGES = [
    { name: 'login', label: 'Halaman Login', url: `${BASE_URL}/`, waitFor: 2000, requiresLogin: false },
    { name: 'participant_dashboard', label: 'Dashboard Peserta (Waiting)', url: null, waitFor: 2000, requiresLogin: true },
    { name: 'admin_dashboard', label: 'Admin Control Center', url: `${BASE_URL}/admin`, waitFor: 3000, requiresLogin: false },
    { name: 'admin_qr_modal', label: 'Admin QR Login Modal', url: `${BASE_URL}/admin`, waitFor: 3000, requiresLogin: false, action: 'openQRModal' },
    { name: 'monitoring_voting', label: 'Monitor Voting (Projector)', url: `${BASE_URL}/monitoring/voting`, waitFor: 3000, requiresLogin: false },
    { name: 'monitoring_trivia', label: 'Monitor Trivia (Projector)', url: `${BASE_URL}/monitoring/trivia`, waitFor: 3000, requiresLogin: false },
    { name: 'monitoring_results', label: 'Result Reveal (Projector)', url: `${BASE_URL}/monitoring/results`, waitFor: 3000, requiresLogin: false },
    { name: 'leaderboard', label: 'Leaderboard Final', url: `${BASE_URL}/leaderboard`, waitFor: 3000, requiresLogin: false },
];

const OUTPUT_DIR = path.join(__dirname, 'ui-screenshots');
const GALLERY_HTML = path.join(__dirname, 'ui_gallery_full.html');

async function main() {
    console.log('\n🚀 X-Celerate UI Gallery Capture Script\n');

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const browser = await puppeteer.launch({
        headless: false,  // Set true untuk berjalan di background
        args: ['--window-size=1920,1080'],
        defaultViewport: { width: 1920, height: 1080 }
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    const capturedFiles = {};

    for (const pageConfig of PAGES) {
        try {
            console.log(`📸 Capturing: ${pageConfig.label}...`);

            if (pageConfig.requiresLogin) {
                // Login dulu, lalu screenshot dashboard
                await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
                await page.waitForSelector('input', { timeout: 10000 });
                await page.click('input[type="password"], input[type="text"], input[type="tel"]');
                await page.type('input[type="password"], input[type="text"], input[type="tel"]', PARTICIPANT_PIN);
                await page.keyboard.press('Enter');
                await new Promise(r => setTimeout(r, pageConfig.waitFor));

            } else if (pageConfig.action === 'openQRModal') {
                await page.goto(pageConfig.url, { waitUntil: 'networkidle2' });
                await new Promise(r => setTimeout(r, 2000));
                // Cari dan klik tombol QR LOGIN
                const buttons = await page.$$('button');
                for (const btn of buttons) {
                    const text = await btn.evaluate(b => b.textContent);
                    if (text.includes('QR') || text.includes('LOGIN')) {
                        await btn.click();
                        break;
                    }
                }
                await new Promise(r => setTimeout(r, pageConfig.waitFor));
            } else {
                await page.goto(pageConfig.url, { waitUntil: 'networkidle2' });
                await new Promise(r => setTimeout(r, pageConfig.waitFor));
            }

            const screenshotPath = path.join(OUTPUT_DIR, `${pageConfig.name}.png`);
            await page.screenshot({ path: screenshotPath, fullPage: true });
            capturedFiles[pageConfig.name] = { path: screenshotPath, label: pageConfig.label };
            console.log(`   ✅ Saved: ${screenshotPath}`);

        } catch (err) {
            console.error(`   ❌ Failed: ${pageConfig.label} - ${err.message}`);
        }
    }

    await browser.close();
    console.log('\n🎨 Generating UI Gallery HTML...');
    generateHtml(capturedFiles);
    console.log(`\n✅ Done! Buka file ini: ${GALLERY_HTML}`);
    console.log('   Tekan Ctrl+P di browser → Save as PDF\n');
}

function generateHtml(capturedFiles) {
    const imgToBase64 = (filePath) => {
        if (!fs.existsSync(filePath)) return '';
        const data = fs.readFileSync(filePath);
        return `data:image/png;base64,${data.toString('base64')}`;
    };

    const sections = [
        { title: '1. Alur Peserta (Participant Flow)', pages: ['login', 'participant_dashboard'] },
        { title: '2. Panel Admin (Control Center)', pages: ['admin_dashboard', 'admin_qr_modal'] },
        { title: '3. Layar Monitoring (Projector)', pages: ['monitoring_voting', 'monitoring_trivia', 'monitoring_results'] },
        { title: '4. Hasil Akhir', pages: ['leaderboard'] },
    ];

    let screenshotHtml = '';
    for (const section of sections) {
        screenshotHtml += `<h2>${section.title}</h2>`;
        for (const pageName of section.pages) {
            const info = capturedFiles[pageName];
            if (!info) continue;
            const base64 = imgToBase64(info.path);
            screenshotHtml += `
                <div class="screenshot-box">
                    <h3>${info.label}</h3>
                    <img src="${base64}" alt="${info.label}">
                </div>
            `;
        }
        screenshotHtml += '<div class="page-break"></div>';
    }

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UI Gallery - X-Celerate The Tree v2.0</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 1200px; margin: 0 auto; padding: 40px; background: #f4f7f6; }
        .container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h1 { color: #0EA5E9; text-align: center; font-size: 2.5em; margin-bottom: 5px; }
        h2 { border-bottom: 3px solid #0EA5E9; padding-bottom: 10px; margin-top: 50px; color: #1e293b; font-size: 1.5em; }
        h3 { color: #334155; margin-bottom: 8px; }
        .screenshot-box { margin-bottom: 50px; text-align: center; }
        img { max-width: 100%; height: auto; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.12); }
        .badge { background: #0EA5E9; color: white; padding: 4px 12px; border-radius: 99px; font-size: 0.75em; display: inline-block; margin-bottom: 10px; }
        .tip { background: #f0f9ff; border-left: 5px solid #0EA5E9; padding: 15px; margin: 30px 0; border-radius: 4px; }
        .analysis { background: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 8px; margin-top: 20px; }
        .analysis li { margin-bottom: 12px; }
        @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; max-width: 100%; border-radius: 0; }
            .page-break { page-break-before: always; }
        }
    </style>
</head>
<body>
<div class="container">
    <h1>X-Celerate the Tree</h1>
    <p style="text-align:center; color:#64748b; font-size:0.9em; letter-spacing:2px;">📋 UI GALLERY & REDESIGN REFERENCE — v2.0</p>

    <div class="tip">
        💡 <strong>Export ke PDF:</strong> Buka file ini di browser, tekan <strong>Ctrl+P</strong>, pilih <strong>Save as PDF</strong>. Semua gambar sudah ter-embed, jadi tidak perlu koneksi internet.
    </div>

    ${screenshotHtml}

    <div class="page-break"></div>
    <div class="analysis">
        <h2>🧐 Analisa & Rekomendasi Redesign</h2>
        <ul>
            <li><strong>🎨 Color Identity per Fase:</strong> Saat ini semua halaman menggunakan palet biru-slate yang seragam. Untuk redesign, terapkan warna yang berbeda per fase: Biru untuk Login, Ungu untuk Voting, Kuning untuk Trivia, Hijau untuk Watering.</li>
            <li><strong>✨ Micro-Animations:</strong> Tambahkan animasi transisi antar fase menggunakan <code>framer-motion</code> (fade-in, slide-up) agar perpindahan halaman terasa lebih dramatis.</li>
            <li><strong>🏆 Gamifikasi Leaderboard:</strong> Tambahkan efek partikel/confetti pada layar Leaderboard saat acara selesai untuk meningkatkan kesan 'perayaan'.</li>
            <li><strong>📺 Monitor Optimisasi:</strong> Layar Monitoring (Projector) sudah fullscreen. Pertimbangkan menambahkan animasi progress bar real-time dan jumlah voters yang bergerak (counter animation).</li>
        </ul>
    </div>
</div>
</body>
</html>`;

    fs.writeFileSync(GALLERY_HTML, html, 'utf8');
}

main().catch(console.error);
