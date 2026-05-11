import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { }

  getHello(): string {
    return 'X-Celerate API v1.0';
  }

  async getLeaderboard() {
    const topUsers = await this.prisma.user.findMany({
      where: { isJoined: true, isAdmin: false },
      orderBy: {
        contributedWater: 'desc',
      },
      take: 10,
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
      amount: u.contributedWater,
      score: u.score
    }));
  }
}
