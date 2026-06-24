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
            timer: 15
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

                // AWARD 1L for Golput Users
                try {
                    const activeUsers = await this.prisma.user.findMany({ where: { isJoined: true, isAdmin: false } });
                    const question = await this.prisma.question.findUnique({ where: { index: state.currentQuestion } });
                    if (question) {
                        const answeredUsers = await this.prisma.userAnswer.findMany({ where: { questionId: question.id } });
                        const answeredIds = answeredUsers.map(a => a.userId);
                        const golputUserIds = activeUsers.filter(u => !answeredIds.includes(u.id)).map(u => u.id);

                        if (golputUserIds.length > 0) {
                            await this.prisma.user.updateMany({
                                where: { id: { in: golputUserIds } },
                                data: { collectedWater: { increment: 1 }, score: { increment: 1 } }
                            });
                            this.logger.log(`Awarded 1L (Golput) to ${golputUserIds.length} users.`);
                        }
                    }
                } catch (e) {
                    this.logger.error('Error awarding golput points:', e);
                }

                // If it's the last question, automatically transition to Leaderboard after 1.5 seconds
                if (state.currentQuestion >= 10) {
                    this.logger.log('Last question finished. Auto-transitioning to Leaderboard in 1.5 seconds.');
                    setTimeout(async () => {
                        await this.session.updatePhase('TRANSITION');
                    }, 1500);
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

            const hasAnswered = !!previousAnswer;
            const wasCorrect = previousAnswer?.isCorrect || false;

            // Simpan/Update jawaban
            const currentAnswer = await tx.userAnswer.upsert({
                where: {
                    userId_questionId: { userId, questionId: question.id }
                },
                update: { selected: optionIndex, isCorrect },
                create: { userId, questionId: question.id, selected: optionIndex, isCorrect },
            });

            let waterChange = 0;
            const currentTimer = this.session.getState().timer;
            const speedBonus = currentTimer > 0 ? currentTimer : 0;
            const rightPts = 10 + speedBonus;
            const wrongPts = 5;

            if (!hasAnswered) {
                waterChange = isCorrect ? rightPts : wrongPts;
            } else {
                if (isCorrect && !wasCorrect) {
                    waterChange = rightPts - wrongPts;
                } else if (!isCorrect && wasCorrect) {
                    waterChange = wrongPts - 10; // Simple deduction proxy
                }
            }

            if (waterChange !== 0) {
                await tx.user.update({
                    where: { id: userId },
                    data: {
                        collectedWater: { increment: waterChange },
                        score: { increment: waterChange },
                    }
                });
            }

            return { correct: isCorrect, points: Math.max(0, waterChange) };
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
