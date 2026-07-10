import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { userModel } from "src/model";




@Module({
    imports:[userModel],
    exports:[],
    controllers:[AuthController],
    providers:[AuthService],
})
export class AuthModule{}