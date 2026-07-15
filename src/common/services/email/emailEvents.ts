import { EventEmitter } from "events"
import { sendEmail } from "./sendEmail"
import { generateHtml } from "./generateHtml"

const emailEmitter = new EventEmitter()

export type Events = "confirm-email" | "forget_password"



export class Email {
    constructor(private emitter:EventEmitter){

    }

    publish(eventName:Events, ...args:any){ //emit 
           this.emitter.emit(eventName,...args)
    }

    subscribe(eventName:Events, listener:(...args:any)=>void | Promise<void>){ //on
        this.emitter.on(eventName,listener) 

    }
}


export const emailEvent = new Email(emailEmitter)

emailEvent.subscribe("confirm-email",async({to,title,otp,subject,expiredTime})=>{
    const html = generateHtml(title, otp ,expiredTime)
    sendEmail({to,subject,html})
})