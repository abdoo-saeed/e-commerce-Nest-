import { SetMetadata } from "@nestjs/common"
import { RoleEnum } from "../enums"




export const Role =(roles:RoleEnum[])=>{
    return SetMetadata("RoleType",roles)
}