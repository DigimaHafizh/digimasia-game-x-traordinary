'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useSocket } from '@/hooks/useSocket';
import styles from './page.module.css';
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
                console.warn('Tree: No user ID found in store');
                setIsSyncing(false);
                return;
            }

            console.log(`Tree: Syncing stats for user ${user.id}`);
            try {
                const res = await fetch(`${getBackendUrl()}/users/${user.id}/stats`);
                if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

                const data = await res.json();
                console.log('Tree: Received stats:', data);

                if (data) {
                    setUserState({
                        collectedWater: data.collectedWater ?? 0,
                        contributedWater: data.contributedWater ?? 0,
                        // Update local score too if needed
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

        // Decrement local score, emit to server
        setUserState({
            collectedWater: Math.max(0, collectedWater - 1),
            contributedWater: contributedWater + 1
        });

        emitWaterTap();
    };

    if (isSyncing) return <div className={styles.main}><h3>Menyiapkan Peralatan...</h3></div>;
    if (!user) return <div className={styles.main}><h3>Silakan Login Kembali</h3></div>;

    // Threshold untuk pohon (placeholder 1000 water for max growth)
    const progress = Math.min(100, (totalWater / 1000) * 100);

    return (
        <div className={styles.treeWrapper}>
            <header style={{ textAlign: 'center' }}>
                <h2 className="gradient-text" style={{ fontSize: '2rem' }}>GROW THE TREE</h2>
                <p style={{ opacity: 0.7 }}>Tap untuk menyumbang air bagi pertumbuhan pohon kita!</p>
            </header>

            <div className={styles.treeContainer}>
                <div style={{ width: '250px', height: '250px', marginBottom: '2rem' }}>
                    <TreeVisual stage={treeStage} />
                </div>

                <div className={styles.waterTank}>
                    <div className={styles.tankFill} style={{ height: `${progress}%` }}></div>
                    <div className={styles.tankText} style={{ color: treeStage >= 4 ? 'gold' : 'white' }}>
                        {totalWater} / 1000 L
                    </div>
                </div>
                {treeStage >= 4 && (
                    <div style={{ position: 'absolute', top: '-1rem', background: 'gold', color: 'black', padding: '0.2rem 1rem', borderRadius: '1rem', fontWeight: 800, fontSize: '0.8rem', zIndex: 10 }}>
                        MAKSIMAL! 🎆
                    </div>
                )}
            </div>

            <footer className={styles.actionFooter}>
                <div className={styles.userInfoMini}>
                    <p>Air Tersedia: <strong>{collectedWater} L</strong></p>
                    <p>Kontribusi Anda: <strong>{contributedWater} L</strong></p>
                </div>

                <button
                    className={`btn-primary ${styles.tapBtn} ${collectedWater <= 0 ? styles.disabled : ''}`}
                    onClick={handleTap}
                    disabled={collectedWater <= 0}
                >
                    {collectedWater > 0 ? 'TAP UNTUK SIRAM! 💧' : 'AIR HABIS'}
                </button>
            </footer>
        </div>
    );
}
