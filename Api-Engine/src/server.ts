import express  from "express";
import rootRouter from "./routes";
import Redis from "ioredis";

const app = express();

export const requestQueue= new Redis(6379);
export const pubsub= new Redis(6380);

app.use(express.json());

app.use("/api/v1/",rootRouter)

app.listen(3001,()=>{
    console.log("Api Engine Running on Port: 3001");
});