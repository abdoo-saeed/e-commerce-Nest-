import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../services';
import { IAuthReq } from '../interfaces';
import { Reflector } from '@nestjs/core';
import { TokenType } from '../enums';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly tokenService:TokenService,
    private readonly reflector:Reflector
  ){}

  async canActivate(
    context: ExecutionContext,
  ):Promise<boolean> {

    const tokenType = this.reflector.getAllAndOverride<TokenType>("TokenType",[context.getHandler(), context.getClass()])

    // console.log(tokenType);
     

    let req!:IAuthReq
    let auth!:string
    switch (context.getType()) {
      case "http":
        req = context.switchToHttp().getRequest()
        auth =req.headers['authorization'] as string
        break;
    
      default:
        break;
    }

const [key, credential] = auth.split(' ') || [];
// console.log({ key, credential });

if (!key || !credential) {
  throw new UnauthorizedException('Missing authorization');
}

switch (key) {
  case 'Basic':
    const [username, password] = Buffer.from(credential, 'base64')
      .toString()
      .split(':');

    console.log({ username, password });
    break;

  default:
   req.credentials = await this.tokenService.decodeToken(credential,tokenType)

    break;
}
    


    return true;
  }
}
