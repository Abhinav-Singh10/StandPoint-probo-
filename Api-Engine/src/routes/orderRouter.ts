import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { OrderPayload, } from "../types/types";
import { idGen } from "../utils/idGen";
import { pubsubSubscribe, requestQueue} from "../server";
import getResponseFrmEngine from "../utils/getResponeFrmEngine";
const orderRouter = Router();

orderRouter.post("/buy",authMiddleware,async(req:Request,res:Response)=>{
    const parsedBody= OrderPayload.safeParse(req.body)

    if (!parsedBody.success) {
        res.status(400).send("Incorrect credentials");
        return;
    }

    const orderPayload = req.body;
    const uniqueId=idGen();
    // const uniqueId=999;     // remove this before deploying to production
    orderPayload["uniqueId"]=uniqueId;

    try {
        await requestQueue.lpush('/order/buy',JSON.stringify(orderPayload));

        const responsePromise:Promise<string>= getResponseFrmEngine(pubsubSubscribe,uniqueId);

        const response = await responsePromise;
        res.status(200).send(response)
    } catch (error: any) { // Ensure TypeScript recognizes the error type
        res.status(500).send(`Failed to process buy order: ${error.message || 'Unknown error occurred.'}`);
    } finally{
        pubsubSubscribe.unsubscribe(uniqueId.toString())
    }
})

orderRouter.post("/sell",authMiddleware,async(req:Request,res:Response)=>{
    const parsedBody= OrderPayload.safeParse(req.body);

    if (!parsedBody.success) {
        res.status(400).send("Incorrect Credentials");
        return;
    }

    const orderPayload = req.body;
    const uniqueId=idGen();
    // const uniqueId=999;     // remove this before deploying to production
    orderPayload["uniqueId"]=uniqueId;

    try {
        await requestQueue.lpush('/order/sell',JSON.stringify(orderPayload));

        const responsePromise:Promise<string>= getResponseFrmEngine(pubsubSubscribe,uniqueId);

        const response = await responsePromise;
        res.status(200).send(response)
    } catch (error: any) { // Ensure TypeScript recognizes the error type
        res.status(500).send(`Failed to process sell: ${error.message || 'Unknown error occurred.'}`);
    } finally{
        pubsubSubscribe.unsubscribe(uniqueId.toString())
    }
})

export default orderRouter;