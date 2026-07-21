// import { Injectable, NestMiddleware } from "@nestjs/common";
// import type{ NextFunction, Request, Response } from "express";
// import { TokenService } from 'src/common/services';




// @Injectable()
// export class AuthMiddleware implements NestMiddleware {

//     constructor(
//         private readonly tokenService:TokenService
//     ){}

//   async use(req: Request, res: Response, next: NextFunction) {
    
//     const [key,token] = req.headers['authorization']?.split(" ") as string[]
//     // console.log({key,token});
//     const {user,decoded} = await this.tokenService.decodeToken(token)
    


//     next();
//   }
// }