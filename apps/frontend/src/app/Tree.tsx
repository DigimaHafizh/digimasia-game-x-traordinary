'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useSocket } from '@/hooks/useSocket';
import TreeVisual from '@/components/TreeVisual';
import { getBackendUrl } from '@/lib/config';

export default function Tree() {
    const {
        user,
        treeStage,
        totalWater,
        collectedWater,
        contributedWater,
        setUserState
    } = useGameStore();

    const { emitWaterTap } = useSocket();
    const [isSyncing, setIsSyncing] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user?.id) {
                setIsSyncing(false);
                return;
            }

            try {
                const res = await fetch(`${getBackendUrl()}/users/${user.id}/stats`);
                if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

                const data = await res.json();
                if (data) {
                    setUserState({
                        collectedWater: data.collectedWater ?? 0,
                        contributedWater: data.contributedWater ?? 0,
                    } as any);
                }
            } catch (err) {
                console.error('Tree: Failed to sync water balance', err);
            } finally {
                setIsSyncing(false);
            }
        };

        fetchStats();
    }, [user?.id, setUserState]);

    const handleTap = () => {
        if (!user || collectedWater <= 0) return;
        setUserState({
            collectedWater: Math.max(0, collectedWater - 1),
            contributedWater: contributedWater + 1
        });
        emitWaterTap();
    };

    const progress = Math.min(100, (totalWater / 1000) * 100);
    const waterLevelPct = Math.min(100, (collectedWater / 100) * 100);

    if (isSyncing) return (
        <div style={{ minHeight: 'calc(100vh - 90px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ padding: '24px 40px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '2px' }}>MENYIAPKAN PERALATAN...</div>
            </div>
        </div>
    );

    return (
        <div style={{
            minHeight: 'calc(100vh - 90px)',
            padding: '24px',
            maxWidth: '480px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
        }}>
            {/* Title */}
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '42px',
                    letterSpacing: '3px',
                    color: 'var(--yellow)',
                    textShadow: '3px 3px 0px var(--black)',
                    lineHeight: 1,
                }}>
                    GROW THE TREE
                </div>
                <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--white)',
                    letterSpacing: '2px',
                    marginTop: '4px',
                }}>
                    TAP UNTUK MENYUMBANG AIR!
                </div>
            </div>

            {/* Tree Visual */}
            <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ width: '200px', height: '200px', margin: '0 auto 16px' }}>
                    <TreeVisual stage={treeStage} />
                </div>

                {/* Tree Progress */}
                <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: '#666',
                    letterSpacing: '1px',
                    marginTop: '4px',
                }}>
                    {Math.round(progress)}% → GRAND TREE · {totalWater} / 1000 L
                </div>
            </div>

            {/* Water Tank Widget */}
            <div className="water-tank">
                <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: '#666',
                    letterSpacing: '1px',
                    marginBottom: '4px',
                }}>
                    AIR TERSEDIA
                </div>
                <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '40px',
                    color: 'var(--blue-bright)',
                    lineHeight: 1,
                }}>
                    {collectedWater}L
                </div>
                <div className="water-level-wrap">
                    <div className="water-level" style={{ height: `${waterLevelPct}%` }}>
                        <div className="water-waves" />
                    </div>
                </div>
                <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: '#666',
                    letterSpacing: '1px',
                }}>
                    KONTRIBUSI KAMU: {contributedWater}L
                </div>
            </div>

            {/* Tap Button */}
            {treeStage >= 4 ? (
                <div className="card card-yellow" style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '2px' }}>
                        🌳 POHON SUDAH MAKSIMAL!
                    </div>
                </div>
            ) : (
                <button
                    className="btn btn-primary btn-full"
                    style={{
                        padding: '18px',
                        fontSize: '16px',
                        opacity: collectedWater <= 0 ? 0.5 : 1,
                    }}
                    onClick={handleTap}
                    disabled={collectedWater <= 0}
                >
                    {collectedWater > 0 ? '💧 TAP TO WATER!' : '💧 AIR HABIS'}
                </button>
            )}
        </div>
    );
}
