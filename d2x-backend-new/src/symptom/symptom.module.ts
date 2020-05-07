import { Module , forwardRef } from '@nestjs/common';
import { SymptomController } from './symptom.controller';
import { SymptomService } from './symptom.service';
import { SymptomProviders } from './symptom.provider';
import { AuthModule } from '../auth/auth.module';
import { QuestionTestModule } from '../question/question.module';
import { ChartModule } from '../chart/chart.modile';
@Module({
  imports: [  
    AuthModule,QuestionTestModule,forwardRef(()=>ChartModule)
],
  controllers: [SymptomController],
  providers: [SymptomService,...SymptomProviders],
  exports:[SymptomService]
})
export class SymptomModule {}
