'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import styles from '../app/page.module.css';
import { getBackendUrl } from '@/lib/config';

interface TriviaStats {
    totalUsers: number;
    totalAnswers: number;
    questionText: string;
    correctAnswer: number;
    stats: { option: number; count: number }[];
}

export default function TriviaMonitor() {
    const { currentQuestion, phase, timer } = useGameStore();
    const [stats, setStats] = useState<TriviaStats | null>(null);

    useEffect(() => {
        if (phase !== 'TRIVIA' && phase !== 'TRANSITION') return;

        const fetchStats = async () => {
            try {
                const res = await fetch(`${getBackendUrl()}/admin/trivia-stats?index=${currentQuestion}`);
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch trivia stats');
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 2000);
        return () => clearInterval(interval);
    }, [currentQuestion, phase]);

    const handleNext = async () => {
        try {
            await fetch(`${getBackendUrl()}/admin/next-question`, {
                method: 'POST',
            });
        } catch (err) {
            console.error('Failed to trigger next question');
        }
    };

    if (phase !== 'TRIVIA' && phase !== 'TRANSITION') {
        if (phase === 'WATERING' || phase === 'FINAL') {
            return (
                <div className="glass" style={{ padding: '2rem', textAlign: 'center', marginTop: '1rem' }}>
                    <h3 style={{ color: 'var(--primary)', margin: 0 }}>🎉 Trivia Selesai!</h3>
                    <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>Seluruh pertanyaan telah dijawab. Memasuki fase perayaan.</p>
                </div>
            );
        }
        return <p style={{ opacity: 0.5, fontSize: '0.9rem', padding: '2rem', textAlign: 'center' }}>Monitor aktif saat fase Trivia dimulai.</p>;
    }

    if (!stats && currentQuestion > 0) {
        return (
            <div className="glass" style={{ padding: '2rem', textAlign: 'center', marginTop: '1rem' }}>
                <div className={styles.pulseLoader} style={{ margin: '0 auto 1rem' }}></div>
                <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>Menghubungkan ke Statistik Trivia...</p>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="glass" style={{ padding: '1.5rem', marginTop: '1rem', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ marginBottom: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h4 style={{ color: 'var(--primary)', margin: 0 }}>Pertanyaan #{currentQuestion}</h4>
                        <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                            {stats?.totalAnswers || 0} Jawaban
                        </span>
                    </div>
                    <p style={{ fontSize: '0.95rem', fontWeight: 500, lineHeight: '1.4', borderLeft: '3px solid var(--primary)', paddingLeft: '0.8rem', marginTop: '0.5rem', color: 'white' }}>
                        {stats?.questionText || 'Memuat pertanyaan...'}
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: timer <= 3 ? '#ef4444' : 'var(--primary)' }}>
                        {timer}s
                    </div>
                    <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>TIMER</span>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {[0, 1, 2, 3].map((optIdx) => {
                    const count = stats?.stats.find(s => s.option === optIdx)?.count || 0;
                    const percent = stats?.totalAnswers ? (count / stats.totalAnswers) * 100 : 0;

                    return (
                        <div key={optIdx} style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem', zIndex: 1 }}>
                                <span>Opsi {String.fromCharCode(65 + optIdx)}</span>
                                <span style={{ fontWeight: 600 }}>{count}</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${percent}%`,
                                    height: '100%',
                                    background: 'var(--primary)',
                                    transition: 'width 0.5s ease-out'
                                }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {timer === 0 && currentQuestion < 10 && (
                <button
                    onClick={handleNext}
                    style={{
                        marginTop: '1.5rem',
                        width: '100%',
                        padding: '1rem',
                        background: 'gold',
                        color: 'black',
                        borderRadius: '0.5rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
                    }}
                >
                    LANJUT SOAL BERIKUTNYA (#{currentQuestion + 1}) →
                </button>
            )}

            {timer === 0 && currentQuestion >= 10 && (
                <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#22c55e', fontWeight: 700, background: 'rgba(34, 197, 94, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
                    🎉 SELURUH TRIVIA SELESAI
                </div>
            )}
        </div>
    );
}
