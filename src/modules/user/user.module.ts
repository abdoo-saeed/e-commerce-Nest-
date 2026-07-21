import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthModule } from "../authentication/auth.module";



@Module({
    imports:[AuthModule],
    exports:[],
    controllers:[UserController],
    providers:[UserService],
})
export class UserModule{
    //  configure(consumer: MiddlewareConsumer) {
    //     consumer
    //       .apply(AuthMiddleware)
    //       .forRoutes({path:"user/*",method:RequestMethod.ALL});  // 'auth'  in all controller
    //   }
}