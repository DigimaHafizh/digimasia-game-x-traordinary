import { useState, useEffect } from 'react';
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

const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

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

    // ── Core Logic (unchanged) ──────────────────
    const triggerFlash = () => {
        setFlashActive(true);
        setTimeout(() => setFlashActive(false), 600);
    };

    const handleWinnerReveal = (type: 'team' | 'digimer') => {
        triggerFlash();
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        if (type === 'team') { setFinalWinnerTeam(true); setShowTeamChart(true); }
        else { setFinalWinnerDigimer(true); setShowDigimerChart(true); }
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

    // ── Nominee Grid Renderer ───────────────────
    const renderNomineeGrid = (data: WinnerStats[], accentColor: string, category: 'team' | 'digimer') => {
        const isRevealed = category === 'team' ? revealedNomineesTeam : revealedNomineesDigimer;
        const showingChart = category === 'team' ? showTeamChart : showDigimerChart;
        const winnerRevealed = category === 'team' ? finalWinnerTeam : finalWinnerDigimer;
        const winnerObj = category === 'team' ? teamWinner : digimerWinner;
        const winnerId = winnerObj?.id;
        const maxVotes = Math.max(...data.map(d => d.count), 1);

        const displayData = winnerRevealed
            ? (winnerId ? data.filter(d => d.id === winnerId) : [data[0]])
            : data;
        if (winnerRevealed && displayData.length === 0 && data.length > 0) displayData.push(data[0]);

        if (!isRevealed) return (
            <div style={{ textAlign: 'center', padding: '24px' }}>
                <button
                    className="btn btn-navy"
                    style={{ padding: '12px 24px', fontSize: '13px' }}
                    onClick={() => category === 'team' ? setRevealedNomineesTeam(true) : setRevealedNomineesDigimer(true)}
                >
                    🕵️ REVEAL FINALISTS
                </button>
            </div>
        );

        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: winnerRevealed ? '1fr' : 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '12px',
                justifyItems: 'center',
            }}>
                {displayData.map((item, idx) => {
                    const isWinner = item.id === winnerId && winnerRevealed;
                    return (
                        <div key={idx} style={{
                            width: '100%',
                            maxWidth: isWinner ? '360px' : '160px',
                        }}>
                            {isWinner ? (
                                /* ── WINNER big reveal card ── */
                                <div className="reveal-card" style={{
                                    animation: 'winnerReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    position: 'relative',
                                    paddingTop: '40px',
                                }}>
                                    <div style={{
                                        position: 'absolute', top: '-16px', right: '-8px',
                                        fontSize: '36px', animation: 'crownFloat 3s ease-in-out infinite',
                                    }}>👑</div>

                                    <div style={{
                                        width: '80px', height: '80px',
                                        borderRadius: '50%',
                                        background: accentColor,
                                        border: 'var(--border)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '32px', color: 'var(--white)',
                                        margin: '0 auto 16px',
                                        boxShadow: `0 0 30px ${accentColor}`,
                                        animation: 'sparkleGlow 2s ease-in-out infinite',
                                    }}>
                                        {getInitials(item.name)}
                                    </div>

                                    <div className="winner-name">{item.name}</div>
                                    {item.division && <div className="winner-div">{item.division.toUpperCase()}</div>}

                                    {showingChart && (
                                        <div style={{ marginTop: '16px', animation: 'fadeIn 0.8s ease-out' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', marginBottom: '6px' }}>
                                                <span style={{ color: accentColor }}>{Math.round((item.count / maxVotes) * 100)}%</span>
                                                <span style={{ color: 'rgba(255,255,255,0.4)' }}>{item.count} VOTES</span>
                                            </div>
                                            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                                                <div style={{
                                                    width: `${(item.count / maxVotes) * 100}%`,
                                                    height: '100%',
                                                    background: accentColor,
                                                    boxShadow: `0 0 12px ${accentColor}`,
                                                    transition: 'width 1.5s ease-out',
                                                    borderRadius: '4px',
                                                }} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* ── Nominee mini card ── */
                                <div className="candidate" style={{ textAlign: 'center', padding: '12px 8px' }}>
                                    <div className="cand-avatar" style={{ margin: '0 auto 8px', background: 'var(--navy-dark)', width: '40px', height: '40px', fontSize: '16px' }}>
                                        {getInitials(item.name)}
                                    </div>
                                    <div className="cand-name" style={{ fontSize: '13px' }}>{item.name}</div>
                                    {item.division && <div className="cand-div" style={{ fontSize: '9px', marginTop: '4px' }}>{item.division}</div>}
                                    {showingChart && (
                                        <div style={{ marginTop: '8px' }}>
                                            <div className="progress-track" style={{ height: '8px' }}>
                                                <div className="progress-fill" style={{ width: `${(item.count / maxVotes) * 100}%`, background: accentColor }} />
                                            </div>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', marginTop: '4px' }}>
                                                {item.count} votes
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            {/* Screen flash overlay */}
            {flashActive && (
                <div style={{
                    position: 'fixed', inset: 0,
                    background: 'white', zIndex: 9999,
                    animation: 'screenFlash 0.6s ease-out forwards',
                    pointerEvents: 'none',
                }} />
            )}

            {/* Close button */}
            {onClose && (
                <button className="btn btn-danger" style={{ position: 'absolute', top: 0, right: 0 }} onClick={onClose}>
                    ✕ CLOSE
                </button>
            )}

            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: '28px', paddingTop: '8px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '4px', color: '#888' }}>
                    X-TRAORDINARY — GROW WITH HEART
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', letterSpacing: '3px', color: 'var(--navy-dark)', marginTop: '4px' }}>
                    AWARDS CEREMONY
                </div>
            </div>

            {/* Two award sections */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
                {/* DIGIMER */}
                <div className="card card-navy">
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '3px', color: 'var(--blue-bright)', textAlign: 'center', marginBottom: '16px' }}>
                        DIGIMER OF THE YEAR
                    </div>
                    {renderNomineeGrid(digimerStats, 'var(--blue-bright)', 'digimer')}
                    {revealedNomineesDigimer && !finalWinnerDigimer && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                            <button className="btn btn-full" onClick={() => setShowDigimerChart(!showDigimerChart)}>
                                {showDigimerChart ? '🙈 HIDE CHART' : '📊 SHOW VOTES'}
                            </button>
                            <button className="btn btn-navy btn-full" style={{ padding: '12px', fontSize: '13px' }} onClick={() => handleWinnerReveal('digimer')}>
                                🏆 REVEAL WINNER
                            </button>
                        </div>
                    )}
                </div>

                {/* TEAM */}
                <div className="card card-navy">
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '3px', color: 'var(--yellow)', textAlign: 'center', marginBottom: '16px' }}>
                        BEST TEAM OF THE YEAR
                    </div>
                    {renderNomineeGrid(teamStats, 'var(--yellow)', 'team')}
                    {revealedNomineesTeam && !finalWinnerTeam && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                            <button className="btn btn-full" onClick={() => setShowTeamChart(!showTeamChart)}>
                                {showTeamChart ? '🙈 HIDE CHART' : '📊 SHOW VOTES'}
                            </button>
                            <button className="btn btn-navy btn-full" style={{ padding: '12px', fontSize: '13px' }} onClick={() => handleWinnerReveal('team')}>
                                🏆 REVEAL WINNER
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Reset */}
            {(revealedNomineesTeam || revealedNomineesDigimer) && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                        className="btn"
                        style={{ fontSize: '10px', opacity: 0.4 }}
                        onClick={() => {
                            setFinalWinnerTeam(false); setFinalWinnerDigimer(false);
                            setShowTeamChart(false); setShowDigimerChart(false);
                            setRevealedNomineesTeam(false); setRevealedNomineesDigimer(false);
                        }}
                    >
                        ↺ RESET CEREMONY
                    </button>
                </div>
            )}
        </div>
    );
}
