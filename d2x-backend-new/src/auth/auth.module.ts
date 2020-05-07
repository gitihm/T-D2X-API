import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt/constants';
import { AuthProviders } from './auth.provider';
import { ChartService } from 'src/chart/chart.service';
import { ChartModule } from 'src/chart/chart.modile';
import { TasksModule } from 'src/tasks/tasks.module';
import { Config } from "../config/config";

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => TasksModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: Config.expiresIn },
    }),

    forwardRef(() => ChartModule),
  ],
  providers: [AuthService, JwtStrategy, ...AuthProviders],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
