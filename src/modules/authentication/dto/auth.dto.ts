import { Transform } from "class-transformer";
import { IsBoolean, IsBooleanString, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword, Max, MaxLength, Min, MinLength, Validate, ValidateIf } from "class-validator";
import { MatchBetweenFields } from "src/common/customDecorators";




export class SignUpDto{


    @MinLength(2)
    @MaxLength(33)
    @IsNotEmpty()
    username!:string

    @IsEmail({},{message:"email is required"})
    email!:string

    @IsOptional()
    @IsString()
    phone?:string


    @IsOptional()
    @IsNumber()
    age?:number

    @IsOptional()
    @IsNumber()
    gender?:number


    @IsStrongPassword({minNumbers:3,minUppercase:1,minLowercase:1,minSymbols:1})
    password!:string

    @ValidateIf((data:any)=>{
        return Boolean(data.password)
    })
    //@ismatch(MatchBetweenFields)
    @Validate(MatchBetweenFields)
    confirmPassword!:string
}


export class LoginDto{
    @IsEmail({},{message:"email is required"})
    email!:string

    @IsStrongPassword({minNumbers:3,minUppercase:1,minLowercase:1,minSymbols:1})
    password!:string
    
    @IsOptional()
    @IsString()
    FCM?:string
    
}

export class confirmDTO{
    @IsEmail({},{message:"email is required"})
    email!:string

    @IsNumber()
    @Min(100000)
    @Max(999999)
    otp!:number
    
}