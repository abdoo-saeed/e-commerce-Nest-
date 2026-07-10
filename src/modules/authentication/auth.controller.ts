import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginDto, SignUpDto } from "./dto/auth.dto"




@UsePipes(new ValidationPipe({
        stopAtFirstError:true,
        whitelist:true,
        forbidNonWhitelisted:true
       }))
@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService:AuthService
  ){}



  @Post("signUp")  
  async signUp(
    @Body() body: SignUpDto) {

    const user = await this.authService.signup(body)
    return {message:"Done", data: {user}  }
  } 



  @Post("login")  
  async login(
    @Body(
      new ValidationPipe({
        stopAtFirstError:true,
        whitelist:true,
        forbidNonWhitelisted:true
       })
  ) body: LoginDto) {

    const user =  this.authService.login(body)
    return {message:"Done", user }
  }




}