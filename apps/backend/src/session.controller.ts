import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { SessionService, GamePhase } from './session.service';
import { TriviaService } from './trivia.service';

@Controller('admin')
export class SessionController {
    constructor(
        private session: SessionService,
        private trivia: TriviaService,
    ) { }

    @Post('phase')
    async updatePhase(@Body() body: { phase: GamePhase }) {
        return this.session.updatePhase(body.phase);
    }

    @Post('start-trivia')
    async startTrivia() {
        return this.trivia.startTrivia();
    }

    @Post('next-question')
    async nextQuestion() {
        return this.trivia.nextQuestion();
    }

    @Post('reset')
    async reset() {
        return this.session.reset();
    }

    @Get('trivia-stats')
    async getTriviaStats(@Query('index') index: string) {
        return this.trivia.getStats(parseInt(index));
    }
}
