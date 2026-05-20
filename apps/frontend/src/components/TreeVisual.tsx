'use client';

import React from 'react';
import Image from 'next/image';

interface TreeVisualProps {
    stage: number;
    size?: number | string;
    isAnimated?: boolean;
}

// Maps stage 0-9 to the corresponding PNG asset
const TREE_IMAGES = [
    '/assets/branding/Pohon1.png',
    '/assets/branding/Pohon2.png',
    '/assets/branding/Pohon3.png',
    '/assets/branding/Pohon4.png',
    '/assets/branding/Pohon5.png',
    '/assets/branding/Pohon6.png',
    '/assets/branding/Pohon7.png',
    '/assets/branding/Pohon8.png',
    '/assets/branding/Pohon9.png',
    '/assets/branding/Pohon 10.png',
];

export const TREE_STAGE_LABELS = [
    'BENIH', 'KECAMBAH', 'TUNAS', 'BIBIT',
    'POHON MUDA', 'POHON REMAJA', 'POHON DEWASA',
    'POHON BESAR', 'POHON TUMBUH SUBUR', 'GRAND TREE 🏆',
];

export default function TreeVisual({ stage, size = '100%', isAnimated = true }: TreeVisualProps) {
    const currentStage = Math.min(Math.max(stage, 0), 9);
    const src = TREE_IMAGES[currentStage];

    return (
        <div style={{
            width: size,
            height: size,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <img
                key={currentStage}
                src={src}
                alt={`Tree Stage ${currentStage + 1}`}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'bottom',
                    animation: isAnimated ? 'treeEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both' : 'none',
                    filter: currentStage === 9 ? 'drop-shadow(0 0 20px rgba(255,215,0,0.5))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                    transition: 'filter 0.8s ease',
                }}
            />
            <style>{`
                @keyframes treeEntrance {
                    0% { transform: scale(0.7) translateY(20px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
