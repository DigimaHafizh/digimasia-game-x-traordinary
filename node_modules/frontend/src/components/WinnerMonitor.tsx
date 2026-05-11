'use client';

import { useState, useEffect } from 'react';
import styles from '../app/page.module.css';
import { getBackendUrl } from '@/lib/config';

interface WinnerStats {
    name: string;
    count: number;
}

export default function WinnerMonitor() {
    const [teamWinner, setTeamWinner] = useState<WinnerStats | null>(null);
    const [digimerWinner, setDigimerWinner] = useState<WinnerStats | null>(null);

    const fetchWinners = async () => {
        try {
            const [resT, resD] = await Promise.all([
                fetch(`${getBackendUrl()}/votes/results?category=team`),
                fetch(`${getBackendUrl()}/votes/results?category=digimer`)
            ]);
            setTeamWinner(await resT.json());
            setDigimerWinner(await resD.json());
        } catch (err) {
            console.error('Failed to fetch winner monitor');
        }
    };

    useEffect(() => {
        fetchWinners();
        const interval = setInterval(fetchWinners, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass" style={{ padding: '1.2rem', borderLeft: '4px solid gold' }}>
                <p style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.3rem' }}>Leading: Best Team Overall</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{teamWinner?.name || 'Loading...'}</h4>
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{teamWinner?.count || 0} Votes</span>
                </div>
            </div>

            <div className="glass" style={{ padding: '1.2rem', borderLeft: '4px solid #00d2ff' }}>
                <p style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.3rem' }}>Leading: Digimer of the Year</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{digimerWinner?.name || 'Loading...'}</h4>
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{digimerWinner?.count || 0} Votes</span>
                </div>
            </div>
        </div>
    );
}
