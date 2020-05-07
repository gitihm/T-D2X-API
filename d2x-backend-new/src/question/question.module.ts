import { Module ,  } from '@nestjs/common';
import { QuestionTestController } from './question.controller';
import { QuestionService } from './question.service'
import { DatabaseModule } from '../database/database.module';
import { QuestionTestProviders } from './question.provider';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [ 
    AuthModule,
  ],
  controllers: [QuestionTestController],
  providers: [QuestionService,...QuestionTestProviders],
  exports:[QuestionService]
})
export class QuestionTestModule {}
