import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { OrderPayload } from "../types/types";
import { idGen } from "../utils/idGen";
import { pubsubSubscribe, requestQueue} from "../server";
import getResponseFrmEngine from "../utils/getResponeFrmEngine";
const orderRouter = Router();

orderRouter.post("/buy",authMiddleware,async(req:Request,res:Response)=>{
    const order:OrderPayload = req.body;
    const uniqueId=idGen();
    // const uniqueId=999;     // remove this before deploying to production
    order["uniqueId"]=uniqueId;

    try {
        await requestQueue.lpush('/order/buy',JSON.stringify(order));
    } catch (error) {
        console.error(error);
        res.status(400).send("Failed to process order. Please try again later")
    }

    const responsePromise:Promise<string>= getResponseFrmEngine(pubsubSubscribe,uniqueId);

    try {
        const response = await responsePromise;
        pubsubSubscribe.unsubscribe(uniqueId.toString())
        res.status(200).send(response)
    } catch (error) {
        res.status(500).json({
            "Error": error
        })
    }
})

orderRouter.post("/sell",authMiddleware,async(req:Request,res:Response)=>{
    const order:OrderPayload = req.body;
    // const uniqueId=idGen();
    const uniqueId=999;
    order["uniqueId"]=uniqueId;

    try {
        await requestQueue.lpush('/order/buy',JSON.stringify(order));
    } catch (error) {
        console.error(error);
        res.status(400).send("Failed to process order. Please try again later")
    }

    const responsePromise:Promise<string>= getResponseFrmEngine(pubsubSubscribe,uniqueId);

    try {
        const response = await responsePromise;
        pubsubSubscribe.unsubscribe(uniqueId.toString())
        res.status(200).send(response)
    } catch (error) {
        res.status(500).json({
            "Error": error
        })
    }
})

export default orderRouter;