import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {OrampPayload} from "../types/types";
import { idGen } from "../utils/idGen";
import { pubsubSubscribe, requestQueue} from "../server";
import getResponseFrmEngine from "../utils/getResponeFrmEngine";
const onrampRouter= Router();

onrampRouter.post("/inr",authMiddleware,async(req,res)=>{
    const uniqueId= idGen();
    const parsedBody= OrampPayload.safeParse(req.body);

    if (!parsedBody.success) {
        res.status(400).send("Send amount in ruppees");
        return;
    }

    const onrampPayload = req.body;
    onrampPayload.uniqueId=uniqueId;

    try {
        await requestQueue.lpush("/onramp/inr",JSON.stringify(onrampPayload));

        const responsePromise:Promise<string>= getResponseFrmEngine(pubsubSubscribe,uniqueId);

        const response = await responsePromise;

        res.status(200).send(response)
    } catch (error: any) { // Ensure TypeScript recognizes the error type
        res.status(500).send(`Failed to add money : ${error.message || 'Unknown error occurred.'}`);
    } finally{
        pubsubSubscribe.unsubscribe(uniqueId.toString())
    }
    

})

export default onrampRouter;