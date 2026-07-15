import  crypto  from 'crypto';



export const createOtp = ():number=>{
   return crypto.randomInt(100000,999999)

}