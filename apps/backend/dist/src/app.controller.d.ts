import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getLeaderboard(): Promise<{
        name: string;
        division: string;
        amount: number;
        score: number;
    }[]>;
}
