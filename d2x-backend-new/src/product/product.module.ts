import { Module, RequestMethod, MiddlewareConsumer, forwardRef } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DatabaseModule } from '../database/database.module';
import { ProductProviders } from './product.provider';
import { MulterModule } from '@nestjs/platform-express';
import { ChartModule } from '../chart/chart.modile';
import { Config } from "../config/config";

@Module({
  imports: [
    forwardRef(()=>ChartModule),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: `/img${Config.ImagePath.product}`,
      }),
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService, ...ProductProviders],
  exports: [ProductService],
})
export class ProductModule {}
