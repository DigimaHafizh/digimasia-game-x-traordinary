import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('users')
export class UserController {
    constructor(private prisma: PrismaService) { }

    @Get(':id/stats')
    async getStats(@Param('id') id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                collectedWater: true,
                contributedWater: true,
                score: true,
            }
        });
    }
}
