import z from 'zod';

export type OrderPayload ={
    userId:string,
    stockSymbol:string,
    quantity:number,
    price:number,
    stockType: "yes"|"no",
    uniqueId? : number
}

export const SignUpSchemea= z.object({
    email:z.string().email().min(7),
    password:z.string()
})

export const LoginSchema= z.object({
    email:z.string().email().min(7),
    password:z.string()
})

