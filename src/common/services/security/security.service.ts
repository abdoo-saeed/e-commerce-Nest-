import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcrypt";
import crypto from "node:crypto";
import { ConfigService } from '@nestjs/config';


@Injectable()
export class SecurityService{
    constructor(private readonly configService:ConfigService){}

    hash = async({
         plainText,
         salt= Number(this.configService.get<string>("SALT"))
    }:{
        plainText:string,
        salt?:number
    }):Promise<string>=>{
    
        return await hash(plainText,salt)
    
        
        }
    
    
     // compare hash
    compare = async({
        plainText,
        cipherText
    }:{
        plainText:string | Buffer<ArrayBufferLike>,
        cipherText:string
    }):Promise<boolean>=>{
        
        return await compare(plainText,cipherText)
    
        
        }
    





    
    // encryption
    
    generateEncryption = async (plainText:string):Promise<string>=>{
        const iv = crypto.randomBytes(Number(this.configService.get<string>("IVLENGTH")))
        const ENC_SECRET_KEY = this.configService.get<string>("ENC_SECRET_KEY") as string
        const cipherIV = crypto.createCipheriv('aes-256-cbc',ENC_SECRET_KEY,iv)
        let cipherText = cipherIV.update(plainText,'utf-8','hex')
       cipherText += cipherIV.final('hex')
    //    console.log({iv,cipherIV,cipherText});
    
       return `${iv.toString('hex')}:${cipherText}`
       
        
    
    }
    
    /// decryption
    
    generateDncryption = async (cipherText:string):Promise<string>=>{
    
       if (!cipherText) {
            throw new Error("Encrypted text is required for decryption")
        }
    
        const parts = cipherText.split(":") 
    
        if (parts.length !== 2) {
            throw new Error("Invalid encrypted format")
        }
    
        const [iv, encryptedData] = parts as [string,string]
        const ENC_SECRET_KEY = this.configService.get<string>("ENC_SECRET_KEY") as string
        const ivLikeBinary = Buffer.from(iv,'hex')
        let decipherIV = crypto.createDecipheriv('aes-256-cbc', ENC_SECRET_KEY,ivLikeBinary)
        let plainText = decipherIV.update(encryptedData,'hex','utf-8')
        plainText += decipherIV.final('utf-8')
        
        // console.log({iv,encryptedData,ivLikeBinary,decipherIV,plainText});
        return plainText
    }

}