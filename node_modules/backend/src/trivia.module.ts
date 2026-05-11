import { Module, forwardRef } from '@nestjs/common';
import { TriviaService } from './trivia.service';
import { TriviaController } from './trivia.controller';
import { SessionModule } from './session.module';

@Module({
    imports: [forwardRef(() => SessionModule)],
    controllers: [TriviaController],
    providers: [TriviaService],
    exports: [TriviaService],
})
export class TriviaModule { }
