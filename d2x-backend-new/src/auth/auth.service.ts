import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.payload';
import * as bcrypt from 'bcryptjs';
var moment = require('moment');
import { UsersService } from '../users/users.service';
import { TasksService } from '../tasks/tasks.service';
import { ChartService } from '../chart/chart.service';
enum SIGNIN_TYPE {
  EMAIL,
  USERNAME,
  MEMBER,
  ADMIN,
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly chartService: ChartService,
    private readonly TasksService: TasksService,
  ) {}

  async signin(signInfo: string, password: string) {
    const signinType = this.checkSignType(signInfo);
    signInfo = signInfo.toUpperCase();
    switch (signinType) {
      case SIGNIN_TYPE.EMAIL:
        return await this.signinWithEmail(signInfo, password);
      case SIGNIN_TYPE.USERNAME:
        return await this.signinWithUserName(signInfo, password);
    }
  }
  async signinWithEmail(email: string, password: string) {
    const user = await this.usersService.find_user_one({
      type: 'email',
      data: email,
    });
    if (user) {
      if (user && bcrypt.compareSync(password, user.password)) {
        const { password, ...result } = user;
        return this.createToken(result);
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }
  async signinWithUserName(username: string, password: string) {
    const user = await this.usersService.find_user_one({
      type: 'username',
      data: username,
    });
    if (user) {
      if (user && bcrypt.compareSync(password, user.password)) {
        const { password, ...result } = user;
        return this.createToken(result);
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }
  async signinWithToken(token: string) {
    let status = await this.usersService.check_token(token);
    if (!status) throw new UnauthorizedException();
    let user_from_token = await this.validateToken(token);
    let user = await this.usersService.find_user_one({
      type: 'username',
      data: user_from_token.username,
    });
    const payload = {
      username: user.username,
      sub: user.user_id,
      email: user.email,
      address: user.address,
      phone: user.phoneNumber,
      fname: user.fname,
      lname: user.lname,
      role: user.role,
    };

    return payload;
  }
  private set_form_jwtdecode(output_from_jwt) {
    return {
      username: output_from_jwt.username,
      sub: output_from_jwt.user_id,
      email: output_from_jwt.email,
      address: output_from_jwt.address,
      phone: output_from_jwt.phoneNumber,
      fname: output_from_jwt.fname,
      lname: output_from_jwt.lname,
      role: output_from_jwt.role,
    };
  }
  private async createToken(user: any) {
    const payload = {
      username: user.username,
      sub: user.user_id,
      email: user.email,
      address: user.address,
      phone: user.phoneNumber,
      fname: user.fname,
      lname: user.lname,
      role: user.role,
    };
    const token = await this.jwtService.sign(payload);
    await this.usersService.add_token(user, token);
    return {
      access_token: token,
      payload,
    };
  }
  async signup(user: any) {
    const result = await this.usersService.create_user(user);
    if (result.message == 'create user succeed') {
      try {
        await this.chartService.increment_user();
      } catch (error) {
        await this.TasksService.create_null_chart_day()
        await this.chartService.increment_user();

      }
    }
    return result;
  }
  
  async signout(token: string) {
    return await this.usersService.remove_token(token);
  }
  private checkSignType(userInfo: string) {
    let userInfoArray = userInfo.split('');
    let typeuserInfo = userInfoArray.find(item => {
      return item == '@';
    });
    return typeuserInfo != undefined ? SIGNIN_TYPE.EMAIL : SIGNIN_TYPE.USERNAME;
  }
  async validateToken(accessToken: string) {
    return (await this.jwtService.decode(accessToken)) as JwtPayload;
  }
  async checkAdminInToken(accessToken: string) {
    const user = await this.validateToken(accessToken);
    if (!user) throw new UnauthorizedException();
    return user.role === 1;
  }
  async checkAdminFromToken(accessToken: string) {
    const isAdmin = await this.checkAdminInToken(accessToken);
    if (!isAdmin) {
      throw new UnauthorizedException('permission denied');
    }
    return true;
  }
  async checkMemberInToken(accessToken: string) {
    const user = await this.validateToken(accessToken);
    if (!user) throw new UnauthorizedException();
    return user.role === 0 || user.role === 1;
  }

  async checkMemberFromToken(accessToken: string) {
    const isMember = await this.checkMemberInToken(accessToken);
    if (!isMember) {
      throw new UnauthorizedException('permission denied');
    }
    return true;
  }
  async refreshToken(accessToken: string) {
    let user_from_token = await this.validateToken(accessToken);
    let user = await this.usersService.find_user_one({
      type: 'username',
      data: user_from_token.username,
    });
    await this.usersService.remove_token(accessToken);
    const payload = {
      username: user.username,
      sub: user.user_id,
      email: user.email,
      address: user.address,
      phone: user.phoneNumber,
      fname: user.fname,
      lname: user.lname,
      role: user.role,
    };
    const token = await this.jwtService.sign(payload);
    await this.usersService.add_token(user, token);
    return {
      access_token: token,
      payload,
    };
  }
}
