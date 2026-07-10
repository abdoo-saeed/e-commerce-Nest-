import { Injectable } from "@nestjs/common";
import { LoginDto, SignUpDto } from "./dto/auth.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/model";
import { Model } from "mongoose";
import { IUser } from "src/common/interfaces";




@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly model:Model<IUser>
  ) {}

  async signup(data:SignUpDto):Promise<IUser>{
    const [user] = await this.model.create([data])
    return  user.toJSON()
  }


  login(data:LoginDto){
    return {data}
  }

}