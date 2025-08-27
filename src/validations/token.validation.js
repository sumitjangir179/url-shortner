import z from "zod";

export const tokenValidation = z.object({
    url : z.string(),
})