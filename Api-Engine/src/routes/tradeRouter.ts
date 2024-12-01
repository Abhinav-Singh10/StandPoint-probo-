import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { MintPayload } from "../types/types";
import { idGen } from "../utils/idGen";
import { pubsubSubscribe, requestQueue} from "../server";
import getResponseFrmEngine from "../utils/getResponeFrmEngine";

const tradeRouter= Router();

tradeRouter.post("/mint",authMiddleware,async(req,res)=>{
    const parsedBody = MintPayload.safeParse(req.body);

    if (!parsedBody.success) {
        res.status(400).send("Please send correct stock symbol and quantity")
    }

    const mintPayload= req.body;
    const uniqueId=idGen();
    mintPayload.uniqueId=uniqueId;


    try {
        await requestQueue.lpush('/trade/mint',JSON.stringify(mintPayload));

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

export default tradeRouter;