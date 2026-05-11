import { OnGatewayInit, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SessionService } from './session.service';
export declare class EventsGateway implements OnGatewayInit, OnGatewayConnection {
    private sessionService;
    server: Server;
    private readonly logger;
    constructor(sessionService: SessionService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleJoin(data: any, client: Socket): {
        event: string;
        data: string;
    };
    handleVote(data: {
        candidateId: string;
        category: string;
    }): Promise<void>;
    handleAnswer(data: {
        questionIndex: number;
        optionIndex: number;
    }): void;
    handleWaterTap(): Promise<void>;
}
