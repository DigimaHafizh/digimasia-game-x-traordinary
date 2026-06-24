import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SessionService } from './session.service';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => SessionService))
    private session: SessionService,
  ) { }

  getHello(): string {
    return 'X-Celerate API v1.0';
  }

  async getSessionState() {
    return this.session.getState();
  }

  async getLeaderboard() {
    const currentState = this.session.getState();
    const isTriviaPhase = currentState.phase === 'TRIVIA' || currentState.phase === 'TRANSITION';

    const topUsers = await this.prisma.user.findMany({
      where: { isJoined: true, isAdmin: false },
      orderBy: isTriviaPhase ? { score: 'desc' } : { contributedWater: 'desc' },
      select: {
        name: true,
        division: true,
        contributedWater: true,
        score: true,
      }
    });

    return topUsers.map(u => ({
      name: u.name,
      division: u.division,
      // Pass score during Trivia phase so the UI reports the live scores
      amount: isTriviaPhase ? u.score : u.contributedWater,
      score: u.score
    }));
  }
}
