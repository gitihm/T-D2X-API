import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksProviders } from './tasks.provider';

@Module({
  providers: [TasksService,...TasksProviders],
  exports:[TasksService]
})
export class TasksModule {}