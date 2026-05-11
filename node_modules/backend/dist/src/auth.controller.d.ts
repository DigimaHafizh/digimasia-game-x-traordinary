import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: {
        pin: string;
    }): Promise<{
        user: {
            id: string;
            name: string;
            pin: string;
            division: string;
            isAdmin: boolean;
            collectedWater: number;
            contributedWater: number;
            voteTeam: string | null;
            voteDigi: string | null;
        };
        session: {
            phase: import("./session.service").GamePhase;
            currentQuestion: number;
            timer: number;
            treeStage: number;
            totalWater: number;
        };
    }>;
}
