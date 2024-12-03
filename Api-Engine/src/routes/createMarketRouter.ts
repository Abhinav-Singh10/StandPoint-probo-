import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { pubsubSubscribe, requestQueue } from "../server";
import getResponseFrmEngine from "../utils/getResponeFrmEngine";
import { idGen } from "../utils/idGen";
const createMarketRouter= Router();

createMarketRouter.post("/create/:stockSymbol",authMiddleware,async(req,res)=>{
    const uniqueId= idGen();
    const stockSymbol= req.params.stockSymbol;
    const payload=  {
        stockSymbol: stockSymbol,
        uniqueId: uniqueId
    }

    try {
        await requestQueue.lpush("/symbol/create/:stockSymbol",JSON.stringify(payload));

        const responsePromise:Promise<string>= getResponseFrmEngine(pubsubSubscribe,uniqueId);

        const response = await responsePromise;
        res.status(200).send(response)
    } catch (error: any) { // Ensure TypeScript recognizes the error type
        res.status(500).send(`Failed to create Market: ${error.message || 'Unknown error occurred.'}`);
    } finally{
        pubsubSubscribe.unsubscribe(uniqueId.toString())
    }
})


export default createMarketRouter;