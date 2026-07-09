import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ZodType } from "zod";



@Injectable()
export class CustomValidationPipe implements PipeTransform {
    constructor(private schema:ZodType){}
  transform(value: any, metadata: ArgumentMetadata) {
 
    if (metadata.type === 'body') {
      if (value.password !== value.confirmPassword) {
        throw new BadRequestException('password not match');
      }
    }

    const {success,error} = this.schema.safeParse(value)
    if(!success){
        throw new BadRequestException({
            message:"validation error",
            cause:{
                issues:error.issues.map(issue =>{return{path:issue.path,message:issue.message}}) 
            }
        })
    }


    return value;
  }
}