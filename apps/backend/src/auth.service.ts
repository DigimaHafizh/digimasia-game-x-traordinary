import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private session: SessionService,
    ) { }

    async login(pin: string) {
        const user = await this.prisma.user.findUnique({
            where: { pin },
            include: { votes: true },
        });

        if (!user) {
            throw new UnauthorizedException('PIN tidak ditemukan');
        }

        // Tandai sebagai sudah join
        await this.prisma.user.update({
            where: { id: user.id },
            data: { isJoined: true },
        });

        // Ambil state session saat ini
        const sessionState = this.session.getState();

        // Map votes untuk memudahkan frontend
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
}
