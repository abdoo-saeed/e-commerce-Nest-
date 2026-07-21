import nodemailer from "nodemailer";
import { EMAIL } from './../../../config/config';



export const sendEmail = async ({ to, subject , html}:{to:string, subject:string, html:string}) => {


// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});


   await transporter.sendMail({
    from: `"E_COMMERCE" <${process.env.EMAIL}>`,
    to,
    subject,
    html
  });



}

