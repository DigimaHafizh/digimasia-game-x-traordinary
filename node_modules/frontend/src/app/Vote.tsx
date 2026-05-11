'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import styles from './page.module.css';
import { getBackendUrl } from '@/lib/config';

interface Candidate {
    id: string;
    name: string;
    division: string;
    imageUrl: string;
    type: string;
}

export default function Vote({ type }: { type: 'team' | 'digimer' }) {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [votedId, setVotedId] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const { user, voteTeam, voteDigi, setUserState } = useGameStore();

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const res = await fetch(`${getBackendUrl()}/candidates?type=${type}`);
                const data = await res.json();
                setCandidates(data);
            } catch (err) {
                setError('Gagal mengambil data kandidat');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCandidates();
        setVotedId(null);
        setSelectedId(null);

        if (type === 'team' && voteTeam) setVotedId(voteTeam);
        if (type === 'digimer' && voteDigi) setVotedId(voteDigi);
    }, [type, voteTeam, voteDigi]);

    const handleSubmit = async () => {
        if (!selectedId || votedId || !user || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`${getBackendUrl()}/votes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    candidateId: selectedId,
                    category: type,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Gagal mengirim suara');
            }

            setVotedId(selectedId);
            if (type === 'team') setUserState({ voteTeam: selectedId });
            if (type === 'digimer') setUserState({ voteDigi: selectedId });
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className={styles.main}><h3>Loading Candidates...</h3></div>;

    return (
        <div className={styles.voteWrapper}>
            <header style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h2 className="gradient-text" style={{ fontSize: '1.5rem', textTransform: 'uppercase', fontWeight: 900 }}>
                    {type === 'team' ? 'Team of the Year' : 'Digimer of the Year'}
                </h2>
                <p style={{ opacity: 0.7, fontSize: '0.8rem' }}>
                    {type === 'team'
                        ? 'Pilih jagoanmu (selain tim sendiri)'
                        : 'Pilih jagoanmu lalu tekan Submit.'}
                </p>
            </header>

            <div className={styles.candidateGrid}>
                {candidates.map((c) => {
                    const isSelected = selectedId === c.id;
                    const isVoted = votedId === c.id;
                    const isOwnTeam = type === 'team' && c.division === user?.division;

                    return (
                        <div
                            key={c.id}
                            className={`glass ${styles.candidateCard} ${isVoted ? styles.voted : ''}`}
                            style={{
                                border: isSelected ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                opacity: (votedId && !isVoted) || isOwnTeam ? 0.4 : 1,
                                cursor: votedId || isOwnTeam ? 'default' : 'pointer',
                                filter: isOwnTeam ? 'grayscale(1)' : 'none'
                            }}
                            onClick={() => !votedId && !isOwnTeam && setSelectedId(c.id)}
                        >
                            <div className={styles.avatarWrapper}>
                                <div className={styles.placeholderAvatar}>
                                    {c.name.charAt(0)}
                                </div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '0.8rem 0.5rem 0' }}>
                                <h3 style={{ fontSize: '0.95rem', marginBottom: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</h3>
                                <p style={{ fontSize: '0.7rem', opacity: 0.5 }}>{c.division}</p>
                            </div>
                            {isVoted && <div className={styles.voteBadge}>TERKUNCI ✅</div>}
                            {isSelected && !isVoted && <div className={styles.voteBadge} style={{ background: '#22c55e' }}>TERPILIH</div>}
                            {isOwnTeam && <div className={styles.voteBadge} style={{ background: '#666', fontSize: '0.6rem' }}>TIM SENDIRI</div>}
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center', minHeight: '60px' }}>
                {!votedId ? (
                    <button
                        className="btn-primary"
                        style={{
                            padding: '1rem 3rem',
                            fontSize: '1rem',
                            borderRadius: '2rem',
                            fontWeight: 900,
                            opacity: selectedId ? 1 : 0.5,
                            transform: selectedId ? 'scale(1.05)' : 'scale(1)',
                            transition: 'all 0.3s ease'
                        }}
                        disabled={!selectedId || isSubmitting}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? 'MENGIRIM...' : 'SUBMIT VOTE 🚀'}
                    </button>
                ) : (
                    <div style={{ animation: 'fadeIn 1s ease-out' }}>
                        <p style={{ fontSize: '1.2rem', fontWeight: 900, color: '#22c55e' }}>
                            TERIMA KASIH!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
