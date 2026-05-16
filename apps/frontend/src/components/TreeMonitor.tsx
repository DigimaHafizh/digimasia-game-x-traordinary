'use client';

import { useGameStore } from '@/store/useGameStore';
import TreeVisual from './TreeVisual';

const STAGE_LABELS = ['SEEDS', 'SPROUT', 'YOUNG TREE', 'MATURE TREE', 'GRAND TREE'];

export default function TreeMonitor() {
    const { totalWater, treeStage } = useGameStore();
    const progress = Math.min(100, (totalWater / 1000) * 100);

    return (
        <div className="card" style={{ padding: '20px' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
            }}>
                <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '1px' }}>
                        LIVE TREE INTERACTION
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', letterSpacing: '1px' }}>
                        LIVE UPDATING
                    </div>
                </div>
                <span className="badge badge-green">
                    <span className="live-dot" /> LIVE
                </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
                {/* Tree visual */}
                <div style={{ width: '120px', height: '120px', flexShrink: 0 }}>
                    <TreeVisual stage={treeStage} />
                </div>

                {/* Stats */}
                <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', letterSpacing: '1px', marginBottom: '4px' }}>
                        CURRENT STAGE
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '2px', color: 'var(--black)', marginBottom: '8px' }}>
                        {STAGE_LABELS[Math.min(treeStage, 4)]}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'var(--blue-bright)', lineHeight: 1 }}>
                        {totalWater}L
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', letterSpacing: '1px' }}>
                        LITERS CONTRIBUTED
                    </div>
                </div>
            </div>

            {/* Progress */}
            <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', letterSpacing: '1px', marginTop: '4px' }}>
                <span>GROWTH PROGRESS</span>
                <span>{Math.round(progress)}% → GRAND TREE</span>
            </div>
        </div>
    );
}
