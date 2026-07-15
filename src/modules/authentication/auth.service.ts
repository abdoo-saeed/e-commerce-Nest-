import { BadRequestException, ConflictException, Injectable, NotAcceptableException } from "@nestjs/common";
import { confirmDTO, LoginDto, SignUpDto } from "./dto/auth.dto";
import { IUser } from "src/common/interfaces";
import { UserRepo } from "src/common/repo";
import { CacheService } from "src/common/services/cache.service";
import { createOtp } from "src/common/utils";
import { SecurityService } from './../../common/services/security';
import { ConfigService } from '@nestjs/config';
import { emailEvent } from "src/common/services/email";




@Injectable()
export class AuthService {

   private OTP_TTL = 300
  private OTP_MAX_ATTEMPTS = 5
  constructor(
    private readonly redis: CacheService,
    private readonly configService: ConfigService,
    private readonly securityService:SecurityService,
    private readonly userRepo: UserRepo,
  ) {}





  
async signUp(body:SignUpDto){
    const {email,gender,username,password,age,phone} = body
     
      const isEmailExist = await this.userRepo.findByEmail(email)

      if (isEmailExist){
        throw new BadRequestException("email already exist")
      }
      
      
   const salt = Number(this.configService.get('SALT'));

   const hashedPass = await this.securityService.hash({
     plainText: password,
     salt,
   });

      let encryptedPhone
      if(phone){
         encryptedPhone = await this.securityService.generateEncryption(phone)
      }
      
      
      const user = await this.userRepo.create({
        username,
        email,
        password:hashedPass,
        phone:encryptedPhone as string,
        gender,
        age 
      })

      const otp = createOtp()


      await this.redis.set({
        key: this.redis.confirmEmailKeyPrefix(user._id),
        value: JSON.stringify({
          otp: await this.securityService.hash({
            plainText: otp.toString(),
            salt: Number(this.configService.get('SALT')),
          }),
          attempts: this.OTP_MAX_ATTEMPTS,
        }),
        ttl: this.OTP_TTL,
      });


       //send otp by eventEmitter
      emailEvent.publish("confirm-email",{to:email ,title:"E_COMMERCE_APP",otp,subject:"Confirm Email",expiredTime:this.OTP_TTL})
    
      
      

       return {
          data:{
            user
          }
        }
    }

////////

async confirmEmail({email,otp}:confirmDTO){

  const user =await  this.userRepo.findByEmail(email)

  if(!user){
      throw new NotAcceptableException("email not found")
  }

  if(user.confirmEmail){
     throw new BadRequestException("email already confirmed")
  }

  const otpKey = this.redis.confirmEmailKeyPrefix(user._id)


  const otpData = JSON.parse(await this.redis.get(otpKey) as string) as {
    otp : string,
    attempts:number
  }

  if (!otpData || otpData.attempts <= 0 ) {
    throw new BadRequestException("max attempts has done")
  }
  if (!await this.securityService.compare({plainText:otp.toString(),cipherText:otpData.otp})) {
    await this.redis.update({
      key:otpKey,
      value:{
        otp:otpData.otp,
        attempts:otpData.attempts -1
        },
      ttl:await this.redis.getTTL(otpKey) as number   
    })

    throw new BadRequestException("in-valid otp")
  }


  user.confirmEmail = true
  await user.save()
  await this.redis.deleteByKey(otpKey)


  return{
    data:"confirmation done"
  } 

}





}