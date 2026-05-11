import { PrismaService } from './prisma.service';
export declare class VoteService {
    private prisma;
    constructor(prisma: PrismaService);
    vote(userId: string, candidateId: string, category: string): Promise<{
        candidate: {
            id: string;
            name: string;
            division: string;
            type: string;
            imageUrl: string;
        };
    } & {
        id: string;
        userId: string;
        candidateId: string;
        category: string;
    }>;
    getResults(category: string): Promise<{
        name: string;
        count: number;
        id?: undefined;
    } | {
        id: string;
        name: string;
        count: number;
    }>;
    getAllStats(category: string): Promise<{
        items: {
            id: string;
            name: string;
            division: string;
            imageUrl: string;
            count: number;
        }[];
        metadata: {
            totalVoters: number;
            votedCount: number;
            voterNames: string[];
            percentage: number;
        };
    }>;
}
