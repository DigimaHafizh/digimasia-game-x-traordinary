import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';
export type GamePhase = 'LOGIN' | 'WAITING' | 'VOTING_TEAM' | 'VOTING_DIGIMER' | 'TRIVIA' | 'TRANSITION' | 'WATERING' | 'FINAL';
export declare class SessionService implements OnModuleInit {
    private prisma;
    private readonly logger;
    onStateChange: (state: any) => void;
    private state;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    getState(): {
        phase: GamePhase;
        currentQuestion: number;
        timer: number;
        treeStage: number;
        totalWater: number;
    };
    updatePhase(phase: GamePhase): Promise<void>;
    incrementWater(amount: number): Promise<void>;
    incrementWaterInTransaction(tx: any, amount: number): Promise<void>;
    private internalUpdateWater;
    reset(): Promise<void>;
    private saveToDb;
}
