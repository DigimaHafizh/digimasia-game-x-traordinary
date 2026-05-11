'use client';

import { useGameStore } from '@/store/useGameStore';
import styles from './page.module.css';
import TreeVisual from '@/components/TreeVisual';

export default function Final() {
    const { totalWater } = useGameStore();

    return (
        <div className={styles.finalWrapper}>
            <div className={styles.fireworks}>
                <div className="firework"></div>
                <div className="firework"></div>
                <div className="firework"></div>
            </div>

            <header style={{ textAlign: 'center', zIndex: 10 }}>
                <h1 className="gradient-text" style={{ fontSize: '3rem' }}>CONGRATULATIONS!</h1>
                <p style={{ opacity: 0.8, letterSpacing: '2px' }}>DIGIMA ASIA 10TH ANNIVERSARY</p>
            </header>

            <section className={styles.finalTreeSec}>
                <div style={{ width: '300px', height: '300px' }}>
                    <TreeVisual stage={4} />
                </div>
                <div className="glass" style={{ padding: '1rem 2rem', borderRadius: '2rem' }}>
                    Total Air Terkumpul: <strong>{totalWater} L</strong>
                </div>
            </section>

            <p style={{ textAlign: 'center', marginTop: '3rem', opacity: 0.5, fontSize: '1rem', fontWeight: 500 }}>
                Pohon Berhasil Tumbuh Maksimal! 🌳✨
            </p>

            <p style={{ textAlign: 'center', marginTop: '1rem', opacity: 0.5, fontSize: '0.8rem' }}>
                Terima kasih atas partisipasi Anda dalam X-Celerate the Tree!
            </p>
        </div>
    );
}
