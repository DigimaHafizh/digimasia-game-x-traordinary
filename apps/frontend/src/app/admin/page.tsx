'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import QRCode from 'react-qr-code';
import styles from '../page.module.css';
import LeaderboardWidget from '@/components/LeaderboardWidget';
import TriviaMonitor from '@/components/TriviaMonitor';
import WinnerAnnouncer from '@/components/WinnerAnnouncer';
import NomineeMonitor from '@/components/NomineeMonitor';
import TreeMonitor from '@/components/TreeMonitor';
import { useSocket } from '@/hooks/useSocket';
import { getBackendUrl } from '@/lib/config';

export default function AdminPage() {
    const { phase, setSessionState, currentQuestion, totalWater, treeStage } = useGameStore();
    const [showWinnerReveal, setShowWinnerReveal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [origin, setOrigin] = useState('');

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    // Global Socket Sync
    useSocket();

    const handlePhaseChange = async (newPhase: string) => {
        setShowWinnerReveal(false);
        try {
            await fetch(`${getBackendUrl()}/admin/phase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phase: newPhase }),
            });
            setSessionState({ phase: newPhase as any });
        } catch (err) {
            alert('Gagal update fase');
        }
    };

    const handleStartTrivia = async () => {
        try {
            await fetch(`${getBackendUrl()}/admin/start-trivia`, {
                method: 'POST',
            });
            setSessionState({ phase: 'TRIVIA' });
        } catch (err) {
            alert('Gagal start trivia');
        }
    };

    const handleReset = async () => {
        if (!confirm('RESET SYSTEM? Suara, jawaban, dan poin akan nol kembali. DATA USER TETAP AMAN.')) return;
        try {
            await fetch(`${getBackendUrl()}/admin/reset`, { method: 'POST' });
            alert('System reset successfully!');
            window.location.reload();
        } catch (err) {
            alert('Gagal reset system');
        }
    };

    const PhaseButton = ({ targetPhase, icon, label, description, action }: any) => (
        <button
            className={`${styles.phaseCard} ${phase === targetPhase ? styles.active : ''}`}
            onClick={action || (() => handlePhaseChange(targetPhase))}
        >
            <div className={styles.phaseIcon}>{icon}</div>
            <div className={styles.phaseInfo}>
                <span className={styles.phaseTitle}>{label}</span>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 500 }}>{description}</span>
            </div>
            {phase === targetPhase && <div className={styles.activeCheck}>●</div>}
        </button>
    );

    const MonitorButton = ({ url, label, color1, color2 }: any) => (
        <button
            className={styles.monitorActionBtn}
            style={{ background: `linear-gradient(45deg, ${color1}, ${color2})` }}
            onClick={() => window.open(url, '_blank')}
        >
            <span>{label}</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>↗</span>
        </button>
    );

    return (
        <main className={styles.main} style={{ background: '#0f172a' }}>
            <div className={styles.adminContainer}>
                {/* TOP HEADER */}
                <header className={styles.adminHeader} style={{ marginBottom: '3rem' }}>
                    <div>
                        <h1 className="gradient-text" style={{ fontSize: '2.8rem', margin: 0, fontWeight: 900 }}>Control Center</h1>
                        <p style={{ opacity: 0.5, letterSpacing: '3px', fontWeight: 700, fontSize: '0.7rem' }}>X-CELERATE THE TREE v2.0</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => setShowQRModal(true)} className={styles.utilBtnBlue}>
                            📱 QR LOGIN
                        </button>
                        <button onClick={handleReset} className={styles.utilBtnRed}>
                            🔄 RESET
                        </button>
                    </div>
                </header>

                <div className={styles.adminGrid}>
                    {/* LEFT PANEL: SEQUENCE CONTROL */}
                    <aside className={styles.adminSidebar}>
                        <div className={styles.panelHeader}>
                            <h3>SEQUENCE FLOW</h3>
                            <span className={styles.statusBadge}>STEP-BY-STEP</span>
                        </div>

                        <div className={styles.phaseList}>
                            <PhaseButton targetPhase="LOGIN" icon="🔑" label="OPEN REGISTRATION" description="Izinkan peserta masuk menggunakan PIN" />
                            <PhaseButton targetPhase="VOTING_TEAM" icon="👥" label="START TEAM VOTING" description="Voting kategori Best Team of the Year" />
                            <PhaseButton targetPhase="VOTING_DIGIMER" icon="🌟" label="START DIGIMER VOTING" description="Voting kategori Digimer of the Year" />
                            <PhaseButton targetPhase="TRIVIA" icon="🧠" label="START TRIVIA QUIZ" description="Sesi kuis interaktif 10 soal" action={handleStartTrivia} />
                            <PhaseButton targetPhase="WATERING" icon="🌳" label="GROW THE TREE" description="Mainkan game interaktif siram pohon" />
                        </div>

                        {/* DISPLAY TOOLS BOX */}
                        <div className={styles.displayPanel} style={{ marginTop: '3rem' }}>
                            <div className={styles.panelHeader}>
                                <h3>EXTERNAL MONITORS</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                                <MonitorButton url="/monitoring/voting" label="VOTING MONITOR" color1="#6366f1" color2="#a855f7" />
                                <MonitorButton url="/monitoring/trivia" label="TRIVIA MONITOR" color1="#ec4899" color2="#f43f5e" />
                                <MonitorButton url="/monitoring/results" label="RESULT REVEAL" color1="#eab308" color2="#f97316" />
                            </div>
                        </div>
                    </aside>

                    {/* MAIN PANEL: LIVE MONITORING */}
                    <section className={styles.adminContent}>
                        <div className={styles.monitorHeader}>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 900 }}>
                                {showWinnerReveal ? 'Final Results Mode' : `Live: ${phase.replace('_', ' ')}`}
                            </h2>
                            <div className={styles.statusLive}>
                                <div className={styles.liveDot}></div>
                                <span>LIVE DATA</span>
                            </div>
                        </div>

                        <div className={styles.monitorViewport}>
                            {showWinnerReveal ? (
                                <WinnerAnnouncer onClose={() => setShowWinnerReveal(false)} />
                            ) : (
                                <>
                                    {(phase === 'VOTING_TEAM' || phase === 'VOTING_DIGIMER') && (
                                        <NomineeMonitor category={phase === 'VOTING_TEAM' ? 'team' : 'digimer'} />
                                    )}
                                    {(phase === 'TRIVIA' || phase === 'TRANSITION') && (
                                        <TriviaMonitor />
                                    )}
                                    {phase === 'WATERING' && (
                                        <div style={{ animation: 'fadeIn 0.5s ease' }}>
                                            <TreeMonitor />
                                            <div style={{ marginTop: '2rem' }}>
                                                <h4 style={{ color: 'gold', marginBottom: '1rem' }}>Active Contributors</h4>
                                                <LeaderboardWidget />
                                            </div>
                                        </div>
                                    )}
                                    {phase === 'LOGIN' && (
                                        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔓</div>
                                            <h3>Registrasi Dibuka</h3>
                                            <p style={{ opacity: 0.5 }}>Silakan arahkan user untuk scan QR dan masukkan PIN mereka.</p>
                                            <div style={{ marginTop: '3rem' }}>
                                                <LeaderboardWidget />
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {/* QR MODAL */}
            {showQRModal && (
                <div className={styles.modalOverlay} onClick={() => setShowQRModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2 className="gradient-text" style={{ fontSize: '2.5rem' }}>User Portal QR</h2>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1.5rem', display: 'inline-block', marginTop: '1.5rem' }}>
                            <QRCode value={origin || 'https://digimasia-game-x-traordinary-fronte.vercel.app'} size={200} />
                        </div>
                        <p style={{ marginTop: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{origin || 'https://digimasia-game-x-traordinary-fronte.vercel.app'}</p>
                        <button className="btn-primary" style={{ marginTop: '2rem', width: '100%' }} onClick={() => setShowQRModal(false)}>
                            TUTUP
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
