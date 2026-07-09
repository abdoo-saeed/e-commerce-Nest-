import { Injectable } from "@nestjs/common";
import { LoginDto, SignUpDto } from "./dto/auth.dto";




@Injectable()
export class AuthService {
  constructor(
  ) {}

  signup(data:SignUpDto){
    return {data}
  }


  login(data:LoginDto){
    return {data}
  }

}