import { PrismaService } from './prisma.service';
export declare class AppService {
    private prisma;
    constructor(prisma: PrismaService);
    getHello(): string;
    getLeaderboard(): Promise<{
        name: string;
        division: string;
        amount: number;
        score: number;
    }[]>;
}
