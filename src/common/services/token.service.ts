import { Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import {
  sign,
  verify,
  decode,
  Secret,
  SignOptions,
  JwtPayload,
} from "jsonwebtoken";

@Injectable()
export class TokenService {
    private ACCESS_SIGNATURE
  constructor(
    private readonly JwtService:JwtService
  ) {}

  async createToken({
    payload,
    secret= process.env.ACCESS_SIGNATURE as string,
    options
  }:{
    payload:object,
    secret: string,
    options?: SignOptions,
  }
  
  ):Promise<string> {
    return await this.JwtService.signAsync(payload, {secret,...options});
  }

  verifyToken({
    token,
    secret=process.env.ACCESS_SIGNATURE as string
  }:{
    token: string,
    secret?: string
  }):Promise<JwtPayload> {
    return this.JwtService.verifyAsync(token, {secret});
  }

  decodeToken(token: string) {
    return this.JwtService.decode(token);
  }
}