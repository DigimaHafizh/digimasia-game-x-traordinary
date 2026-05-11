"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let VoteService = class VoteService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async vote(userId, candidateId, category) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.BadRequestException('User tidak ditemukan. Silakan login ulang.');
        }
        const existingVote = await this.prisma.vote.findUnique({
            where: {
                userId_category: {
                    userId,
                    category,
                },
            },
        });
        if (existingVote) {
            throw new common_1.BadRequestException(`Anda sudah melakukan voting di kategori ${category}`);
        }
        const vote = await this.prisma.vote.create({
            data: {
                userId,
                candidateId,
                category,
            },
            include: {
                candidate: true,
            },
        });
        return vote;
    }
    async getResults(category) {
        const results = await this.prisma.vote.groupBy({
            by: ['candidateId'],
            where: { category },
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
            take: 1,
        });
        if (results.length === 0)
            return { name: 'Belum ada suara', count: 0 };
        const winner = await this.prisma.candidate.findUnique({
            where: { id: results[0].candidateId },
        });
        return {
            id: winner?.id || '',
            name: winner?.name || 'Unknown',
            count: results[0]._count.id,
        };
    }
    async getAllStats(category) {
        const candidates = await this.prisma.candidate.findMany({
            where: { type: category }
        });
        const results = await this.prisma.vote.groupBy({
            by: ['candidateId'],
            where: { category },
            _count: { id: true },
        });
        const stats = candidates.map(cand => {
            const voteResult = results.find(r => r.candidateId === cand.id);
            return {
                id: cand.id,
                name: cand.name,
                division: cand.division,
                imageUrl: cand.imageUrl,
                count: voteResult?._count.id || 0
            };
        });
        const totalVoters = await this.prisma.user.count({
            where: { isJoined: true, isAdmin: false }
        });
        const votes = await this.prisma.vote.findMany({
            where: { category },
            include: { user: { select: { name: true } } }
        });
        const voterNames = votes.map(v => v.user.name);
        return {
            items: stats.sort((a, b) => b.count - a.count),
            metadata: {
                totalVoters,
                votedCount: voterNames.length,
                voterNames,
                percentage: totalVoters > 0 ? (voterNames.length / totalVoters) * 100 : 0
            }
        };
    }
};
exports.VoteService = VoteService;
exports.VoteService = VoteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VoteService);
//# sourceMappingURL=vote.service.js.map