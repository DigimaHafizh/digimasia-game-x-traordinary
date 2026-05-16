/**
 * 📸 X-Celerate COMPREHENSIVE UI Capture Script v2
 * ===============================================
 * Jalankan: node capture-ui-gallery-v2.js
 * 
 * Script ini mengiterasi SEMUA fase game dan mengcapture:
 * 1. Admin View
 * 2. Participant View
 * 3. Monitor View
 * 4. Interactive Reveal States (Winner Announcer)
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://digimasia-game-x-traordinary-fronte.vercel.app';
const BACKEND_URL = 'https://backend-production-51da.up.railway.app';
const PARTICIPANT_PIN = '1001';

const OUTPUT_DIR = path.join(__dirname, 'ui-screenshots-v2');
const GALLERY_HTML = path.join(__dirname, 'ui_gallery_complete.html');

const PHASES = ['LOGIN', 'VOTING_TEAM', 'VOTING_DIGIMER', 'TRIVIA', 'WATERING'];

async function main() {
    console.log('\n🚀 X-Celerate COMPREHENSIVE UI Capture Script\n');

    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--window-size=1920,1080'],
        defaultViewport: { width: 1920, height: 1080 }
    });

    const adminPage = await browser.newPage();
    const monitorPage = await browser.newPage();
    const userPage = await browser.newPage();

    const captureState = async (phaseName, stateLabel) => {
        console.log(`📸 Capturing Phase: ${phaseName} - ${stateLabel}`);

        let suffix = `${phaseName.toLowerCase()}_${stateLabel.toLowerCase().replace(/ /g, '_')}`;

        await adminPage.bringToFront();
        await adminPage.screenshot({ path: path.join(OUTPUT_DIR, `admin_${suffix}.png`) });

        await userPage.bringToFront();
        await userPage.screenshot({ path: path.join(OUTPUT_DIR, `user_${suffix}.png`) });

        await monitorPage.bringToFront();
        // Determine which monitor to show
        let monitorUrl = `${BASE_URL}/monitoring/voting`;
        if (phaseName === 'TRIVIA') monitorUrl = `${BASE_URL}/monitoring/trivia`;
        if (phaseName === 'WATERING') monitorUrl = `${BASE_URL}/leaderboard`;

        if (monitorPage.url() !== monitorUrl) {
            await monitorPage.goto(monitorUrl, { waitUntil: 'networkidle2' });
        }
        await monitorPage.screenshot({ path: path.join(OUTPUT_DIR, `monitor_${suffix}.png`) });
    };

    // 1. Initial Setup
    console.log('--- Initial Setup ---');
    await adminPage.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle2' });
    await userPage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    await userPage.type('input', PARTICIPANT_PIN);
    await userPage.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000));

    // 2. Iterate through Phases
    for (const p of PHASES) {
        console.log(`--- Switching to Phase: ${p} ---`);

        // Trigger Phase Change in Admin
        await adminPage.bringToFront();
        await adminPage.evaluate(async (targetPhase, api) => {
            await fetch(`${api}/admin/phase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phase: targetPhase }),
            });
        }, p, BACKEND_URL);

        await new Promise(r => setTimeout(r, 3000)); // Wait for sync
        await captureState(p, 'Normal');
    }

    // 3. Capture Detailed Reveal Features
    console.log('--- Capturing Reveal Features ---');
    await monitorPage.goto(`${BASE_URL}/monitoring/results`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    const clickReveal = async (btnPrefix) => {
        const buttons = await monitorPage.$$('button');
        for (const btn of buttons) {
            const text = await btn.evaluate(b => b.textContent);
            if (text.includes(btnPrefix)) {
                await btn.click();
                return true;
            }
        }
        return false;
    };

    // Step A: Reveal Finalists
    await monitorPage.screenshot({ path: path.join(OUTPUT_DIR, `reveal_step1_initial.png`) });
    await clickReveal('REVEAL FINALISTS');
    await new Promise(r => setTimeout(r, 1000));
    await monitorPage.screenshot({ path: path.join(OUTPUT_DIR, `reveal_step2_finalists.png`) });

    // Step B: Show Live Monitoring
    await clickReveal('MONITOR LIVE VOTES');
    await new Promise(r => setTimeout(r, 1000));
    await monitorPage.screenshot({ path: path.join(OUTPUT_DIR, `reveal_step3_stats.png`) });

    // Step C: Reveal Winner
    await clickReveal('REVEAL THE WINNER');
    await new Promise(r => setTimeout(r, 4000)); // Wait for confetti
    await monitorPage.screenshot({ path: path.join(OUTPUT_DIR, `reveal_step4_winner.png`) });

    await browser.close();
    console.log('--- Generating Gallery ---');
    generateFinalGallery();
}

function generateFinalGallery() {
    const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.png'));
    const imgToBase64 = (f) => `data:image/png;base64,${fs.readFileSync(path.join(OUTPUT_DIR, f)).toString('base64')}`;

    let html = `
    <html>
    <head>
        <style>
            body { font-family: sans-serif; background: #f0f2f5; padding: 40px; }
            .section { background: white; padding: 30px; border-radius: 15px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #1e293b; text-align: center; }
            h2 { color: #0EA5E9; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; }
            .card { text-align: center; }
            .card p { font-weight: bold; color: #64748b; margin-top: 10px; }
            img { width: 100%; border-radius: 10px; border: 1px solid #ddd; }
            .page-break { page-break-after: always; }
        </style>
    </head>
    <body>
        <h1>X-Celerate COMPLETE UI Documentation</h1>
        <p style="text-align:center">Semua Fase & Fitur Interactive Ter-capture Terperinci</p>
    `;

    const phaseGroups = {};
    files.forEach(f => {
        if (f.startsWith('reveal')) {
            if (!phaseGroups['REVEAL_FEATURES']) phaseGroups['REVEAL_FEATURES'] = [];
            phaseGroups['REVEAL_FEATURES'].push(f);
        } else {
            const phase = f.split('_')[1].toUpperCase();
            if (!phaseGroups[phase]) phaseGroups[phase] = [];
            phaseGroups[phase].push(f);
        }
    });

    Object.keys(phaseGroups).forEach(phase => {
        html += `<div class="section"><h2>FASE: ${phase}</h2><div class="grid">`;
        phaseGroups[phase].forEach(f => {
            html += `<div class="card"><img src="${imgToBase64(f)}"><p>${f}</p></div>`;
        });
        html += `</div></div><div class="page-break"></div>`;
    });

    html += `</body></html>`;
    fs.writeFileSync(GALLERY_HTML, html);
    console.log(`✅ COMPLETE! Buka: ${GALLERY_HTML}`);
}

main().catch(console.error);
