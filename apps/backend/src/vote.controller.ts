import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { VoteService } from './vote.service';

@Controller('votes')
export class VoteController {
    constructor(private voteService: VoteService) { }

    @Post()
    async vote(
        @Body() body: { userId: string; candidateId: string; category: string },
    ) {
        return this.voteService.vote(body.userId, body.candidateId, body.category);
    }

    @Get('results')
    async getResults(@Query('category') category: string) {
        return this.voteService.getResults(category);
    }

    @Get('stats')
    async getStats(@Query('category') category: string) {
        return this.voteService.getAllStats(category);
    }
}
