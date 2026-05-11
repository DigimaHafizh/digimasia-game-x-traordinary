import { Controller, Get, Query } from '@nestjs/common';
import { CandidateService } from './candidate.service';

@Controller('candidates')
export class CandidateController {
    constructor(private candidateService: CandidateService) { }

    @Get()
    async getCandidates(@Query('type') type: string) {
        return this.candidateService.findAllByType(type);
    }
}
