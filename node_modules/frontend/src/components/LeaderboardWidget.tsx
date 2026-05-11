'use client';

import { useState, useEffect } from 'react';
import styles from '../app/page.module.css';
import { getBackendUrl } from '@/lib/config';

interface LeaderboardEntry {
    name: string;
    division: string;
    amount: number;
    score: number;
}

export default function LeaderboardWidget() {
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
        const interval = setInterval(fetchLeaderboard, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.leadTableGlass} style={{ borderRadius: '1rem', marginTop: '1rem' }}>
            <div className={styles.leadHeaderRow} style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', gridTemplateColumns: '40px 1fr 60px 60px' }}>
                <span>RANK</span>
                <span>NAME</span>
                <span style={{ textAlign: 'center' }}>WATER</span>
                <span style={{ textAlign: 'right' }}>SCORE</span>
            </div>

            <div className={styles.leadBody}>
                {leaderboard.map((entry, i) => (
                    <div key={i} className={styles.leadRow} style={{ padding: '0.8rem 1.5rem', gridTemplateColumns: '40px 1fr 60px 60px', alignItems: 'center' }}>
                        <span className={styles.leadRank} style={{ fontSize: '0.9rem' }}>#{i + 1}</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className={styles.leadName} style={{ fontSize: '0.86rem' }}>{entry.name}</span>
                            <span className={styles.leadDiv} style={{ fontSize: '0.7rem' }}>{entry.division}</span>
                        </div>
                        <span style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>{entry.amount}L</span>
                        <span style={{ textAlign: 'right', fontSize: '1rem', fontWeight: 700 }}>{entry.score}</span>
                    </div>
                ))}
                {leaderboard.length === 0 && <p style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem' }}>No data yet...</p>}
            </div>
        </div>
    );
}
