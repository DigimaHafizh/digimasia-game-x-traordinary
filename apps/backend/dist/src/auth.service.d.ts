import { PrismaService } from './prisma.service';
import { SessionService } from './session.service';
export declare class AuthService {
    private prisma;
    private session;
    constructor(prisma: PrismaService, session: SessionService);
    login(pin: string): Promise<{
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
