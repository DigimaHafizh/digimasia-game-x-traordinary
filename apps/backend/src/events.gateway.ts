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
import { PrismaService } from './prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  constructor(
    private sessionService: SessionService,
    private prisma: PrismaService
  ) { }

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
  async handleJoin(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.logger.log(`User ${data.name} joined via socket`);

    // VALIDATION: Check if user is still officially in the game (handles mobile sleep/reconnect after reset)
    if (data.id) {
      const userInDb = await this.prisma.user.findUnique({ where: { id: data.id } });
      if (userInDb && !userInDb.isJoined && !userInDb.isAdmin) {
        this.logger.log(`User ${data.name} reconnecting but was reset. Forcing logout.`);
        client.emit('system_resetted');
        return { event: 'rejected', reason: 'system_reset' };
      }
    }

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
  async handleWaterTap(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const user = (client as any).user;
    this.logger.log(`Water tap received from socket ${client.id}. User: ${user?.name || 'Unknown'} (Admin: ${user?.isAdmin})`);

    if (user && user.id) {
      try {
        await this.prisma.$transaction(async (tx) => {
          const dbUser = await tx.user.findUnique({ where: { id: user.id } });
          if (!dbUser) {
            this.logger.warn(`User ${user.id} not found in DB`);
            return;
          }

          // ADMINS have infinite water and don't decrement collectedWater
          if (dbUser.isAdmin) {
            await this.sessionService.incrementWaterInTransaction(tx, 1);
            return;
          }

          // Regular users must have water
          if (dbUser.collectedWater <= 0) {
            this.logger.warn(`User ${user.name} has no water in DB. Tapping rejected.`);
            return;
          }

          // Increment user contribution & decrement supply
          await tx.user.update({
            where: { id: user.id },
            data: {
              contributedWater: { increment: 1 },
              collectedWater: { decrement: 1 }
            }
          });

          // Update global session water
          await this.sessionService.incrementWaterInTransaction(tx, 1);
        });
      } catch (err) {
        this.logger.error(`Error processing water tap for user ${user.id}:`, err);
      }
    } else {
      this.logger.log('Fallback: incrementing water for unknown user context');
      await this.sessionService.incrementWater(1);
    }
  }
}
