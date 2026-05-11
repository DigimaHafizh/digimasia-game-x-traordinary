import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export type GamePhase = 'LOGIN' | 'WAITING' | 'VOTING_TEAM' | 'VOTING_DIGIMER' | 'TRIVIA' | 'TRANSITION' | 'WATERING' | 'FINAL';

@Injectable()
export class SessionService implements OnModuleInit {
    private readonly logger = new Logger(SessionService.name);

    // Callback untuk broadcast (diisi oleh gateway)
    public onStateChange: (state: any) => void = () => { };

    private state = {
        phase: 'LOGIN' as GamePhase,
        currentQuestion: 0,
        timer: 0,
        treeStage: 0,
        totalWater: 0,
    };

    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        const session = await this.prisma.session.findUnique({
            where: { id: 'singleton' },
        });

        if (session) {
            this.state = {
                phase: session.phase as GamePhase,
                currentQuestion: session.currentQ,
                timer: 0,
                treeStage: session.treeStage,
                totalWater: session.totalWater,
            };
            this.logger.log(`Session loaded: Phase ${this.state.phase}`);
        }
    }

    getState() {
        return this.state;
    }

    async updatePhase(phase: GamePhase) {
        this.state.phase = phase;
        this.onStateChange(this.state);
        await this.saveToDb();
    }

    async incrementWater(amount: number) {
        this.state.totalWater += amount;
        await this.internalUpdateWater(this.state.totalWater);
    }

    async incrementWaterInTransaction(tx: any, amount: number) {
        // 1. Ambil data session terbaru dari DB dalam transaksi
        const session = await tx.session.findUnique({ where: { id: 'singleton' } });
        const newTotal = (session?.totalWater || 0) + amount;

        // 2. Update DB dalam transaksi (Max 4 stages, 250L per stage)
        const newStage = Math.min(4, Math.floor(newTotal / 250));
        await tx.session.update({
            where: { id: 'singleton' },
            data: {
                totalWater: newTotal,
                treeStage: newStage
            }
        });

        // 3. Update local state MEMORY agar sinkron dengan socket broadcast
        this.state.totalWater = newTotal;
        this.state.treeStage = newStage;
        this.onStateChange(this.state);
    }

    private async internalUpdateWater(total: number) {
        const newStage = Math.min(4, Math.floor(total / 250));
        if (this.state.treeStage !== newStage) {
            this.state.treeStage = newStage;
        }

        this.onStateChange(this.state);
        await this.saveToDb();
    }

    async reset() {
        this.state = {
            phase: 'LOGIN',
            currentQuestion: 0,
            timer: 0,
            treeStage: 0,
            totalWater: 0,
        };
        this.onStateChange(this.state);
        await this.saveToDb();

        // Clean up DB
        await this.prisma.vote.deleteMany();
        await this.prisma.userAnswer.deleteMany();

        // Reset user progress instead of deleting them
        await this.prisma.user.updateMany({
            data: {
                collectedWater: 0,
                contributedWater: 0,
                score: 0,
                isJoined: false
            }
        });
    }

    private async saveToDb() {
        try {
            await this.prisma.session.update({
                where: { id: 'singleton' },
                data: {
                    phase: this.state.phase,
                    currentQ: this.state.currentQuestion,
                    totalWater: this.state.totalWater,
                    treeStage: this.state.treeStage,
                },
            });
        } catch (e) {
            this.logger.error('Failed to sync session with DB', e);
        }
    }
}
