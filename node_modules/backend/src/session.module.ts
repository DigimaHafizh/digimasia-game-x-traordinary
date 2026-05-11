import { Module, Global, forwardRef } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TriviaModule } from './trivia.module';

@Global()
@Module({
    imports: [forwardRef(() => TriviaModule)],
    controllers: [SessionController],
    providers: [SessionService],
    exports: [SessionService],
})
export class SessionModule { }
