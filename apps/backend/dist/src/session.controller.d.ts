import { SessionService, GamePhase } from './session.service';
import { TriviaService } from './trivia.service';
export declare class SessionController {
    private session;
    private trivia;
    constructor(session: SessionService, trivia: TriviaService);
    updatePhase(body: {
        phase: GamePhase;
    }): Promise<void>;
    startTrivia(): Promise<void>;
    nextQuestion(): Promise<void>;
    reset(): Promise<void>;
    getTriviaStats(index: string): Promise<{
        totalUsers: number;
        totalAnswers: number;
        stats: never[];
        questionText: string;
        questionIndex?: undefined;
        options?: undefined;
        correctAnswer?: undefined;
    } | {
        questionIndex: number;
        questionText: string;
        options: never[];
        correctAnswer: number;
        totalUsers: number;
        totalAnswers: number;
        stats: {
            option: number | null;
            count: number;
        }[];
    }>;
}
