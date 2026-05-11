import { PrismaService } from './prisma.service';
export declare class UserController {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(id: string): Promise<{
        id: string;
        collectedWater: number;
        contributedWater: number;
        score: number;
    } | null>;
}
