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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const session_service_1 = require("./session.service");
let AuthService = class AuthService {
    prisma;
    session;
    constructor(prisma, session) {
        this.prisma = prisma;
        this.session = session;
    }
    async login(pin) {
        const user = await this.prisma.user.findUnique({
            where: { pin },
            include: { votes: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('PIN tidak ditemukan');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { isJoined: true },
        });
        const sessionState = this.session.getState();
        const voteTeam = user.votes?.find((v) => v.category === 'team')?.candidateId || null;
        const voteDigi = user.votes?.find((v) => v.category === 'digimer')?.candidateId || null;
        return {
            user: {
                id: user.id,
                name: user.name,
                pin: user.pin,
                division: user.division,
                isAdmin: user.isAdmin,
                collectedWater: user.collectedWater,
                contributedWater: user.contributedWater,
                voteTeam,
                voteDigi,
            },
            session: sessionState,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        session_service_1.SessionService])
], AuthService);
//# sourceMappingURL=auth.service.js.map