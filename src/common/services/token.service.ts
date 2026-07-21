import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { UserRepo } from "../repo";
import { TokenType } from "../enums";

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepo,
  ) {}

  async createToken({
    payload,
    secret = process.env.ACCESS_SIGNATURE as string,
    options,
  }: {
    payload: object;
    secret?: string;
    options?: SignOptions;
  }): Promise<string> {
    return this.jwtService.signAsync(payload, { secret, ...options });
  }

  async verifyToken({
    token,
    secret = process.env.ACCESS_SIGNATURE as string,
  }: {
    token: string;
    secret?: string;
  }): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, { secret });
  }

  async decodeToken(token: string, tokenType: TokenType) {
    const secret =
      tokenType === TokenType.ACCESS
        ? (process.env.ACCESS_SIGNATURE as string)
        : (process.env.REFRESH_SIGNATURE as string);

    const decoded = await this.jwtService.verifyAsync<
      JwtPayload & { _id: string }
    >(token, {
      secret,
    });

    const user = await this.userRepo.findById(decoded._id);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return {
      user,
      decoded,
    };
  }
}