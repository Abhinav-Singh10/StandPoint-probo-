import express  from "express";
import Redis from "ioredis";
import cors from 'cors';


import orderRouter from "./routes/orderRouter";
import userRouter from "./routes/userRouter";
import createMarketRouter from "./routes/createMarketRouter";
import fetchOrderBookRouter from "./routes/fetchOrderBookRouter";
import balancesRouter from "./routes/balancesRouter";
import resetRouter from "./routes/resetRouter";
import onrampRouter from "./routes/onrampRouter";
import tradeRouter from "./routes/tradeRouter";
import authRouter from "./routes/authRouter";

const app = express();

app.use(cors({
    origin:'http://localhost:3000', // my front end port
    credentials:true // for cookies
}))

export const requestQueue= new Redis(6379);
export const pubsubSubscribe= new Redis(6380);

app.use(express.json());

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