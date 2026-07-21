import { Controller, Get,UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AutharizationGuard, AuthGuard } from "src/common/guards";
import { RoleEnum, TokenType } from "src/common/enums";
import { Role, Token, User } from "src/common/customDecorators";
import type{ IHUser } from "src/model";


@Controller("user")
export class UserController{
    constructor(
        private readonly userservice:UserService
    ){}




    @Token(TokenType.ACCESS)
    @Role([RoleEnum.USER])
    @UseGuards(AuthGuard,AutharizationGuard)
    @Get("profile")
    profile(
        @User() user:IHUser
    ){
        // const user = this.userservice.profile()
        return {message:"Done",data:{user}}
    } 



}