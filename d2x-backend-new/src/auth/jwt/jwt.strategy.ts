import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return { 
      username: payload.username, 
      sub: payload.sub, 
      email:payload.email,
      address:payload.address,
      phone:payload.phoneNumber,
      fname:payload.fname,
      lname:payload.lname,
      gender:payload.gender,
      dob:payload.dob,
      role:payload.role };
  }
}