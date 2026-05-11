import { TriviaService } from './trivia.service';
import { PrismaService } from './prisma.service';
export declare class TriviaController {
    private triviaService;
    private prisma;
    constructor(triviaService: TriviaService, prisma: PrismaService);
    getQuestion(index: string): Promise<{
        id: string;
        index: number;
        text: string;
        options: string;
    } | {
        error: string;
    }>;
    submitAnswer(body: {
        userId: string;
        questionIndex: number;
        optionIndex: number;
    }): Promise<{
        error: string;
        correct?: undefined;
        points?: undefined;
    } | {
        correct: boolean;
        points: number;
        error?: undefined;
    }>;
}
