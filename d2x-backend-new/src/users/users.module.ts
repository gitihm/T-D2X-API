import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersProviders } from './users.provider';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { jwtConstants } from '../auth/jwt/constants';
import { Config } from "../config/config";

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        dest:  `/img${Config.ImagePath.user}`,
      }),
    }),
    forwardRef(() => AuthModule),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '48h' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, ...UsersProviders],
  exports: [UsersService],
})
export class UsersModule {}

