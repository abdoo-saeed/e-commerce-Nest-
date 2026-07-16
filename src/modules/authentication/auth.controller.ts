import { Body, Controller, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { confirmDTO, LoginDto, SignUpDto } from "./dto/auth.dto"





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

    const user = await this.authService.signUp(body)


    return {message:"Done", data: {user}  }
  } 


  @Patch("confirm-email")  
  async confirmEmail(
    @Body() body: confirmDTO) {

    await this.authService.confirmEmail(body)
    return {message:"Done"}
  } 



  @Post("login")  
  async login(
    @Body() body: LoginDto) {

    const cred = await this.authService.login(body)
    return {message:"Done", data:cred}
  } 





}