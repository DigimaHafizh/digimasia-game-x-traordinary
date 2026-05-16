'use client';

import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { getBackendUrl } from '@/lib/config';
import SplashScreen from '@/components/c-SplashScreen';

// Individual PIN Slot Box
const PinSlot = ({ value, isFocused, index, showValue, colorOverride }: { value: string; isFocused: boolean; index: number; showValue?: boolean; colorOverride?: string }) => {
    return (
        <div style={{
            width: '72px',
            height: '84px',
            background: colorOverride || (value ? '#FFD600' : '#FFF'),
            border: '4px solid #000',
            boxShadow: value ? '6px 6px 0 #000' : '2px 2px 0 #000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '42px',
            fontWeight: '900',
            color: '#000', // Always black for White/Yellow/Pink contrast
            borderRadius: '8px',
            position: 'relative',
            transform: value ? `rotate(${index % 2 === 0 ? '-2deg' : '2deg'})` : 'none',
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            animation: isFocused ? 'pulse 1.5s infinite' : 'none',
        }}>
            {value ? (showValue ? value : '●') : ''}
            {isFocused && (
                <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    width: '30px',
                    height: '6px',
                    background: '#000',
                    borderRadius: '3px',
                }} />
            )}
        </div>
    );
};

export default function Login() {
    const [pin, setPin] = useState('');
    const [showPin, setShowPin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [shake, setShake] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const { setUser, setSessionState } = useGameStore();
    const [showSplash, setShowSplash] = useState(false);
    const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
    const [authData, setAuthData] = useState<any>(null);

    // Auto-focus on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pin.length !== 4) {
            setError('PIN harus 4 digit!');
            triggerShake();
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`${getBackendUrl()}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin }),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Login gagal');
            }
            const data = await res.json();
            setAuthData(data);
            if (data.user.isAdmin) {
                setShowSplash(true);
                setPendingRedirect('/admin');
                return;
            }
            setShowSplash(true);
            setPendingRedirect(null);
        } catch (err: any) {
            setError(err.message || 'PIN tidak terdaftar');
            triggerShake();
            setPin('');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').substring(0, 4);
        setPin(value);
        setError('');
    };

    if (showSplash) {
        return <SplashScreen onComplete={() => {
            if (authData) {
                setUser(authData.user);
                if (authData.session) setSessionState(authData.session);
                if (authData.user.voteTeam || authData.user.voteDigi) {
                    useGameStore.getState().setUserState({
                        voteTeam: authData.user.voteTeam,
                        voteDigi: authData.user.voteDigi
                    });
                }
            }
            if (pendingRedirect) {
                window.location.href = pendingRedirect;
            } else {
                setShowSplash(false);
            }
        }} />;
    }

    return (
        <div style={{
            minHeight: 'calc(100vh - 90px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            padding: '20px',
        }}>
            {/* Decorative Background Stars */}
            {['★', '♦', '✦', '★', '✸', '♦'].map((sym, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    fontFamily: 'var(--font-display)',
                    fontSize: `${24 + i * 8}px`,
                    color: ['#FF1493', '#FFD600', '#00FF88', '#2979FF', '#FF6B35', '#FF1493'][i],
                    opacity: 0.15,
                    top: `${[10, 75, 20, 60, 85, 40][i]}%`,
                    left: `${[5, 90, 85, 2, 10, 95][i]}%`,
                    transform: `rotate(${[15, -20, 10, -15, 20, -10][i]}deg)`,
                    userSelect: 'none',
                    pointerEvents: 'none',
                }}>{sym}</div>
            ))}

            {/* Main Card */}
            <div
                className="animate-pop-in"
                style={{
                    width: '100%',
                    maxWidth: '460px',
                    position: 'relative',
                    animation: shake ? 'shake 0.5s ease' : undefined,
                }}
            >
                {/* ── TOP RIBBON ── */}
                <div style={{
                    background: '#FF1493',
                    border: '4px solid #000',
                    borderBottom: 'none',
                    padding: '10px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '10px 0 0 #000',
                }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: '#FFF', fontWeight: 700 }}>DIGIMA ASIA</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.8)' }}>DIGIMAVERSARY #10</span>
                </div>

                {/* ── MAIN BODY ── */}
                <div style={{
                    background: 'var(--navy-dark)',
                    border: '4px solid #000',
                    borderTop: 'none',
                    boxShadow: '10px 10px 0 #000',
                    padding: '36px 36px 32px',
                    textAlign: 'center',
                }}>
                    {/* Title Block */}
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{
                            background: '#FFD600',
                            border: '3px solid #000',
                            boxShadow: '5px 5px 0 #000',
                            display: 'inline-block',
                            padding: '4px 18px',
                            transform: 'rotate(-1.5deg)',
                            marginBottom: '12px',
                        }}>
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '4px', color: '#000', fontWeight: 900 }}>ACCESS PORTAL</span>
                        </div>
                        <div style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '52px',
                            letterSpacing: '1px',
                            color: '#FFD600',
                            lineHeight: 0.9,
                            textShadow: '5px 5px 0 #000, -2px -2px 0 #FF1493',
                            marginBottom: '4px',
                        }}>X-TRAORDINARY</div>
                        <div style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '24px',
                            letterSpacing: '5px',
                            color: '#FFFFFF',
                            textShadow: '3px 3px 0 #000',
                            lineHeight: 1,
                        }}>GROW WITH HEART</div>
                    </div>

                    {/* ── Inline PIN Input + Slots ── */}
                    <div style={{ marginBottom: '28px' }}>
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            letterSpacing: '3px',
                            color: 'rgba(255,255,255,0.6)',
                            fontWeight: 700,
                            marginBottom: '18px',
                            textTransform: 'uppercase',
                        }}>MASUKKAN PIN AKSES KAMU</div>

                        {/* PIN Slots Visual + Hidden Real Input */}
                        <div
                            onClick={() => inputRef.current?.focus()}
                            style={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '32px',
                                padding: '16px 0',
                                cursor: 'text',
                            }}
                        >
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {[0, 1, 2, 3].map(i => (
                                        <PinSlot
                                            key={i}
                                            value={pin[i] || ''}
                                            isFocused={isFocused && pin.length === i}
                                            index={i}
                                            showValue={showPin}
                                            // White if empty OR shown, Yellow if hidden+filled
                                            colorOverride={(showPin || !pin[i]) ? '#FFF' : '#FFD600'}
                                        />
                                    ))}
                                </div>

                                {/* ── REFINED PREMIUM RETRO EYE TOGGLE ── */}
                                <div style={{ position: 'relative', width: '64px', height: '64px' }} onClick={e => e.stopPropagation()}>
                                    <button
                                        type="button"
                                        onClick={() => setShowPin(!showPin)}
                                        title={showPin ? "Sembunyikan PIN" : "Lihat PIN"}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            background: showPin ? '#FF0099' : '#FFD600',
                                            border: '4px solid #000',
                                            borderRadius: '50%',
                                            boxShadow: '6px 6px 0 #000',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            transform: showPin ? 'scale(1.05) rotate(5deg)' : 'none',
                                        }}
                                        onMouseDown={e => { (e.currentTarget as any).style.transform = 'translate(4px, 4px) scale(0.95)'; (e.currentTarget as any).style.boxShadow = '2px 2px 0 #000'; }}
                                        onMouseUp={e => { (e.currentTarget as any).style.transform = showPin ? 'scale(1.05) rotate(5deg)' : 'none'; (e.currentTarget as any).style.boxShadow = '6px 6px 0 #000'; }}
                                    >
                                        {/* The Eye Shape */}
                                        <div style={{
                                            width: '32px',
                                            height: '24px',
                                            background: '#FFF',
                                            border: '3px solid #000',
                                            borderRadius: '50%',
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s',
                                            transform: !showPin ? 'scaleY(0.1)' : 'none', // Blink when HIDDEN
                                        }}>
                                            {/* Pupil */}
                                            {showPin && (
                                                <div style={{
                                                    width: '12px',
                                                    height: '12px',
                                                    background: '#000',
                                                    borderRadius: '50%',
                                                    animation: 'lookAround 3s infinite',
                                                }} />
                                            )}
                                            {!showPin && (
                                                <div style={{
                                                    width: '18px',
                                                    height: '4px',
                                                    background: '#000',
                                                    borderRadius: '2px',
                                                }} />
                                            )}
                                        </div>

                                        {/* Pulse effect when hidden */}
                                        {!showPin && (
                                            <div style={{
                                                position: 'absolute',
                                                inset: 0,
                                                border: '4px solid rgba(255,255,255,0.3)',
                                                borderRadius: '50%',
                                                animation: 'pulse 2s infinite',
                                            }} />
                                        )}
                                    </button>

                                    {/* Status Indicator Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '0',
                                        right: '0',
                                        background: showPin ? '#000' : '#FFF',
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '50%',
                                        border: '3px solid #000',
                                        fontSize: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: showPin ? '#FFF' : '#000',
                                        fontWeight: 900,
                                        boxShadow: '2px 2px 0 #000',
                                    }}>
                                        {showPin ? '!' : '?'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hidden real input overlay */}
                        <input
                            ref={inputRef}
                            type="tel"
                            maxLength={4}
                            value={pin}
                            onChange={handlePinChange}
                            onBlur={() => setIsFocused(false)}
                            onFocus={() => setIsFocused(true)}
                            autoFocus
                            style={{
                                position: 'absolute',
                                opacity: 0,
                                width: '1px',
                                height: '1px',
                                top: '50%',
                                left: '50%',
                                zIndex: -1,
                            }}
                        />

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleLogin}
                            disabled={pin.length < 4 || isLoading}
                            style={{
                                width: '100%',
                                padding: '20px',
                                background: pin.length === 4 ? '#FF0099' : '#333',
                                border: '4px solid #000',
                                boxShadow: pin.length === 4 ? '8px 8px 0 #000' : 'none',
                                color: '#FFF',
                                fontSize: '24px',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                cursor: pin.length === 4 ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '16px',
                                transition: 'all 0.2s',
                                transform: pin.length === 4 ? 'none' : 'translate(4px, 4px)',
                                marginTop: '48px',
                            }}
                            onMouseDown={e => { if (pin.length === 4) { (e.currentTarget as any).style.transform = 'translate(4px, 4px)'; (e.currentTarget as any).style.boxShadow = '4px 4px 0 #000'; } }}
                            onMouseUp={e => { if (pin.length === 4) { (e.currentTarget as any).style.transform = 'none'; (e.currentTarget as any).style.boxShadow = '8px 8px 0 #000'; } }}
                        >
                            {isLoading ? (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div className="dot" style={{ width: '8px', height: '8px', background: '#FFF', borderRadius: '50%', animation: 'blink 1s 0s infinite' }} />
                                    <div className="dot" style={{ width: '8px', height: '8px', background: '#FFF', borderRadius: '50%', animation: 'blink 1s 0.2s infinite' }} />
                                    <div className="dot" style={{ width: '8px', height: '8px', background: '#FFF', borderRadius: '50%', animation: 'blink 1s 0.4s infinite' }} />
                                </div>
                            ) : (
                                <>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.5))' }}>
                                        <path d="M5 12H19M19 12L13 6M19 12L13 6.99976M19 12L13 18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" style={{ animation: 'spin 4s linear infinite' }} />
                                    </svg>
                                    <span>MASUK SEKARANG</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div style={{
                            background: '#FF1493',
                            border: '3px solid #000',
                            boxShadow: '4px 4px 0 #000',
                            color: 'white',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            fontWeight: 900,
                            padding: '10px 16px',
                            marginBottom: '16px',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Footer Hint */}
                    <div style={{
                        marginTop: '20px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        color: 'rgba(255,255,255,0.25)',
                        letterSpacing: '1px',
                    }}>
                        Hubungi panitia jika belum menerima PIN akses.
                    </div>
                </div>

                {/* ── BOTTOM STICKER ── */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '-4px',
                }}>
                    <div style={{
                        background: '#2979FF',
                        border: '4px solid #000',
                        borderTop: 'none',
                        boxShadow: '10px 10px 0 #000',
                        padding: '6px 24px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        letterSpacing: '3px',
                        color: '#FFD600',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                    }}>
                        DIGIMAVERSARY #10 · 2016–2026
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes lookAround {
                    0%, 100% { transform: translate(0, 0); }
                    25% { transform: translate(4px, 0); }
                    50% { transform: translate(0, 4px); }
                    75% { transform: translate(-4px, 0); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-8px) rotate(-1deg); }
                    40% { transform: translateX(8px) rotate(1deg); }
                    60% { transform: translateX(-6px) rotate(-0.5deg); }
                    80% { transform: translateX(6px) rotate(0.5deg); }
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 0.4; }
                    100% { transform: scale(1); opacity: 0.8; }
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </div >
    );
}
