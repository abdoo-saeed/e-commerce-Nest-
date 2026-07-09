import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";


@Controller("user")
export class UserController{
    constructor(
        private readonly userservice:UserService
    ){}


    @Get("profile")
    profile(){
        const user = this.userservice.profile()
        return {user}
    }



}