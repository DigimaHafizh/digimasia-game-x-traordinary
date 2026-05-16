'use client';

import NomineeMonitor from '@/components/NomineeMonitor';
import { useSocket } from '@/hooks/useSocket';

export default function VotingMonitoringPage() {
    useSocket();
    return (
        <div style={{ minHeight: 'calc(100vh - 90px)', padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', letterSpacing: '4px', color: 'var(--yellow)', textShadow: '4px 4px 0 var(--black)' }}>
                    LIVE VOTING MONITOR
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--white)', letterSpacing: '3px', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <span className="live-dot" /> X-TRAORDINARY — GROW WITH HEART : REAL-TIME PARTICIPATION
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="card" style={{ padding: '20px' }}>
                    <div className="section-label">👥 TEAM NOMINEES</div>
                    <NomineeMonitor category="team" />
                </div>
                <div className="card" style={{ padding: '20px' }}>
                    <div className="section-label" style={{ background: 'var(--blue-bright)' }}>🌟 DIGIMER NOMINEES</div>
                    <NomineeMonitor category="digimer" />
                </div>
            </div>
        </div>
    );
}
