import { Module, forwardRef } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerProviders } from './customer.provider';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ProductModule } from '../product/product.module';
import { ChartModule } from 'src/chart/chart.modile';
import { MulterModule } from '@nestjs/platform-express';
import { TasksModule } from 'src/tasks/tasks.module';
import { Config } from "../config/config";
@Module({
  imports: [
    AuthModule,
    UsersModule,
    PassportModule,
    ProductModule,
    forwardRef(()=>ChartModule),
    forwardRef(() => TasksModule),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: `img${Config.ImagePath.payment}`,
      }),
    }),
  ],
  controllers: [CustomerController],
  providers: [CustomerService, ...CustomerProviders],
  exports: [CustomerService],
})
export class CustomerModule {}
