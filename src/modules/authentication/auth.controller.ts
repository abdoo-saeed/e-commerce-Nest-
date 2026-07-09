import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import type { LoginDto, SignUpDto } from "./dto/auth.dto"
import { CustomValidationPipe } from "src/common/pipes"
import { login, signUp } from "./auth.validation"





@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService:AuthService
  ){}



  @Post("signUp")  
  async signUp(
    @Body(
      new CustomValidationPipe(signUp)
  ) body: SignUpDto) {

    const user = await this.authService.signup(body)
    return {message:"Done", user }
  }



  @Post("login")  
  async login(
    @Body(
      new CustomValidationPipe(login)
  ) body: LoginDto) {

    const user = await this.authService.login(body)
    return {message:"Done", user }
  }




}