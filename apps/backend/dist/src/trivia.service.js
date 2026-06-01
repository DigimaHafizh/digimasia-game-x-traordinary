"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TriviaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriviaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const session_service_1 = require("./session.service");
let TriviaService = TriviaService_1 = class TriviaService {
    prisma;
    session;
    logger = new common_1.Logger(TriviaService_1.name);
    timerInstance = null;
    constructor(prisma, session) {
        this.prisma = prisma;
        this.session = session;
    }
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
            if (this.timerInstance)
                clearInterval(this.timerInstance);
            return;
        }
        Object.assign(this.session.state, {
            currentQuestion: nextQ,
            timer: 10
        });
        this.session.onStateChange(this.session.getState());
        this.startTimer();
    }
    startTimer() {
        if (this.timerInstance)
            clearInterval(this.timerInstance);
        this.timerInstance = setInterval(async () => {
            const state = this.session.getState();
            if (state.timer > 0) {
                Object.assign(this.session.state, { timer: state.timer - 1 });
                this.session.onStateChange(this.session.getState());
            }
            else {
                if (this.timerInstance)
                    clearInterval(this.timerInstance);
                this.logger.log(`Question ${state.currentQuestion} timer expired. Waiting for Admin.`);
                if (state.currentQuestion >= 10) {
                    this.logger.log('Last question finished. Auto-transitioning to Leaderboard in 1.5 seconds.');
                    setTimeout(async () => {
                        await this.session.updatePhase('TRANSITION');
                    }, 1500);
                }
            }
        }, 1000);
    }
    async submitAnswer(userId, questionIndex, optionIndex) {
        return await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user)
                return { error: 'User tidak ditemukan' };
            const question = await tx.question.findUnique({
                where: { index: questionIndex },
            });
            if (!question)
                return { error: 'Soal tidak ditemukan' };
            const isCorrect = question.answer === optionIndex;
            const previousAnswer = await tx.userAnswer.findUnique({
                where: { userId_questionId: { userId, questionId: question.id } }
            });
            const wasCorrect = previousAnswer?.isCorrect || false;
            const currentAnswer = await tx.userAnswer.upsert({
                where: {
                    userId_questionId: { userId, questionId: question.id }
                },
                update: { selected: optionIndex, isCorrect },
                create: { userId, questionId: question.id, selected: optionIndex, isCorrect },
            });
            let pointsEarned = 0;
            if (isCorrect && !wasCorrect) {
                const currentTimer = this.session.getState().timer;
                pointsEarned = 10 + (currentTimer > 0 ? currentTimer : 0);
                await tx.user.update({
                    where: { id: userId },
                    data: {
                        collectedWater: { increment: pointsEarned },
                        score: { increment: pointsEarned },
                    }
                });
            }
            else if (!isCorrect && wasCorrect) {
                await tx.user.update({
                    where: { id: userId },
                    data: {
                        collectedWater: { decrement: 10 },
                        score: { decrement: 10 },
                    }
                });
            }
            return { correct: isCorrect, points: pointsEarned };
        });
    }
    async getStats(questionIndex) {
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
        }
        catch (e) { }
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
};
exports.TriviaService = TriviaService;
exports.TriviaService = TriviaService = TriviaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        session_service_1.SessionService])
], TriviaService);
//# sourceMappingURL=trivia.service.js.map