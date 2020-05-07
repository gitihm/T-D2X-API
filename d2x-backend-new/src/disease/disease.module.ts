import { Module, RequestMethod, MiddlewareConsumer,forwardRef } from '@nestjs/common';
import { DiseaseController } from './disease.controller';
import { DiseaseService } from './disease.service';
import { DiseaseProviders } from './disease.provider';
import { AuthModule } from '../auth/auth.module';
import { ChartModule } from '../chart/chart.modile';

@Module({
  imports: [
    AuthModule,
    forwardRef(()=>ChartModule)
  ],
  controllers: [DiseaseController],
  providers: [DiseaseService, ...DiseaseProviders],
  exports: [DiseaseService],
})
export class DiseaseModule {}
