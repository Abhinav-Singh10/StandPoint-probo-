import z from 'zod';

export const OrderPayload =z.object({
    userId: z.string(),
    stockSymbol:z.string(),
    quantity:z.number(),
    price:z.number(),
    stockType: z.enum(["yes","no"]),
})

export const MintPayload =z.object({
    userId: z.string(),
    stockSymbol:z.string(),
    quantity:z.number(),
})

export const OrampPayload =z.object({
    userId: z.string(),
    amount: z.number() 
})

export const SignUpSchemea= z.object({
    email:z.string().email().min(7),
    password:z.string()
})

export const LoginSchema= z.object({
    email:z.string().email().min(7),
    password:z.string()
})



