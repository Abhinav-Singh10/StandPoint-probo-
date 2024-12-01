import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { OrderPayload } from "../types/types";
import { idGen } from "../utils/idGen";
import { pubsub, requestQueue} from "../server";
const orderRouter = Router();

orderRouter.post("/buy",authMiddleware,async(req:Request,res:Response)=>{
    const order:OrderPayload = req.body;
    // const uniqueId=idGen();
    const uniqueId=999;     // remove this before deploying to production
    order["uniqueId"]=uniqueId;

    try {
        await requestQueue.lpush('/order/buy',JSON.stringify(order));
    } catch (error) {
        console.error(error);
        res.status(400).send("Failed to process order. Please try again later")
    }

    const responsePromise:Promise<string>= new Promise((resolve,reject)=>{
        
        const timer=setTimeout(() => {
                reject(new Error ("Timeout waiting for response"))
        }, 10000);

        pubsub.subscribe(uniqueId.toString(),(err)=>{
            if(err){
                clearTimeout(timer);
                reject(new Error("failed to wait for response to buy:"))
            }
            console.log("Waiting for Response");
        })

        pubsub.on("message",(channel,message)=>{
            if (channel===uniqueId.toString()) {
                console.log(message);
                console.log(typeof message);
                
                const data = JSON.parse(message);
                clearTimeout(timer);
                resolve(data);
            }
        })
    })

    try {
        const response = await responsePromise;
        pubsub.unsubscribe(uniqueId.toString())
        res.status(200).send(response)
    } catch (error) {
        res.status(500).json({
            "Error": error
        })
    }
})

orderRouter.post("/sell",authMiddleware,(req:Request,res:Response)=>{
    res.send("Reached /order/buy")
})

export default orderRouter;