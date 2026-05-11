import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class CandidateService {
    constructor(private prisma: PrismaService) { }

    async findAllByType(type: string) {
        return this.prisma.candidate.findMany({
            where: { type },
        });
    }

    async findOne(id: string) {
        return this.prisma.candidate.findUnique({
            where: { id },
        });
    }
}
