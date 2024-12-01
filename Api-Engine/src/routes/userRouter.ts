import { Router } from "express";
import z from 'zod';
import { authMiddleware } from "../middlewares/authMiddleware";
const userRouter= Router();

userRouter.post("/create/:userId",authMiddleware,(req,res)=>{
    
})


export default userRouter;