import { PrismaService } from './prisma.service';
export declare class CandidateService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllByType(type: string): Promise<{
        id: string;
        name: string;
        division: string;
        type: string;
        imageUrl: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        division: string;
        type: string;
        imageUrl: string;
    } | null>;
}
