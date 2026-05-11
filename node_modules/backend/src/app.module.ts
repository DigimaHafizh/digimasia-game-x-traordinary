import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';
import { SessionModule } from './session.module';
import { EventsModule } from './events.module';
import { EventsGateway } from './events.gateway';
import { VoteModule } from './vote.module';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { CandidateModule } from './candidate.module';
import { CandidateService } from './candidate.service';
import { CandidateController } from './candidate.controller';
import { TriviaModule } from './trivia.module';
import { TriviaService } from './trivia.service';
import { TriviaController } from './trivia.controller';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule, SessionModule, AuthModule, EventsModule, VoteModule, CandidateModule, TriviaModule],
  controllers: [AppController, VoteController, CandidateController, TriviaController, UserController],
  providers: [AppService, EventsGateway, VoteService, CandidateService, TriviaService],
})
export class AppModule { }
