import express  from "express";
import Redis from "ioredis";
import cors from 'cors';
import cookieParser from "cookie-parser";

import orderRouter from "./routes/orderRouter";
import userRouter from "./routes/userRouter";
import createMarketRouter from "./routes/createMarketRouter";
import fetchOrderBookRouter from "./routes/fetchOrderBookRouter";
import balancesRouter from "./routes/balancesRouter";
import resetRouter from "./routes/resetRouter";
import onrampRouter from "./routes/onrampRouter";
import tradeRouter from "./routes/tradeRouter";
import authRouter from "./routes/authRouter";
import { PrismaClient } from "@prisma/client";

const app = express();

app.use(cors({
    origin:'http://localhost:3000', // my front end port
    credentials:true // for cookies
}))

export const requestQueue= new Redis(6379);
export const pubsubSubscribe= new Redis(6380);

app.use(cookieParser())
app.use(express.json());

export const prismaClient = new PrismaClient();
export const JWT_SECRET: string= process.env.JWT_SECRET || "secret( -_-)";

app.use("/auth",authRouter)
app.use("/user",userRouter);
app.use("/symbol",createMarketRouter);
app.use("/orderbook",fetchOrderBookRouter); //2
app.use("/balances",balancesRouter)//4
app.use("/reset",resetRouter);
app.use("/onramp",onrampRouter);
app.use("/order",orderRouter);
app.use("/trade",tradeRouter)

app.listen(3001,()=>{
    console.log("Api Engine Running on Port: 3001");
});