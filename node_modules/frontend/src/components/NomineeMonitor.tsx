'use client';

import { useState, useEffect } from 'react';
import styles from '../app/page.module.css';
import { getBackendUrl } from '@/lib/config';

interface NomineeStats {
    id: string;
    name: string;
    count: number;
    division?: string;
}

interface ParticipationMetadata {
    totalVoters: number;
    votedCount: number;
    percentage: number;
    voterNames?: string[];
}

const SilhouetteIcon = ({ color, size }: { color: string; size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" fill={color} />
        <path d="M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill={color} />
    </svg>
);

const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

export default function NomineeMonitor({ category }: { category: 'team' | 'digimer' }) {
    const [stats, setStats] = useState<NomineeStats[]>([]);
    const [metadata, setMetadata] = useState<ParticipationMetadata | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${getBackendUrl()}/votes/stats?category=${category}`);
            const data = await res.json();
            setStats(data.items || []);
            setMetadata(data.metadata || null);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch nominee stats');
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 3000);
        return () => clearInterval(interval);
    }, [category]);

    if (loading) return <div style={{ opacity: 0.5, fontSize: '0.8rem' }}>Loading nominees...</div>;

    return (
        <div style={{ marginTop: '1.5rem' }}>
            {/* Participation Header */}
            <div className="glass" style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.8rem' }}>
                    <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px' }}>VOTING PARTICIPATION</span>
                        <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900 }}>
                            {metadata?.votedCount || 0} <span style={{ opacity: 0.3, fontSize: '1.2rem' }}>/ {metadata?.totalVoters || 0}</span>
                        </h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)' }}>{Math.round(metadata?.percentage || 0)}%</span>
                        <p style={{ margin: 0, fontSize: '0.65rem', opacity: 0.5, fontWeight: 700 }}>OF TOTAL USERS</p>
                    </div>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: `${metadata?.percentage || 0}%`,
                        height: '100%',
                        background: 'var(--primary)',
                        boxShadow: '0 0 15px var(--primary)',
                        transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                </div>

                {/* Voter Roll Section */}
                {metadata?.voterNames && metadata.voterNames.length > 0 && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', marginBottom: '0.8rem', letterSpacing: '1px' }}>RECENT VOTERS</div>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.6rem',
                            maxHeight: '80px',
                            overflowY: 'auto',
                            paddingRight: '0.5rem'
                        }}>
                            {metadata.voterNames.map((name, i) => (
                                <span key={i} style={{
                                    padding: '0.3rem 0.8rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '1rem',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    animation: 'fadeIn 0.5s ease-out'
                                }}>
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', color: category === 'team' ? 'gold' : '#00d2ff', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 900 }}>
                    {category === 'team' ? '🏆 Team Candidates' : '🌟 Individual Nominees'}
                </h4>
                <span style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 700 }}>{stats.length} NOMINEES</span>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                width: '100%'
            }}>
                {stats.map((item, idx) => (
                    <div key={item.id} className="glass" style={{
                        padding: '1.2rem',
                        borderLeft: `4px solid ${category === 'team' ? 'gold' : '#00d2ff'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.2rem'
                    }}>
                        {/* Avatar Selection */}
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '1.2rem',
                            background: 'rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${category === 'team' ? 'rgba(255,215,0,0.3)' : 'rgba(0,210,255,0.3)'}`,
                            flexShrink: 0
                        }}>
                            {category === 'digimer' ? (
                                <SilhouetteIcon color="#00d2ff" size={32} />
                            ) : (
                                <span style={{ color: 'gold', fontWeight: 950, fontSize: '1.1rem' }}>
                                    {getInitials(item.name)}
                                </span>
                            )}
                        </div>

                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                            {item.division && <div style={{ fontSize: '0.75rem', opacity: 0.4, textTransform: 'uppercase', marginTop: '0.2rem', fontWeight: 600 }}>{item.division}</div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
