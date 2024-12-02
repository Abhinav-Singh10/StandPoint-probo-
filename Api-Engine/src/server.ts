import express  from "express";
import Redis from "ioredis";
import cors from 'cors';
import cookieParser from "cookie-parser";
import {createServer} from  'http';
import {WebSocketServer,WebSocket} from 'ws';

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
const server= createServer(app); 
const PORT= process.env.PORT || 3001;

app.use(cors({
    origin:'http://localhost:3000', // my front end port
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials:true // for cookies
}))

const wss = new WebSocketServer({server});

export const requestQueue= new Redis(6379);
export const pubsubSubscribe= new Redis(6380);

app.use(cookieParser())
app.use(express.json());

export const prismaClient = new PrismaClient();
export const JWT_SECRET: string= process.env.JWT_SECRET || "secret( -_-)";

const userConnections : {[ key:string ]: Set<WebSocket> }= {};

wss.on('connection',(socket,req)=>{
    const stockSymbol=req.url;

    if(!stockSymbol){
        socket.close();
        return;
    }

    if (!userConnections[stockSymbol]) {
        userConnections[stockSymbol]=new Set();
        pubsubSubscribe.subscribe(stockSymbol);
    }

    userConnections[stockSymbol].add(socket);

    console.log(`New user connected for ${stockSymbol}`);

    pubsubSubscribe.on('message',(message,channel)=>{
        if (channel===stockSymbol) {
            socket.send(message);
        }
    })

    socket.on('close',()=>{
        userConnections[stockSymbol].delete(socket);

        if (userConnections[stockSymbol].size ===0) {
            pubsubSubscribe.unsubscribe(stockSymbol);
            delete userConnections[stockSymbol];
        }
    })
})

app.use("/auth",authRouter)
app.use("/user",userRouter);
app.use("/symbol",createMarketRouter);
app.use("/orderbook",fetchOrderBookRouter); //2
app.use("/balances",balancesRouter)//4
app.use("/reset",resetRouter);
app.use("/onramp",onrampRouter);
app.use("/order",orderRouter);
app.use("/trade",tradeRouter)

server.listen(PORT,()=>{
    console.log(`Api Engine Running on Port: ${PORT}`);
});