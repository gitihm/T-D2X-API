import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class MemberGuard implements CanActivate {
  constructor(
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.headers) return false;
    if (!request.headers.authorization) return false;
    const token = request.headers.authorization.split(' ')[1];

    try {
       await this.authService.checkMemberFromToken(token);
    } catch (err) {
      throw err;
    }

    return true;
  }
}
