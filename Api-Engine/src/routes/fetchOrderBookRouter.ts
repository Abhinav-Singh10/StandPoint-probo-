import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { pubsubSubscribe, requestQueue } from "../server";
import getResponseFrmEngine from "../utils/getResponeFrmEngine";
import { idGen } from "../utils/idGen";
const fetchOrderBookRouter= Router();

fetchOrderBookRouter.get("/",async (req,res)=>{
    const uniqueId= idGen();

    try {
        await requestQueue.lpush("/orderbook",JSON.stringify(uniqueId));

        const responsePromise:Promise<string>= getResponseFrmEngine(pubsubSubscribe,uniqueId);

        const response = await responsePromise;

        res.status(200).send(response)
    } catch (error: any) { // Ensure TypeScript recognizes the error type
        res.status(500).send(`Failed to fetch Orderbook: ${error.message || 'Unknown error occurred.'}`);
    } finally{
        pubsubSubscribe.unsubscribe(uniqueId.toString())
    }
})

fetchOrderBookRouter.get("/:stockSymbol",async(req,res)=>{
    const uniqueId= idGen();
    const stockSymbol= req.params.stockSymbol;
    const payload={
        uniqueId:uniqueId,
        stockSymbol: stockSymbol
    }
    try {
        await requestQueue.lpush("/orderbook/:stockSymbol",JSON.stringify(payload));

        const responsePromise:Promise<string>= getResponseFrmEngine(pubsubSubscribe,uniqueId);

        const response = await responsePromise;

        res.status(200).send(response)
    } catch (error: any) { // Ensure TypeScript recognizes the error type
        res.status(500).send(`Failed to fetch orderbook: ${error.message || 'Unknown error occurred.'}`);
    } finally{
        pubsubSubscribe.unsubscribe(uniqueId.toString())
    }
})

export default fetchOrderBookRouter;