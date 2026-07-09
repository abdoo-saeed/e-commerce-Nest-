import {z} from "zod"



export const generalValidationFields = {
  email: z.email(),

  otp: z
    .string({ error: "otp is required" })
    .regex(/^\d{6}$/),

  phone: z
    .string({ error: "phone is required" })
    .regex(/^(00201|\+201|01)(0|1|2|5)\d{8}$/),

  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,16}$/),

  username: z
    .string({ error: "username is mandatory" })
    .min(2, { error: "min is 2 char" })
    .max(25, { error: "max is 25 char" }),

  confirmPassword: z.string(),

  file: function (mimetype: string[]) {
    return z
      .strictObject({
        fieldname: z.string(),
        originalname: z.string(),
        encoding: z.string(),
        mimetype: z.enum(mimetype),
        buffer: z.any().optional(),
        path: z.string().optional(),
        size: z.number(),
      })
      .superRefine((args, ctx) => {
        if (!args.path && !args.buffer) {
          ctx.addIssue({
            code: "custom",
            message: "buffer is required",
            path: ["buffer"],
          });
        }
      });
  },
};






export const signUp= z.strictObject({
    username:generalValidationFields.username,
    email:generalValidationFields.email,
    password:generalValidationFields.password,
    confirmPassword:generalValidationFields.confirmPassword 
}).superRefine((data, ctx) => {
  if (data.confirmPassword != data.password) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "password mismatch confirmPassword",
    });
  }

  if (data.email.includes(".lol")) {
    ctx.addIssue({
      code: "custom",
      path: ["email"],
      message: "invalid domain",
    });
  }
});



export const login= z.strictObject({
    email:generalValidationFields.email,
    password:generalValidationFields.password, 
})