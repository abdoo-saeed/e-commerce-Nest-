import DBRepo from "./DB.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { User } from "src/model";



@Injectable()
export class UserRepo extends DBRepo<User>{
    constructor(@InjectModel(User.name)protected readonly userModel:Model<User>){
        super(userModel)
    }


    async findByEmail(email:string){

       return this.findOne({email})
    }
}