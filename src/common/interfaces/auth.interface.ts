import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { IHUser } from "src/model";



export interface IAuthReq extends Request {

    credentials:{user:IHUser,decoded:JwtPayload}
}