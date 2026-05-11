import { CandidateService } from './candidate.service';
export declare class CandidateController {
    private candidateService;
    constructor(candidateService: CandidateService);
    getCandidates(type: string): Promise<{
        id: string;
        name: string;
        division: string;
        type: string;
        imageUrl: string;
    }[]>;
}
