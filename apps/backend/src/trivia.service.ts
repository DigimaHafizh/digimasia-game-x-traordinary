import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SessionService } from './session.service';

@Injectable()
export class TriviaService {
    private readonly logger = new Logger(TriviaService.name);
    private timerInstance: NodeJS.Timeout | null = null;

    constructor(
        private prisma: PrismaService,
        private session: SessionService,
    ) { }

    async startTrivia() {
        this.logger.log('Starting Trivia Phase');
        await this.session.updatePhase('TRIVIA');
        await this.nextQuestion();
    }

    async nextQuestion() {
        const currentState = this.session.getState();
        const nextQ = currentState.currentQuestion + 1;

        if (nextQ > 10) {
            this.logger.log('Trivia Finished');
            await this.session.updatePhase('TRANSITION');
            if (this.timerInstance) clearInterval(this.timerInstance);
            return;
        }

        // Update state to next question
        Object.assign((this.session as any).state, {
            currentQuestion: nextQ,
            timer: 10
        });
        this.session.onStateChange(this.session.getState());

        this.startTimer();
    }

    private startTimer() {
        if (this.timerInstance) clearInterval(this.timerInstance);

        this.timerInstance = setInterval(async () => {
            const state = this.session.getState();
            if (state.timer > 0) {
                Object.assign((this.session as any).state, { timer: state.timer - 1 });
                this.session.onStateChange(this.session.getState());
            } else {
                // STOP TIMER at 0. Waiting for Admin to click "Next"
                if (this.timerInstance) clearInterval(this.timerInstance);
                this.logger.log(`Question ${state.currentQuestion} timer expired. Waiting for Admin.`);

                // If it's the last question, automatically transition to Leaderboard after 5 seconds
                if (state.currentQuestion >= 10) {
                    this.logger.log('Last question finished. Auto-transitioning to Leaderboard in 5 seconds.');
                    setTimeout(async () => {
                        await this.session.updatePhase('TRANSITION');
                    }, 5000);
                }
            }
        }, 1000);
    }

    async submitAnswer(userId: string, questionIndex: number, optionIndex: number) {
        return await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) return { error: 'User tidak ditemukan' };

            const question = await tx.question.findUnique({
                where: { index: questionIndex },
            });
            if (!question) return { error: 'Soal tidak ditemukan' };

            const isCorrect = question.answer === optionIndex;

            // Cari jawaban sebelumnya
            const previousAnswer = await tx.userAnswer.findUnique({
                where: { userId_questionId: { userId, questionId: question.id } }
            });

            const wasCorrect = previousAnswer?.isCorrect || false;

            // Simpan/Update jawaban
            const currentAnswer = await tx.userAnswer.upsert({
                where: {
                    userId_questionId: { userId, questionId: question.id }
                },
                update: { selected: optionIndex, isCorrect },
                create: { userId, questionId: question.id, selected: optionIndex, isCorrect },
            });

            // Logic Reward (hanya jika ada perubahan status kebenaran)
            let pointsEarned = 0;
            if (isCorrect && !wasCorrect) {
                // Calculate speed bonus based on current timer state
                const currentTimer = this.session.getState().timer;
                pointsEarned = 10 + (currentTimer > 0 ? currentTimer : 0);

                await tx.user.update({
                    where: { id: userId },
                    data: {
                        collectedWater: { increment: pointsEarned },
                        contributedWater: { increment: pointsEarned },
                        score: { increment: pointsEarned },
                    }
                });
                // Update global tree state INSIDE transaction
                await this.session.incrementWaterInTransaction(tx, pointsEarned);
            } else if (!isCorrect && wasCorrect) {
                // If they somehow change from correct to wrong, assume standard 10 deduction to be safe.
                // Normally UI blocks multiple submissions, so this relies on basic 10 point assumption.
                await tx.user.update({
                    where: { id: userId },
                    data: {
                        collectedWater: { decrement: 10 },
                        contributedWater: { decrement: 10 },
                        score: { decrement: 10 },
                    }
                });
                // Update global tree state INSIDE transaction
                await this.session.incrementWaterInTransaction(tx, -10);
            }

            return { correct: isCorrect, points: pointsEarned };
        });
    }

    async getStats(questionIndex: number) {
        this.logger.log(`GetStats for Q ${questionIndex}`);
        const question = await this.prisma.question.findUnique({
            where: { index: questionIndex },
        });

        if (!question) {
            this.logger.warn(`GetStats: Question index ${questionIndex} not found in DB`);
            return { totalUsers: 0, totalAnswers: 0, stats: [], questionText: '' };
        }

        const answers = await this.prisma.userAnswer.groupBy({
            by: ['selected'],
            where: { questionId: question.id },
            _count: { id: true },
        });

        const totalUsers = await this.prisma.user.count({
            where: { isJoined: true, isAdmin: false }
        });
        const totalAnswers = await this.prisma.userAnswer.count({
            where: { questionId: question.id }
        });

        let parsedOptions = [];
        try {
            parsedOptions = JSON.parse(question.options);
        } catch (e) { }

        return {
            questionIndex,
            questionText: question.text,
            options: parsedOptions,
            correctAnswer: question.answer,
            totalUsers,
            totalAnswers,
            stats: answers.map(a => ({
                option: a.selected,
                count: a._count.id
            }))
        };
    }
}
