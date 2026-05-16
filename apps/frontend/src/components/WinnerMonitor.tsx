'use client';

import { useState, useEffect } from 'react';
import { getBackendUrl } from '@/lib/config';

interface WinnerStats { name: string; count: number; }

const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

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
        } catch (err) { console.error('Failed to fetch winner monitor'); }
    };

    useEffect(() => {
        fetchWinners();
        const interval = setInterval(fetchWinners, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            {/* Team winner */}
            <div className="card" style={{ borderLeft: '6px solid var(--yellow)', padding: '14px 16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', letterSpacing: '1px', marginBottom: '4px' }}>
                    LEADING · BEST TEAM OVERALL
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="cand-avatar" style={{ background: 'var(--orange)', width: '36px', height: '36px', fontSize: '14px' }}>
                            {teamWinner?.name ? getInitials(teamWinner.name) : '?'}
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '1px' }}>
                            {teamWinner?.name || 'No votes yet'}
                        </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--orange)' }}>
                        {teamWinner?.count ?? 0}
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', marginLeft: '4px' }}>VOTES</span>
                    </div>
                </div>
            </div>

            {/* Digimer winner */}
            <div className="card" style={{ borderLeft: '6px solid var(--blue-bright)', padding: '14px 16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', letterSpacing: '1px', marginBottom: '4px' }}>
                    LEADING · DIGIMER OF THE YEAR
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="cand-avatar" style={{ background: 'var(--blue-bright)', width: '36px', height: '36px', fontSize: '14px' }}>
                            {digimerWinner?.name ? getInitials(digimerWinner.name) : '?'}
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '1px' }}>
                            {digimerWinner?.name || 'No votes yet'}
                        </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--blue-bright)' }}>
                        {digimerWinner?.count ?? 0}
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', marginLeft: '4px' }}>VOTES</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
