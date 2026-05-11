import { PrismaService } from './prisma.service';
import { SessionService } from './session.service';
export declare class TriviaService {
    private prisma;
    private session;
    private readonly logger;
    private timerInstance;
    constructor(prisma: PrismaService, session: SessionService);
    startTrivia(): Promise<void>;
    nextQuestion(): Promise<void>;
    private startTimer;
    submitAnswer(userId: string, questionIndex: number, optionIndex: number): Promise<{
        error: string;
        correct?: undefined;
        points?: undefined;
    } | {
        correct: boolean;
        points: number;
        error?: undefined;
    }>;
    getStats(questionIndex: number): Promise<{
        totalUsers: number;
        totalAnswers: number;
        stats: never[];
        questionText: string;
        questionIndex?: undefined;
        correctAnswer?: undefined;
    } | {
        questionIndex: number;
        questionText: string;
        correctAnswer: number;
        totalUsers: number;
        totalAnswers: number;
        stats: {
            option: number | null;
            count: number;
        }[];
    }>;
}
