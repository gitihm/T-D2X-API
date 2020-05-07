
import { Module ,forwardRef} from '@nestjs/common';
import { ChartService } from './chart.service';
import { ChartProviders } from './chart.provider';
import { ChartController } from './chart.controller';
@Module({
  imports: [
    
  ],
  providers: [ChartService,...ChartProviders],
  controllers: [ChartController],
  exports: [ChartService],
})
export class ChartModule {}

 
