'use client';

import { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { getBackendUrl } from '@/lib/config';

interface LeaderboardEntry {
    name: string;
    division: string;
    amount: number;
}

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch(`${getBackendUrl()}/leaderboard`);
                const data = await res.json();
                setLeaderboard(data);
            } catch (err) {
                console.error('Failed to fetch leaderboard');
            }
        };

        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    return (
        <main className={styles.main} style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>
            <div className={styles.leaderboardWrapper}>
                <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>TOP CONTRIBUTORS</h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.7, letterSpacing: '2px' }}>X-TRAORDINARY — GROW WITH HEART : LIVE MONITORING</p>
                </header>

                <div className={styles.leadTableGlass}>
                    <div className={styles.leadHeaderRow}>
                        <span>RANK</span>
                        <span>NAME</span>
                        <span>DIVISION</span>
                        <span style={{ textAlign: 'right' }}>WATER CONTRIBUTED</span>
                    </div>

                    <div className={styles.leadBody}>
                        {leaderboard.map((entry, i) => (
                            <div key={i} className={`${styles.leadRow} ${i < 3 ? styles['top' + (i + 1)] : ''}`}>
                                <span className={styles.leadRank}>#{i + 1}</span>
                                <span className={styles.leadName}>{entry.name}</span>
                                <span className={styles.leadDiv}>{entry.division}</span>
                                <span className={styles.leadAmount}>{entry.amount} L</span>
                            </div>
                        ))}
                        {leaderboard.length === 0 && <p style={{ textAlign: 'center', padding: '2rem' }}>Menunggu data peserta...</p>}
                    </div>
                </div>

                <footer style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.5 }}>
                    <div className="pulse-dot" style={{ display: 'inline-block', marginRight: '0.5rem' }}></div>
                    LIVE UPDATING EVERY 5 SECONDS
                </footer>
            </div>
        </main>
    );
}
