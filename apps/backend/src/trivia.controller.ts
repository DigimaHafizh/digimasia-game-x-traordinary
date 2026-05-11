import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TriviaService } from './trivia.service';
import { PrismaService } from './prisma.service';

@Controller()
export class TriviaController {
    constructor(
        private triviaService: TriviaService,
        private prisma: PrismaService,
    ) { }

    @Get('trivia-question/:index')
    async getQuestion(@Param('index') index: string) {
        const q = await this.prisma.question.findUnique({
            where: { index: parseInt(index) },
        });

        if (!q) return { error: 'Not found' };

        // Jangan kirim jawaban asli ke client
        const { answer, ...rest } = q;
        return rest;
    }

    @Post('trivia-answer')
    async submitAnswer(
        @Body() body: { userId: string; questionIndex: number; optionIndex: number },
    ) {
        return this.triviaService.submitAnswer(
            body.userId,
            body.questionIndex,
            body.optionIndex,
        );
    }
}
