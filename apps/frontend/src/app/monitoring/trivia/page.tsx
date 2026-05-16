'use client';

import TriviaMonitor from '@/components/TriviaMonitor';
import LeaderboardWidget from '@/components/LeaderboardWidget';
import { useSocket } from '@/hooks/useSocket';

export default function TriviaMonitoringPage() {
    useSocket();
    return (
        <div style={{ minHeight: 'calc(100vh - 90px)', padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', letterSpacing: '4px', color: 'var(--yellow)', textShadow: '4px 4px 0 var(--black)' }}>
                    LIVE TRIVIA MONITOR
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--white)', letterSpacing: '3px', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <span className="live-dot" /> X-TRAORDINARY — GROW WITH HEART : TOP CONTRIBUTORS
                </div>
            </div>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <TriviaMonitor />
            </div>
        </div>
    );
}
