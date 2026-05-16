'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { getBackendUrl } from '@/lib/config';

interface Question {
    index: number;
    text: string;
    options: string[];
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function Trivia() {
    const [question, setQuestion] = useState<Question | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [pointsEarned, setPointsEarned] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    const { user, currentQuestion, timer } = useGameStore();

    // Fetch question whenever currentQuestion changes
    useEffect(() => {
        const fetchQuestion = async () => {
            setIsLoading(true);
            // Reset all answer state for the new question
            setSelectedOption(null);
            setIsSubmitted(false);
            setIsCorrect(null);
            setPointsEarned(0);
            try {
                const resQ = await fetch(`${getBackendUrl()}/trivia-question/${currentQuestion}`);
                const data = await resQ.json();
                setQuestion({
                    ...data,
                    options: JSON.parse(data.options)
                });
            } catch (err) {
                console.error('Failed to fetch question');
            } finally {
                setIsLoading(false);
            }
        };

        if (currentQuestion > 0) fetchQuestion();
    }, [currentQuestion]);

    const handleSelect = async (optIdx: number) => {
        // Bug Fix 1: Block if already submitted OR timer has run out
        if (!user || !question || isSubmitted || timer === 0) return;

        setSelectedOption(optIdx);
        setIsSubmitted(true);

        try {
            const res = await fetch(`${getBackendUrl()}/trivia-answer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    questionIndex: currentQuestion,
                    optionIndex: optIdx,
                }),
            });

            const data = await res.json();
            if (res.ok && data.correct !== undefined) {
                setIsCorrect(data.correct);
                if (data.points) setPointsEarned(data.points);
            }

            if (!res.ok && data.error) {
                const errorMsg = data.error || data.message || '';
                if (errorMsg.includes('User tidak ditemukan')) {
                    localStorage.removeItem('game-storage');
                    window.location.reload();
                }
            }
        } catch (err) {
            console.error('Failed to submit answer');
        }
    };

    if (isLoading || !question) return (
        <div style={{ minHeight: 'calc(100vh - 90px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ padding: '24px 40px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '2px' }}>MEMUAT SOAL...</div>
            </div>
        </div>
    );

    // Bug Fix 2: isTimedOut is everything needed to lock UI (timer = 0)
    const isTimedOut = timer === 0;
    // Show result feedback when: user submitted AND (timer is up OR there's a result from server)
    const showFeedback = isSubmitted && isCorrect !== null;
    // Show "no answer" message when time ran out and user didn't answer
    const showNoAnswer = isTimedOut && !isSubmitted;

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
            {/* Header: Timer + Question counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                    className={`timer-circle${timer <= 3 ? ' urgent' : ''}`}
                    style={{ width: '56px', height: '56px' }}
                >
                    <div className="timer-num" style={{ fontSize: '24px' }}>{timer}</div>
                    <div className="timer-label">SECS</div>
                </div>
                <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>
                        PERTANYAAN {currentQuestion} / 10
                    </div>
                    {isTimedOut && (
                        <div style={{
                            background: '#e53935',
                            color: 'white',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 10px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            marginTop: '4px',
                            letterSpacing: '1px',
                        }}>
                            WAKTU HABIS!
                        </div>
                    )}
                </div>
            </div>

            {/* Question Card */}
            <div className="card card-navy" style={{ padding: '20px' }}>
                <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '18px',
                    fontWeight: 700,
                    lineHeight: 1.5,
                    color: 'var(--white)',
                }}>
                    {question.text}
                </p>
            </div>

            {/* Bug Fix 3: Show waiting screen when time is up */}
            {isTimedOut ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Options (locked, show selection if any) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', opacity: 0.6 }}>
                        {question.options.map((opt, idx) => {
                            const isThisSelected = selectedOption === idx;
                            let optClass = 'trivia-opt';
                            if (isThisSelected) {
                                optClass += showFeedback
                                    ? (isCorrect === true ? ' correct' : ' wrong')
                                    : ' selected';
                            }
                            return (
                                <button
                                    key={idx}
                                    className={optClass}
                                    disabled={true}
                                    style={{ cursor: 'not-allowed' }}
                                >
                                    <span className="opt-letter">{OPTION_LETTERS[idx]}</span>
                                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px' }}>{opt}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Feedback card */}
                    {showFeedback && (
                        <div className="card" style={{
                            background: isCorrect ? 'var(--lime)' : '#e53935',
                            textAlign: 'center',
                            padding: '16px',
                            animation: 'fadeIn 0.5s ease-out',
                        }}>
                            <div style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '24px',
                                letterSpacing: '2px',
                                color: isCorrect ? 'var(--black)' : 'var(--white)',
                            }}>
                                {isCorrect ? `✔ BENAR! +${pointsEarned} AIR 💧` : '✘ JAWABAN SALAH!'}
                            </div>
                            <div style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                                color: isCorrect ? '#444' : 'rgba(255,255,255,0.8)',
                                marginTop: '4px',
                            }}>
                                {isCorrect ? 'Poin air kamu bertambah. Keren!' : 'Jangan menyerah, coba soal berikutnya!'}
                            </div>
                        </div>
                    )}

                    {/* No answer */}
                    {showNoAnswer && (
                        <div className="card" style={{ textAlign: 'center', padding: '16px', background: '#f0f0f0' }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '1px', color: '#333' }}>
                                ⏰ WAKTU HABIS!
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#666', letterSpacing: '1px', marginTop: '6px' }}>
                                KAMU TIDAK MEMILIH JAWABAN
                            </div>
                        </div>
                    )}

                    {/* Waiting for next question screen */}
                    <div className="card" style={{
                        textAlign: 'center',
                        padding: '20px 16px',
                        background: 'var(--navy-dark)',
                        animation: 'fadeIn 0.6s ease-out',
                        border: '3px solid var(--black)',
                        boxShadow: '4px 4px 0 var(--black)',
                    }}>
                        <div style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '18px',
                            letterSpacing: '2px',
                            color: 'var(--yellow)',
                            marginBottom: '8px',
                        }}>
                            ⏳ MENUNGGU SOAL BERIKUTNYA
                        </div>
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '1px',
                        }}>
                            ADMIN SEDANG MENYIAPKAN PERTANYAAN SELANJUTNYA...
                        </div>
                        {/* Pulsing dots indicator */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
                            {[0, 1, 2].map(i => (
                                <div key={i} style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: 'var(--yellow)',
                                    animation: `pulse-glow 1.2s ease-in-out ${i * 0.3}s infinite`,
                                }} />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* Active question — options are selectable while timer > 0 */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {question.options.map((opt, idx) => {
                        const isThisSelected = selectedOption === idx;
                        let optClass = 'trivia-opt';
                        if (isThisSelected) {
                            // If they answered, show their selection; feedback comes when timer hits 0
                            optClass += ' selected';
                        }
                        return (
                            <button
                                key={idx}
                                className={optClass}
                                // Bug Fix 1: disabled when submitted (already picked) or timer=0
                                onClick={() => handleSelect(idx)}
                                disabled={isSubmitted}
                            >
                                <span className="opt-letter">{OPTION_LETTERS[idx]}</span>
                                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px' }}>{opt}</span>
                            </button>
                        );
                    })}

                    {/* "Answer submitted, waiting for timer" message */}
                    {isSubmitted && !isTimedOut && (
                        <div className="card" style={{
                            textAlign: 'center',
                            padding: '14px 16px',
                            background: 'var(--yellow)',
                            border: '3px solid var(--black)',
                            boxShadow: '3px 3px 0 var(--black)',
                            animation: 'pop-in 0.3s ease-out',
                        }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '1px', color: 'var(--black)' }}>
                                ✔ JAWABAN TERKUNCI!
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#555', marginTop: '4px', letterSpacing: '1px' }}>
                                TUNGGU TIMER HABIS UNTUK MELIHAT HASIL
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
