import { SetMetadata } from "@nestjs/common"
import { TokenType } from "../enums"



export const Token =(tokenType:TokenType = TokenType.ACCESS)=>{
    return SetMetadata("TokenType",tokenType)
}