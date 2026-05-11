const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'app', 'admin', 'page.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Add import QRCode
if (!content.includes('import QRCode')) {
    content = content.replace("import { useGameStore } from '@/store/useGameStore';", "import { useGameStore } from '@/store/useGameStore';\nimport QRCode from 'react-qr-code';");
}

// 2. Add states + fetch
if (!content.includes('const [showQRModal')) {
    const statesToAdd = `\n    const [showQRModal, setShowQRModal] = useState(false);\n    const [localIp, setLocalIp] = useState('');\n\n    useEffect(() => {\n        fetch('/api/ip').then(res => res.json()).then(data => setLocalIp(data.ip)).catch(console.error);\n    }, []);\n`;
    content = content.replace("const [showWinnerReveal, setShowWinnerReveal] = useState(false);", "const [showWinnerReveal, setShowWinnerReveal] = useState(false);" + statesToAdd);
}

// 3. Add QR Button
if (!content.includes('TAMPILKAN QR')) {
    const buttonHtml = `\n                    <div style={{ display: 'flex', gap: '1rem' }}>\n                        <button onClick={() => setShowQRModal(true)} style={{ background: 'var(--primary)', color: 'white', padding: '1rem 2rem', borderRadius: '1.2rem', border: 'none', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(0, 210, 255, 0.2)' }}>\n                            📱 TAMPILKAN QR\n                        </button>\n                        <button onClick={handleReset} style={{ background: '#ef4444', color: 'white', padding: '1rem 2rem', borderRadius: '1.2rem', border: 'none', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)' }}>\n                            RESET SYSTEM\n                        </button>\n                    </div>`;
    content = content.replace(/<button onClick={handleReset}[^>]*>[\s\S]*?RESET SYSTEM[\s\S]*?<\/button>/, buttonHtml);
}

// 4. Add Modal
if (!content.includes('Scan QR Code ini untuk bergabung')) {
    const modalHtml = `\n            {/* QR Code Modal for Users */}\n            {showQRModal && (\n                <div style={{\n                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',\n                    background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)'\n                }} onClick={() => setShowQRModal(false)}>\n                    <div className="glass" style={{ padding: '4rem', borderRadius: '3rem', textAlign: 'center', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>\n                        <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Scan QR Code</h2>\n                        <p style={{ opacity: 0.7, marginBottom: '2rem' }}>Scan QR Code ini untuk bergabung dari Smartphone Android atau iOS.</p>\n                        \n                        <div style={{ background: 'white', padding: '2rem', borderRadius: '2rem', display: 'inline-block', boxShadow: '0 0 50px rgba(0, 210, 255, 0.3)' }}>\n                            <QRCode value={\`http://\${localIp || 'localhost'}:3000\`} size={256} fgColor="#0f172a" />\n                        </div>\n                        \n                        <div style={{ marginTop: '2rem' }}>\n                            <p style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '1px' }}>\n                                http://{localIp || 'localhost'}:3000\n                            </p>\n                            <p style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '0.5rem' }}>* Pastikan terhubung di jaringan Wi-Fi yang sama dengan perangkat ini.</p>\n                        </div>\n                        \n                        <button className="btn-primary" style={{ marginTop: '2.5rem', padding: '1rem 3rem', borderRadius: '2rem', fontSize: '1rem', width: '100%' }} onClick={() => setShowQRModal(false)}>\n                            TUTUP\n                        </button>\n                    </div>\n                </div>\n            )}\n        </main>\n    );\n}\n`;
    content = content.replace(/<\/main>\s*<\/div>\s*\)\;\s*\}\s*$/m, ''); // remove the bottom part
    // Actually the ending is:
    //             </section>
    //         </div>
    //     </main>
    // );
    // }
    content = content.replace(/<\/main>[\s\S]*\}\s*$/, modalHtml);
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Admin Page QR Updated');
