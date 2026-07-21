import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthReq } from '../interfaces';
import { Reflector } from '@nestjs/core';
import { RoleEnum, TokenType } from '../enums';
import { IHUser } from 'src/model';

@Injectable()
export class AutharizationGuard implements CanActivate {

  constructor(
    private readonly reflector:Reflector
  ){}

  async canActivate(
    context: ExecutionContext,
  ):Promise<boolean> {

    const roles = this.reflector.getAllAndOverride<RoleEnum[]>("RoleType",[context.getHandler(), context.getClass()])


    let user!:IHUser
    switch (context.getType()) {
      case "http":
        user = (context.switchToHttp().getRequest() as IAuthReq).credentials.user
        break;
    
      default:
        break;
    }



    return roles.includes(user.role);
  }
}
