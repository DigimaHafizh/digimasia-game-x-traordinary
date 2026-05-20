'use client';

import WinnerAnnouncer from '@/components/WinnerAnnouncer';
import { useSocket } from '@/hooks/useSocket';
import TVFrame from '@/components/TVFrame';

export default function WinnerRevealPage() {
    useSocket();
    return (
        <TVFrame bgImage="/assets/branding/BG2.png">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                <WinnerAnnouncer />
            </div>
        </TVFrame>
    );
}
