import { useState, useEffect } from 'react';
import styles from '../app/page.module.css';
import confetti from 'canvas-confetti';
import { getBackendUrl } from '@/lib/config';

interface WinnerStats {
    id: string;
    name: string;
    division?: string;
    imageUrl?: string;
    count: number;
}

interface WinnerAnnouncerProps {
    onClose?: () => void;
}

export default function WinnerAnnouncer({ onClose }: WinnerAnnouncerProps) {
    const [teamWinner, setTeamWinner] = useState<WinnerStats | null>(null);
    const [digimerWinner, setDigimerWinner] = useState<WinnerStats | null>(null);
    const [teamStats, setTeamStats] = useState<WinnerStats[]>([]);
    const [digimerStats, setDigimerStats] = useState<WinnerStats[]>([]);

    const [revealedNomineesTeam, setRevealedNomineesTeam] = useState(false);
    const [revealedNomineesDigimer, setRevealedNomineesDigimer] = useState(false);

    const [showTeamChart, setShowTeamChart] = useState(false);
    const [showDigimerChart, setShowDigimerChart] = useState(false);

    const [finalWinnerTeam, setFinalWinnerTeam] = useState(false);
    const [finalWinnerDigimer, setFinalWinnerDigimer] = useState(false);
    const [flashActive, setFlashActive] = useState(false);

    const triggerFlash = () => {
        setFlashActive(true);
        setTimeout(() => setFlashActive(false), 600);
    };

    const handleWinnerReveal = (type: 'team' | 'digimer') => {
        triggerFlash();

        // Pemicu Confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        if (type === 'team') {
            setFinalWinnerTeam(true);
            setShowTeamChart(true);
        } else {
            setFinalWinnerDigimer(true);
            setShowDigimerChart(true);
        }
    };

    const fetchData = async () => {
        try {
            const baseUrl = getBackendUrl();
            const [resTW, resDW, resTS, resDS] = await Promise.all([
                fetch(`${baseUrl}/votes/results?category=team`),
                fetch(`${baseUrl}/votes/results?category=digimer`),
                fetch(`${baseUrl}/votes/stats?category=team`),
                fetch(`${baseUrl}/votes/stats?category=digimer`)
            ]);
            setTeamWinner(await resTW.json());
            setDigimerWinner(await resDW.json());
            const dataTS = await resTS.json();
            const dataDS = await resDS.json();
            setTeamStats(dataTS.items || []);
            setDigimerStats(dataDS.items || []);
        } catch (err) {
            console.error('Failed to fetch stats');
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const SilhouetteIcon = ({ color, size = 60 }: { color: string, size?: number }) => (
        <div style={{
            width: size,
            height: size,
            background: `linear-gradient(180deg, ${color}66, ${color}aa)`,
            borderRadius: '50%',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 0 15px ${color}33`,
            border: `2px solid ${color}44`
        }}>
            <div style={{ position: 'absolute', bottom: '-5px', left: '15%', width: '70%', height: '50%', background: 'rgba(0,0,0,0.4)', borderRadius: '40% 40% 0 0' }}></div>
            <div style={{ position: 'absolute', top: '20%', left: '30%', width: '40%', height: '40%', background: 'rgba(0,0,0,0.4)', borderRadius: '50%' }}></div>
        </div>
    );

    const renderNomineeGrid = (data: WinnerStats[], color: string, category: 'team' | 'digimer') => {
        const isRevealed = category === 'team' ? revealedNomineesTeam : revealedNomineesDigimer;
        const showingChart = category === 'team' ? showTeamChart : showDigimerChart;
        const winnerRevealed = category === 'team' ? finalWinnerTeam : finalWinnerDigimer;
        const winnerObj = category === 'team' ? teamWinner : digimerWinner;
        const winnerId = winnerObj?.id;
        const maxVotes = Math.max(...data.map(d => d.count), 1);

        // LAKUKAN FILTER: Jika sudah reveal winner, hanya tampilkan winner saja
        // Jika winnerId tidak ada (karena delay data), ambil item pertama dari data (sudah disorting di backend)
        const displayData = winnerRevealed
            ? (winnerId ? data.filter(d => d.id === winnerId) : [data[0]])
            : data;

        if (winnerRevealed && displayData.length === 0 && data.length > 0) {
            displayData.push(data[0]); // Fallback absolute
        }

        if (!isRevealed) return (
            <div style={{ padding: '2rem', border: `1px dashed ${color}44`, borderRadius: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                <button
                    className="btn-primary"
                    style={{ background: color, color: 'black', fontWeight: 900, padding: '1rem 2rem', borderRadius: '2rem' }}
                    onClick={() => category === 'team' ? setRevealedNomineesTeam(true) : setRevealedNomineesDigimer(true)}
                >
                    REVEAL FINALISTS 🕵️‍♂️
                </button>
            </div>
        );

        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: winnerRevealed ? '1fr' : (data.length > 4 ? 'repeat(4, 1fr)' : 'repeat(auto-fit, minmax(120px, 1fr))'),
                gap: '1rem',
                width: '100%',
                perspective: '1000px',
                justifyItems: 'center',
                padding: '0.5rem'
            }}>
                {displayData.map((item, idx) => {
                    const isWinner = item.id === winnerId && winnerRevealed;
                    return (
                        <div key={idx}
                            className={`${styles.nomineeCard} ${isWinner ? styles.winnerCard : ''}`}
                            style={{
                                padding: isWinner ? '3rem' : '1.5rem',
                                background: isWinner ? `linear-gradient(135deg, ${color}44, rgba(0,0,0,0.6))` : 'rgba(255,255,255,0.03)',
                                borderRadius: '2rem',
                                border: `1px solid ${isWinner ? color : color + '22'}`,
                                position: 'relative',
                                zIndex: isWinner ? 10 : 1,
                                width: '100%',
                                maxWidth: isWinner ? '450px' : '220px'
                            }}>
                            {isWinner && <div className={styles.crownIcon} style={{ position: 'absolute', top: '-25px', right: '-15px', fontSize: '3rem', zIndex: 11 }}>👑</div>}

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isWinner ? '1rem' : '0.5rem' }}>
                                <SilhouetteIcon color={isWinner ? color : '#555'} size={isWinner ? 120 : 40} />
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontWeight: 800, fontSize: isWinner ? '1.8rem' : '0.75rem', color: isWinner ? color : 'white', lineHeight: 1.2 }}>{item.name}</div>
                                    <div style={{ fontSize: isWinner ? '0.9rem' : '0.55rem', opacity: 0.3, textTransform: 'uppercase', marginTop: '0.2rem' }}>{item.division}</div>
                                </div>
                            </div>

                            {showingChart && (
                                <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.8s ease-out', width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.5rem', fontWeight: 800 }}>
                                        <span style={{ color }}>{Math.round((item.count / maxVotes) * 100)}%</span>
                                        <span style={{ opacity: 0.4 }}>{item.count} VOTES</span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${(item.count / maxVotes) * 100}%`,
                                            height: '100%',
                                            background: color,
                                            boxShadow: `0 0 15px ${color}`,
                                            transition: 'width 1.5s ease-out'
                                        }}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="glass" style={{
            padding: '4rem',
            margin: '0 auto',
            width: '100%',
            maxWidth: '1800px',
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {flashActive && <div className={styles.screenFlashOverlay} />}
            {onClose && (
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '2rem', right: '3rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', zIndex: 100 }}
                >
                    ✕
                </button>
            )}

            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '6px', color: 'var(--primary)', opacity: 0.8 }}>X-CELERATE THE TREE</span>
                <h1 style={{ margin: '1rem 0', fontSize: '2.5rem', fontWeight: 900, letterSpacing: '2px' }}>AWARDS DISCLOSURE CEREMONY</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start', flex: 1 }}>
                {/* 1. Digimer of the Year Section */}
                <div style={{ textAlign: 'center', background: 'rgba(0, 210, 255, 0.02)', padding: '3rem 2rem', borderRadius: '3rem', border: '1px solid rgba(0, 210, 255, 0.05)' }}>
                    <h3 style={{ fontSize: '1.1rem', color: '#00d2ff', fontWeight: 900, letterSpacing: '4px', marginBottom: '3rem' }}>DIGIMER OF THE YEAR</h3>

                    {renderNomineeGrid(digimerStats, '#00d2ff', 'digimer')}

                    {revealedNomineesDigimer && !finalWinnerDigimer && (
                        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: '3rem auto 0' }}>
                            <button
                                className="btn-primary"
                                style={{ padding: '1rem', background: 'transparent', color: '#00d2ff', border: '1px solid #00d2ff', fontSize: '0.8rem', fontWeight: 800, borderRadius: '2rem' }}
                                onClick={() => setShowDigimerChart(!showDigimerChart)}
                            >
                                {showDigimerChart ? 'HIDE LIVE MONITORING' : '📊 MONITOR LIVE VOTES'}
                            </button>
                            <button
                                className="btn-primary"
                                style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #00d2ff, #0072ff)', color: 'black', border: 'none', fontSize: '1rem', fontWeight: 900, borderRadius: '2rem', boxShadow: '0 10px 20px rgba(0, 210, 255, 0.2)' }}
                                onClick={() => handleWinnerReveal('digimer')}
                            >
                                🏆 REVEAL THE WINNER
                            </button>
                        </div>
                    )}
                </div>

                {/* 2. Best Team of the Year Section */}
                <div style={{ textAlign: 'center', background: 'rgba(255, 215, 0, 0.02)', padding: '3rem 2rem', borderRadius: '3rem', border: '1px solid rgba(255, 215, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'gold', fontWeight: 900, letterSpacing: '4px', marginBottom: '3rem' }}>BEST TEAM OF THE YEAR</h3>

                    {renderNomineeGrid(teamStats, 'gold', 'team')}

                    {revealedNomineesTeam && !finalWinnerTeam && (
                        <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: '3rem auto 0' }}>
                            <button
                                className="btn-primary"
                                style={{ padding: '1rem', background: 'transparent', color: 'gold', border: '1px solid gold', fontSize: '0.8rem', fontWeight: 800, borderRadius: '2rem' }}
                                onClick={() => setShowTeamChart(!showTeamChart)}
                            >
                                {showTeamChart ? 'HIDE LIVE MONITORING' : '📊 MONITOR LIVE VOTES'}
                            </button>
                            <button
                                className="btn-primary"
                                style={{ padding: '1.5rem', background: 'linear-gradient(135deg, gold, #b8860b)', color: 'black', border: 'none', fontSize: '1rem', fontWeight: 900, borderRadius: '2rem', boxShadow: '0 10px 20px rgba(255, 215, 0, 0.2)' }}
                                onClick={() => handleWinnerReveal('team')}
                            >
                                🏆 REVEAL THE WINNER
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {(revealedNomineesTeam || revealedNomineesDigimer) && (
                <div style={{ textAlign: 'center', marginTop: '6rem', paddingBottom: '2rem' }}>
                    <button
                        onClick={() => {
                            setFinalWinnerTeam(false); setFinalWinnerDigimer(false);
                            setShowTeamChart(false); setShowDigimerChart(false);
                            setRevealedNomineesTeam(false); setRevealedNomineesDigimer(false);
                        }}
                        style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', opacity: 0.2, cursor: 'pointer', fontSize: '0.7rem', padding: '0.8rem 2rem', borderRadius: '2rem', letterSpacing: '1px' }}
                    >
                        RESET ANNOUNCEMENT CEREMONY
                    </button>
                </div>
            )}
        </div>
    );
}
