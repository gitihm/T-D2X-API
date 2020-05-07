import { Module, forwardRef } from '@nestjs/common';
import { ConcludeController } from './conclude.controller';
import { ConcludeService } from './conclude.service';
import { ConcludeProviders } from './conclude.provider';
import { QuestionTestModule } from '../question/question.module';
import { ChartModule } from 'src/chart/chart.modile';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  imports: [QuestionTestModule, forwardRef(() => ChartModule),forwardRef(() => TasksModule),],
  controllers: [ConcludeController],
  providers: [ConcludeService, ...ConcludeProviders],
  exports: [ConcludeService],
})
export class ConcludeModule {}
