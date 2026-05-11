'use client';

import { useGameStore } from '@/store/useGameStore';
import styles from '../app/page.module.css';
import TreeVisual from './TreeVisual';

export default function TreeMonitor() {
    const { totalWater, treeStage } = useGameStore();

    const progress = (totalWater / 1000) * 100; // Assuming 1000L is target

    return (
        <div className="glass" style={{ padding: '2rem', textAlign: 'center', background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#22c55e', letterSpacing: '4px' }}>LIVE TREE INTERACTION</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', marginBottom: '2.5rem' }}>
                <div style={{ width: '150px', height: '150px' }}>
                    <TreeVisual stage={treeStage} />
                </div>

                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.9rem', opacity: 0.5, fontWeight: 700 }}>CURRENT STAGE</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>
                        {treeStage === 0 && 'SEEDS'}
                        {treeStage === 1 && 'SPROUT'}
                        {treeStage === 2 && 'YOUNG TREE'}
                        {treeStage === 3 && 'MATURE TREE'}
                        {treeStage >= 4 && 'GRAND TREE'}
                    </div>
                    <div style={{ marginTop: '0.5rem', fontSize: '1.2rem', fontWeight: 800, color: '#22c55e' }}>{totalWater} <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>LITERS CONTRIBUTED</span></div>
                </div>
            </div>

            <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{
                    width: `${Math.min(progress, 100)}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #22c55e, #4ade80)',
                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)',
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, opacity: 0.4 }}>
                <span>GROWTH PROGRESS</span>
                <span>{Math.round(progress)}% TO GRAND TREE</span>
            </div>
        </div>
    );
}
