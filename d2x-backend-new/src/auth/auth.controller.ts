import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
  Res,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { MemberGuard } from '../auth/guards/MemberGuard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(
    @Body('signInfo') signInfo,
    @Body('password') password,
    @Res() res,
  ) {
    let result = await this.authService.signin(signInfo, password);
    return res.status(HttpStatus.OK).json(result);
  }
  @Post('signup')
  async signup(
    @Body('fname') fname,
    @Body('lname') lname,
    @Body('phoneNumber') phoneNumber,
    @Body('email') email,
    @Body('username') username,
    @Body('password') password,
    @Body('address') address,
    @Res() res,
  ) {
    let result = await this.authService.signup({
      fname,
      lname,
      phoneNumber,
      email,
      username,
      password,
      address,
    });
    return res.status(HttpStatus.OK).json(result);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('refreshtoken')
  async refreshToken(@Req() req, @Res() res) {
    const result = await this.authService.refreshToken(req.headers.authorization.split(' ')[1]);
    return res.status(HttpStatus.OK).json(result);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('sign_token')
  async signWithToken(@Req() req,@Res() res) {
    const result = await this.authService.signinWithToken(req.headers.authorization.split(' ')[1]);
    return res.status(HttpStatus.OK).json(result);
  }
  @Post('signout')
  async signout (@Req() req , @Res() res) {
     let result = await this.authService.signout(req.headers.authorization.split(' ')[1])
     return res.status(HttpStatus.OK).json(result);
  }
}
