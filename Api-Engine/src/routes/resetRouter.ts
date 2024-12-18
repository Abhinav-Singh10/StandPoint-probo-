import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { OrderPayload } from "../types/types";
import { idGen } from "../utils/idGen";
import { pubsubSubscribe, requestQueue} from "../server";
import getResponseFrmEngine from "../utils/getResponeFrmEngine";
const resetRouter= Router();

resetRouter.post("/",authMiddleware,async(req,res)=>{
    const uniqueId=idGen();

    try {
        await requestQueue.lpush("/reset",JSON.stringify(uniqueId));

        const responsePromise:Promise<string>= getResponseFrmEngine(pubsubSubscribe,uniqueId);

        const response = await responsePromise;

        res.status(200).send(response)
    } catch (error) {
        res.status(500).send("Failed to reset accoutn")
    } finally{
        pubsubSubscribe.unsubscribe(uniqueId.toString())
    }
})

export default resetRouter;