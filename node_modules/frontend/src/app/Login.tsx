'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import styles from './page.module.css';
import { getBackendUrl } from '@/lib/config';

const DIVISIONS = [
    'Creative',
    'Technology',
    'Account Management',
    'Marketing',
    'Finance',
    'Human Resources',
    'Strategy',
    'Operations',
];

export default function Login() {
    const [pin, setPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { setUser, setSessionState } = useGameStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pin.length !== 4) {
            setError('PIN harus 4 digit!');
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

            // Check if admin
            if (data.user.isAdmin) {
                // For admin, we might want to store user but redirect
                setUser(data.user);
                window.location.href = '/admin';
                return;
            }

            setUser(data.user);
            setSessionState(data.session);

            // Restore voting state if exists
            if (data.user.voteTeam || data.user.voteDigi) {
                useGameStore.getState().setUserState({
                    voteTeam: data.user.voteTeam,
                    voteDigi: data.user.voteDigi
                });
            }
        } catch (err: any) {
            setError(err.message || 'PIN tidak terdaftar');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').substring(0, 4);
        setPin(value);
    };

    return (
        <div className={styles.loginContainer}>
            <div className="glass" style={{ padding: '3rem', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
                <header style={{ marginBottom: '2.5rem' }}>
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        X-Celerate
                    </h1>
                    <p style={{ opacity: 0.7, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                        the Tree — 10th Anniversary
                    </p>
                </header>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className={styles.inputGroup}>
                        <label style={{ display: 'block', marginBottom: '1rem', fontSize: '1rem', fontWeight: 600, opacity: 0.8 }}>
                            MASUKKAN 4-DIGIT PIN AKSES
                        </label>
                        <input
                            type="password"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            className="input-field"
                            placeholder="• • • •"
                            value={pin}
                            onChange={handlePinChange}
                            disabled={isLoading}
                            style={{
                                textAlign: 'center',
                                fontSize: '2rem',
                                letterSpacing: '1rem',
                                paddingLeft: '1.5rem',
                                height: '70px',
                                borderRadius: '1.2rem'
                            }}
                        />
                    </div>

                    {error && <p style={{ color: '#ff4d4d', fontSize: '0.85rem', fontWeight: 600 }}>{error}</p>}

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1.2rem' }} disabled={isLoading || pin.length < 4}>
                        {isLoading ? 'MENGHUBUNGKAN...' : 'MASUK SEKARANG'}
                    </button>

                    <p style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: '1rem' }}>
                        Hubungi panitia jika Anda belum menerima PIN akses.
                    </p>
                </form>
            </div>
        </div>
    );
}
