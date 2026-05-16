'use client';

import { useGameStore } from '@/store/useGameStore';
import TreeVisual from '@/components/TreeVisual';

export default function Final() {
    const { totalWater } = useGameStore();

    return (
        <div style={{
            minHeight: 'calc(100vh - 90px)',
            padding: '24px',
            maxWidth: '600px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {/* Congratulations Card */}
            <div className="reveal-card" style={{ width: '100%', padding: '32px' }}>
                <div style={{ marginTop: '24px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)' }}>
                        DIGIMA ASIA · 10TH ANNIVERSARY
                    </div>
                    <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '52px',
                        letterSpacing: '3px',
                        color: 'var(--yellow)',
                        textShadow: '4px 4px 0px rgba(0,0,0,0.3)',
                        lineHeight: 1,
                        margin: '12px 0',
                    }}>
                        CONGRATULATIONS!
                    </div>
                    <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.5)',
                        letterSpacing: '2px',
                        marginBottom: '20px',
                    }}>
                        POHON BERHASIL TUMBUH MAKSIMAL 🌳✨
                    </div>
                </div>

                {/* Tree Visual */}
                <div style={{ width: '200px', height: '200px', margin: '0 auto 20px' }}>
                    <TreeVisual stage={4} />
                </div>

                {/* Total Water badge */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="badge badge-yellow" style={{ padding: '8px 20px', fontSize: '13px' }}>
                        💧 {totalWater} L AIR TERKUMPUL
                    </div>
                </div>

                <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '1px',
                    marginTop: '20px',
                }}>
                    TERIMA KASIH ATAS PARTISIPASI KAMU!
                </div>
            </div>
        </div>
    );
}
