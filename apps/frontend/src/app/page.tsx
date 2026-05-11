'use client';

import { useGameStore } from '@/store/useGameStore';
import { useSocket } from '@/hooks/useSocket';
import styles from './page.module.css';
import Login from './Login';
import Vote from './Vote';
import Trivia from './Trivia';
import Tree from './Tree';
import Final from './Final';

export default function Home() {
  const { user, phase, treeStage } = useGameStore();

  // Initialize Socket Connection
  useSocket();

  if (!user) {
    return (
      <main className={styles.userMain}>
        <Login />
      </main>
    );
  }

  // Phase Handling
  switch (phase) {
    case 'LOGIN':
    case 'WAITING':
      return (
        <main className={styles.userMain}>
          <div className="glass" style={{ padding: '3rem', textAlign: 'center', maxWidth: '450px' }}>
            <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Welcome, {user.name}!
            </h1>
            <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
              Divisi: {user.division}
            </p>
            <div className={styles.waitingIcon}>
              <div className="pulse-dot"></div>
            </div>
            <p style={{ fontWeight: 600, letterSpacing: '0.5px' }}>
              MENUNGGU INSTRUKSI ADMIN...
            </p>
            <p style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '2rem' }}>
              Game akan dimulai segera. Jangan tutup halaman ini.
            </p>
          </div>
        </main>
      );

    case 'VOTING_TEAM':
      return (
        <main className={styles.userMain}>
          <Vote type="team" />
        </main>
      );

    case 'VOTING_DIGIMER':
      return (
        <main className={styles.userMain}>
          <Vote type="digimer" />
        </main>
      );

    case 'TRIVIA':
      return (
        <main className={styles.userMain}>
          <Trivia />
        </main>
      );

    case 'TRANSITION':
      return (
        <main className={styles.userMain}>
          <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
            <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Trivia Selesai!
            </h1>
            <p style={{ opacity: 0.7 }}>Siapkan jarimu untuk fase berikutnya...</p>
            <div className={styles.waitingIcon}>
              <div className="pulse-dot"></div>
            </div>
            <h2 style={{ letterSpacing: '2px' }}>GET READY TO WATER THE TREE!</h2>
          </div>
        </main>
      );

    case 'WATERING':
      if (treeStage >= 4) {
        return (
          <main className={styles.userMain}>
            <Final />
          </main>
        );
      }
      return (
        <main className={styles.userMain}>
          <Tree />
        </main>
      );

    case 'FINAL':
      return (
        <main className={styles.userMain}>
          <Final />
        </main>
      );

    default:
      return (
        <main className={styles.userMain}>
          <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 className="gradient-text" style={{ marginBottom: '1rem' }}>Sesi Dimulai!</h2>
            <p>Phase: <strong>{phase}</strong></p>
            <p style={{ marginTop: '1rem', opacity: 0.7 }}>Fitur sedang diaktifkan oleh admin...</p>
          </div>
        </main>
      );
  }
}
