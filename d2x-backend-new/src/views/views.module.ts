import { Module , forwardRef } from '@nestjs/common';
import { ViewsController } from './views.controller';
import { ViewsService } from './views.service';
import { ViewsProviders } from './views.provider';
@Module({
  imports: [ ],
  controllers: [ViewsController],
  providers: [ViewsService,...ViewsProviders],
  exports:[ViewsService]
})
export class ViewsModule {}
