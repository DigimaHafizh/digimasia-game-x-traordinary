'use client';

import React from 'react';

interface TreeVisualProps {
    stage: number;
    size?: number | string;
    isAnimated?: boolean;
}

export default function TreeVisual({ stage, size = '100%', isAnimated = true }: TreeVisualProps) {
    // Normalize stage 0-4
    const currentStage = Math.min(Math.max(stage, 0), 4);

    return (
        <div style={{
            width: size,
            height: size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        }}>
            <svg
                viewBox="0 0 200 200"
                width="100%"
                height="100%"
                style={{
                    filter: currentStage === 4 ? 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.4))' : 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.2))',
                    transition: 'all 1s ease-in-out'
                }}
            >
                {/* Stage 0: THE SEED */}
                {currentStage === 0 && (
                    <g className={isAnimated ? "jump" : ""}>
                        <circle cx="100" cy="160" r="8" fill="#8B4513" />
                        <path d="M100 160 Q 110 150 105 145" stroke="#4ade80" strokeWidth="2" fill="none" />
                        <circle cx="100" cy="160" r="12" fill="rgba(34, 197, 94, 0.2)" />
                    </g>
                )}

                {/* Stage 1: THE SPROUT */}
                {currentStage === 1 && (
                    <g>
                        <path d="M100 170 L 100 140" stroke="#8B4513" strokeWidth="4" strokeLinecap="round" />
                        <path d="M100 145 Q 120 125 130 140 Q 115 150 100 145" fill="#4ade80" />
                        <path d="M100 150 Q 80 130 70 145 Q 85 155 100 150" fill="#22c55e" />
                    </g>
                )}

                {/* Stage 2: YOUNG TREE */}
                {currentStage === 2 && (
                    <g>
                        <path d="M100 180 L 100 120" stroke="#5D4037" strokeWidth="8" strokeLinecap="round" />
                        <circle cx="100" cy="110" r="40" fill="#4ade80" opacity="0.8" />
                        <circle cx="85" cy="100" r="30" fill="#22c55e" />
                        <circle cx="115" cy="100" r="30" fill="#16a34a" />
                    </g>
                )}

                {/* Stage 3: MATURE TREE */}
                {currentStage === 3 && (
                    <g>
                        <path d="M100 185 L 100 100" stroke="#3E2723" strokeWidth="12" strokeLinecap="round" />
                        <path d="M100 120 L 70 90" stroke="#3E2723" strokeWidth="6" strokeLinecap="round" />
                        <path d="M100 130 L 130 100" stroke="#3E2723" strokeWidth="6" strokeLinecap="round" />
                        <circle cx="100" cy="80" r="50" fill="#16a34a" />
                        <circle cx="70" cy="90" r="40" fill="#22c55e" />
                        <circle cx="130" cy="90" r="40" fill="#15803d" />
                        <circle cx="100" cy="60" r="35" fill="#4ade80" opacity="0.9" />
                    </g>
                )}

                {/* Stage 4: GRAND TREE (GOLDEN) */}
                {currentStage === 4 && (
                    <g className={isAnimated ? "float" : ""}>
                        {/* Trunk */}
                        <path d="M100 190 L 100 80" stroke="#5D4037" strokeWidth="16" strokeLinecap="round" />

                        {/* Layers of Foliage with Gold Accents */}
                        <circle cx="100" cy="70" r="60" fill="url(#goldGrad)" style={{ filter: 'blur(2px)' }} />
                        <circle cx="60" cy="100" r="50" fill="#15803d" />
                        <circle cx="140" cy="100" r="50" fill="#15803d" />
                        <circle cx="100" cy="50" r="45" fill="gold" opacity="0.6" />
                        <circle cx="80" cy="80" r="45" fill="url(#goldGrad)" />
                        <circle cx="120" cy="80" r="45" fill="url(#goldGrad)" />

                        {/* Sparkling Stars */}
                        <circle cx="70" cy="50" r="2" fill="white" className="blink" />
                        <circle cx="130" cy="40" r="2" fill="white" className="blink" style={{ animationDelay: '0.5s' }} />
                        <circle cx="100" cy="20" r="3" fill="gold" className="blink" style={{ animationDelay: '1.2s' }} />

                        <defs>
                            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#ffd700', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#b8860b', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                    </g>
                )}
            </svg>

            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        @keyframes jump {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.5); box-shadow: 0 0 10px white; }
        }
        .float { animation: float 3s ease-in-out infinite; }
        .jump { animation: jump 1.5s ease-in-out infinite; }
        .blink { animation: blink 2s ease-in-out infinite; }
      `}</style>
        </div>
    );
}
