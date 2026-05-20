import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { SessionService } from './session.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  constructor(private sessionService: SessionService) { }

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');

    // Subscribe SessionService updates to WebSocket broadcast
    this.sessionService.onStateChange = (state) => {
      this.server.emit('session_state', state);
    };

    this.sessionService.onReset = () => {
      this.server.emit('system_resetted');
    };
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('session_state', this.sessionService.getState());
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.logger.log(`User ${data.name} joined via socket`);
    (client as any).user = data;
    return { event: 'joined', data: 'success' };
  }

  @SubscribeMessage('vote')
  async handleVote(@MessageBody() data: { candidateId: string; category: string }) {
    this.logger.log(`Vote received for ${data.candidateId}`);
    // logic in Phase 4
  }

  @SubscribeMessage('answer')
  handleAnswer(@MessageBody() data: { questionIndex: number; optionIndex: number }) {
    this.logger.log(`Answer received: Q${data.questionIndex} Option ${data.optionIndex}`);
    // logic in Phase 5
  }

  @SubscribeMessage('water_tap')
  async handleWaterTap() {
    await this.sessionService.incrementWater(10);
  }
}
