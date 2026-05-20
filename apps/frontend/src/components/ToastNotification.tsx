'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';

export default function ToastNotification() {
    const { toastMessage, setToastMessage } = useGameStore();

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => {
                setToastMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage, setToastMessage]);

    if (!toastMessage) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            background: '#FFD600',
            border: '5px solid var(--black)',
            boxShadow: '10px 10px 0 var(--black)',
            padding: '20px 32px',
            borderRadius: '0px', // Square for more brutalist look
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            color: 'var(--black)',
            letterSpacing: '2px',
            animation: 'toast-pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            textAlign: 'center',
            minWidth: '380px',
            maxWidth: '95vw'
        }}>
            <div style={{
                background: 'var(--pink-hot)',
                border: '4px solid var(--black)',
                transform: 'rotate(-5deg)',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: '4px 4px 0 var(--black)',
                animation: 'toast-icon-shake 0.5s ease-in-out infinite'
            }}>
                📢
            </div>
            <span style={{ paddingTop: '4px', textTransform: 'uppercase' }}>{toastMessage}</span>

            <style>{`
                @keyframes toast-pop-in {
                    0% { transform: translate(-50%, 100px) scale(0.5); opacity: 0; }
                    100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
                }
                @keyframes toast-icon-shake {
                    0%, 100% { transform: rotate(-5deg) scale(1); }
                    50% { transform: rotate(5deg) scale(1.1); }
                }
            `}</style>
        </div>
    );
}
