import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "../server";

export function authMiddleware(req:Request,res:Response,next:NextFunction){
    const token = req.cookies.authToken;

    if (!token) {
        res.status(401).json({
            message:"No token provided"
        });
    }

    try {
        const decoded = verify(token,JWT_SECRET)as {[key:string]: any} ;
        (req as any).user=decoded;
        console.log(`Decoded from authMiddleware:`,decoded);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}