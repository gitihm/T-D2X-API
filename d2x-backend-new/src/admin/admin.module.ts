import { Module ,forwardRef} from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { AdminProviders } from './admin.provider'
import { CustomerModule } from '../customer/customer.module';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [forwardRef(() => UsersModule),CustomerModule,forwardRef(() => AuthModule)],
  controllers:[AdminController],
  providers: [AdminService,...AdminProviders],
  exports: [AdminService]
})
export class AdminModule {}
