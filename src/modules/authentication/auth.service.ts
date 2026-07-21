import { BadRequestException, ConflictException, Injectable, NotAcceptableException } from "@nestjs/common";
import { confirmDTO, LoginDto, ResendOtpDto, SignUpDto } from "./dto/auth.dto";
import { IUser } from "src/common/interfaces";
import { UserRepo } from "src/common/repo";
import { CacheService } from "src/common/services/cache.service";
import { createOtp } from "src/common/utils";
import { SecurityService } from './../../common/services/security';
import { ConfigService } from '@nestjs/config';
import { emailEvent } from "src/common/services/email";
import { randomUUID } from "node:crypto";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "src/common/services";




@Injectable()
export class AuthService {

   private OTP_TTL = 300
  private OTP_MAX_ATTEMPTS = 5
  constructor(
    private readonly redis: CacheService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
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

/////////////////////////////

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

//////////////////////////////


async login({email,password}:LoginDto){

  const user = await this.userRepo.findByEmail(email)

  if(!user || !await this.securityService.compare({plainText:password,cipherText:user.password})){
    throw new BadRequestException("in-valid credintials")
  }
  if(!user.confirmEmail){
    throw new BadRequestException("email not confirmed yet")
  }


  const jti = randomUUID()
  const accessToken = await this.tokenService.createToken({
  payload: {
    _id: user._id,
    email: user.email,
  },
  secret: process.env.ACCESS_SIGNATURE as string,
  options: {
    expiresIn: "7d",
    jwtid: jti,
  },
});

  const refreshToken = await this.tokenService.createToken({
  payload: {
    _id: user._id,
    email: user.email,
  },
  secret: process.env.REFRESH_SIGNATURE as string,
  options: {
    expiresIn: "7d",
    jwtid: jti,
  },
});

  // if(FCM){

  //   await addFCM(user._id,FCM)
  //   const tokens = await getFCMs(user._id)

  //   if(tokens?.length){

  //     await notify.sendNotifications({tokens,data:{title:"login",body:`you login at  ${new Date()}`}})

  //   }

    

  // }

  return {
    data:{
      accessToken,
      refreshToken
    }
  }

  


}


////////////////////////////

async resendOtp({email}:ResendOtpDto){

     const user = await this.userRepo.findByEmail(email)

    if(!user){
      throw new BadRequestException({message:"user not found",status:404})
    }
    if(user.confirmEmail){
      throw new BadRequestException({message:"user already confirmed",status:404})
    }

        const otpKey = this.redis.confirmEmailKeyPrefix(user._id) 
        const otpData =await this.redis.get(otpKey)

     if(otpData){
       const ttl =await this.redis.getTTL(otpKey)
       if(ttl > 240){
       throw new BadRequestException({message:"wait minute to resend",status:404})
       }
    }

    //=== resend the otp 
    await this.redis.deleteByKey(otpKey)

       const code = createOtp()

       await this.redis.set({
        key:otpKey,
        value:{
            otp: await this.securityService.hash({plainText:code.toString(),salt:process.env.SALT as unknown as number}),
            attempts:1,
        },
        ttl: 300  // 5 minutes
    })


     //send otp by eventEmitter
     emailEvent.publish("confirm-email",{to:email ,title:"E_COMMERCE_APP",otpKey,subject:"Confirm Email",expiredTime:this.OTP_TTL})
    
    return {
        data:{
            message:"success",
            data:{}
        }
    }



}




}