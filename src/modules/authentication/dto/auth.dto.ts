import z from "zod";
import { login, signUp } from "../auth.validation";

 
export type SignUpDto = z.infer<typeof signUp>
export type LoginDto = z.infer<typeof login>
