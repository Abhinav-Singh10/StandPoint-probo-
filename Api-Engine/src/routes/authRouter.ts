import { Request, Response, Router } from "express";
import { LoginSchema, SignUpSchemea } from "../types/types";
import { JWT_SECRET, prismaClient } from "../server";
import { compare, hash } from "bcrypt";
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()
const authRouter= Router();



authRouter.post("/signup",async(req:Request,res:Response)=>{
    const parsedBody= SignUpSchemea.safeParse(req.body);

    if (!parsedBody.success ) {
        res.status(400).send("Please ensure that mail and password are strings")
        return;
    }

    const user= await prismaClient.user.findFirst({
        where:{
            email: parsedBody.data.email
        }
    })

    if (user) {
        res.status(409).send("User already exists")
        return;
    }
    const hashedPass= await hash(parsedBody.data.password,10);

    await prismaClient.user.create({
        data:{
            email:parsedBody.data.email,
            password:hashedPass
        }
    })

    res.status(200).send("Signup Sucessful!")
})

authRouter.post("/login",async(req:Request,res:Response)=>{
    const parsedBody= LoginSchema.safeParse(req.body);

    if (!parsedBody.success ) {
        res.status(400).send("Please ensure that mail and password are strings")
        return;
    }

    const user= await prismaClient.user.findFirst({
        where:{
            email: parsedBody.data.email,
        }
    })
    
    if (!user) {
        res.status(409).send("User doesn't exist")
        return;
    }

    const isValid= await compare(parsedBody.data.password,user.password);
     
    if (!isValid) {
        res.status(401).send("Incorrect Password")
        return;
    }
    
    const token = jwt.sign({
        userId: user.id
    },JWT_SECRET,{expiresIn: '1h'})

    res.cookie('authToken', token,{
        httpOnly: true,
        secure: process.env.NODE_ENV ==="production",
        sameSite:"strict",
        maxAge: 60*60*1000,
    })

    res.status(200).send({
        message: "Logged In Sucessfully"
    })
})

export default authRouter;