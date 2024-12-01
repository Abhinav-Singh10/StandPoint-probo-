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

        const responsePromise:Promise<string>= getResponseFrmEngine(pubsubSubscribe,uniqueId);

        const response = await responsePromise;
        res.status(200).send(response)
    } catch (error) {
        res.status(500).send(
            "Failed to process the buy order. Please try again later")
    } finally{
        pubsubSubscribe.unsubscribe(uniqueId.toString())
    }
})

orderRouter.post("/sell",authMiddleware,async(req:Request,res:Response)=>{
    const order:OrderPayload = req.body;
    // const uniqueId=idGen();
    const uniqueId=999;
    order["uniqueId"]=uniqueId;

    try {
        await requestQueue.lpush('/order/sell',JSON.stringify(order));

        const responsePromise:Promise<string>= getResponseFrmEngine(pubsubSubscribe,uniqueId);

        const response = await responsePromise;
        res.status(200).send(response)
    } catch (error) {
        res.status(500).send(
            "Failed to process the sell order. Please try again later")
    } finally{
        pubsubSubscribe.unsubscribe(uniqueId.toString())
    }
})

export default orderRouter;