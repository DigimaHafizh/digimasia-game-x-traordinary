'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import styles from './page.module.css';
import { getBackendUrl } from '@/lib/config';

interface Question {
    index: number;
    text: string;
    options: string[];
}

export default function Trivia() {
    const [question, setQuestion] = useState<Question | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { user, currentQuestion, timer } = useGameStore();

    useEffect(() => {
        const fetchQuestion = async () => {
            setIsLoading(true);
            try {
                const resQ = await fetch(`${getBackendUrl()}/trivia-question/${currentQuestion}`);
                const data = await resQ.json();
                setQuestion({
                    ...data,
                    options: JSON.parse(data.options)
                });
                setSelectedOption(null);
                setIsSubmitted(false);
                setIsCorrect(null);
            } catch (err) {
                console.error('Failed to fetch question');
            } finally {
                setIsLoading(false);
            }
        };

        if (currentQuestion > 0) fetchQuestion();
    }, [currentQuestion]);

    const handleSelect = async (optIdx: number) => {
        if (!user || !question || isSubmitted) return;

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

    if (isLoading || !question) return <div className={styles.main}><h3>Menghitung Hasil...</h3></div>;

    if (timer === 0) {
        const isFinalQuestion = currentQuestion >= 10;
        return (
            <div className={styles.triviaWrapper} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <div className="glass" style={{ padding: '3rem', textAlign: 'center', width: '100%' }}>
                    <h2 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
                        {isFinalQuestion ? 'Trivia Selesai!' : 'Waktu Habis!'}
                    </h2>
                    <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
                        {isFinalQuestion
                            ? 'Anda sudah menjawab semua pertanyaan. Sekarang kita lanjut ke fase selanjutnya!'
                            : 'Pilihan Anda sudah tersimpan. Harap fokus ke layar utama!'}
                    </p>

                    <div className={styles.waitingIcon}>
                        <div className="pulse-dot"></div>
                    </div>

                    <p style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '2rem', letterSpacing: '1px' }}>
                        {isFinalQuestion ? 'MENYIAPKAN FASE PENYIRAMAN...' : 'MENUNGGU SOAL BERIKUTNYA...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.triviaWrapper}>
            <header className={styles.triviaHeader}>
                <div className={styles.timerCircle} style={{ background: timer <= 3 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)' }}>
                    <span className={styles.timerText} style={{ color: timer <= 3 ? '#ef4444' : 'white' }}>{timer}</span>
                </div>
                <p className={styles.questionCounter}>Pertanyaan {currentQuestion} / 10</p>
            </header>

            <div className="glass" style={{ padding: '2rem', marginTop: '2rem' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '2rem', textAlign: 'center', lineHeight: '1.4' }}>
                    {question.text}
                </h2>

                <div className={styles.optionsGrid}>
                    {question.options.map((opt, idx) => {
                        const isThisSelected = selectedOption === idx;
                        let extraStyle = {};
                        if (isThisSelected && isCorrect === true) extraStyle = { border: '2px solid #22c55e', background: 'rgba(34, 197, 94, 0.2)' };
                        if (isThisSelected && isCorrect === false) extraStyle = { border: '2px solid #ef4444', background: 'rgba(239, 68, 68, 0.2)' };

                        return (
                            <button
                                key={idx}
                                className={`glass ${styles.optionBtn} ${isThisSelected ? styles.selected : ''}`}
                                onClick={() => handleSelect(idx)}
                                disabled={isSubmitted}
                                style={extraStyle}
                            >
                                <span className={styles.optionLabel}>{String.fromCharCode(65 + idx)}</span>
                                <span className={styles.optionContent}>{opt}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {selectedOption !== null && isCorrect !== null && (
                <div style={{
                    textAlign: 'center',
                    marginTop: '2rem',
                    padding: '1rem',
                    borderRadius: '1.5rem',
                    background: isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${isCorrect ? '#22c55e' : '#ef4444'}`,
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    <p style={{ fontWeight: 900, fontSize: '1.1rem', color: isCorrect ? '#22c55e' : '#ef4444', margin: 0 }}>
                        {isCorrect ? 'BENAR! +10 Air 💧' : 'YAH, JAWABAN SALAH! ❌'}
                    </p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.3rem' }}>
                        {isCorrect ? 'Poin Anda bertambah. Keren!' : 'Jangan menyerah, coba lagi di soal berikutnya!'}
                    </p>
                </div>
            )}
        </div>
    );
}
