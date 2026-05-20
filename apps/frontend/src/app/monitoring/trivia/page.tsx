'use client';

import TriviaMonitor from '@/components/TriviaMonitor';
import { useSocket } from '@/hooks/useSocket';
import TVFrame from '@/components/TVFrame';

export default function TriviaMonitoringPage() {
    useSocket();
    return (
        <TVFrame bgImage="/assets/branding/BG2.png">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '4px', color: 'var(--yellow)', textShadow: '3px 3px 0 var(--black)' }}>
                        LIVE TRIVIA MONITOR
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(10px, 1.2vw, 14px)', color: 'var(--white)', letterSpacing: '3px', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <span className="live-dot" style={{ width: '8px', height: '8px', background: 'red', borderRadius: '50%', animation: 'blink 1.5s infinite' }} /> X-TRAORDINARY — GROW WITH HEART : TOP CONTRIBUTORS
                    </div>
                </div>
                <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', flex: 1, minHeight: 0, overflowY: 'auto' }}>
                    <TriviaMonitor />
                </div>
            </div>
        </TVFrame>
    );
}
