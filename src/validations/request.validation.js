import {z } from "zod";

export const signupPostRequestBodySchema = z.object({
    name: z.string()    ,
    email: z.string().email(),
    password: z.string().min(6),
})

export const signinPostRequestBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})