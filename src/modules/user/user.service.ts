import { Injectable } from "@nestjs/common";



@Injectable()
export class UserService{
    constructor(){}

    
    profile(){
        return {name:"abdo",age:22}
    }


}