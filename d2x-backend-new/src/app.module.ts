import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ProductModule } from './product/product.module';
import { AdminModule } from './admin/admin.module';
import { DiseaseModule } from './disease/disease.module';
import { QuestionTestModule } from './question/question.module';
import { SymptomModule } from './symptom/symptom.module';
import { ViewsModule } from './views/views.module';
import { ConcludeModule } from './concludetest/conclude.module';
import { TasksModule } from './tasks/tasks.module';
import { ChartModule } from './chart/chart.modile';
@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProductModule,
    AdminModule,
    DiseaseModule,
    QuestionTestModule,
    SymptomModule,
    ViewsModule,
    ConcludeModule,
    TasksModule,
    ChartModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
