import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { pubsubSubscribe, requestQueue } from "../server";
import getResponseFrmEngine from "../utils/getResponeFrmEngine";
import { idGen } from "../utils/idGen";
const balancesRouter= Router();

balancesRouter.get("/inr",authMiddleware,async(req,res)=>{
    const uniqueId= idGen();

    try {
        await requestQueue.lpush("/balances/inr",JSON.stringify(uniqueId));

        const responsePromise:Promise<string>= getResponseFrmEngine(pubsubSubscribe,uniqueId);

        const response = await responsePromise;

        res.status(200).send(response)
    } catch (error: any) { // Ensure TypeScript recognizes the error type
        res.status(500).send(`Failed to fetch balances: ${error.message || 'Unknown error occurred.'}`);
    } finally{
        pubsubSubscribe.unsubscribe(uniqueId.toString())
    }
})

balancesRouter.get("/stock",authMiddleware,async(req,res)=>{
    const uniqueId= idGen();

    try {
        await requestQueue.lpush("/balances/stock",JSON.stringify(uniqueId));

        const responsePromise:Promise<string>= getResponseFrmEngine(pubsubSubscribe,uniqueId);

        const response = await responsePromise;

        res.status(200).send(response)
    } catch (error: any) { // Ensure TypeScript recognizes the error type
        res.status(500).send(`Failed to fetch stock balances: ${error.message || 'Unknown error occurred.'}`);
    } finally{
        pubsubSubscribe.unsubscribe(uniqueId.toString())
    }
})

balancesRouter.get("/inr/:userId",authMiddleware,async(req,res)=>{
    const uniqueId=idGen();
    const payload=  {
        userId: req.params.userId,
        uniqueId: uniqueId
    }

    try {
        await requestQueue.lpush("/balances/inr/:userId",JSON.stringify(payload));

        const responsePromise:Promise<string>= getResponseFrmEngine(pubsubSubscribe,uniqueId);

        const response = await responsePromise;

        res.status(200).send(response)
    } catch (error: any) { // Ensure TypeScript recognizes the error type
        res.status(500).send(`Failed to fetch inr balances: ${error.message || 'Unknown error occurred.'}`);
    } finally{
        pubsubSubscribe.unsubscribe(uniqueId.toString())
    }
})

balancesRouter.get("/stock/:userId",authMiddleware,async(req,res)=>{
    const uniqueId=idGen();
    const payload=  {
        userId: req.params.userId,
        uniqueId: uniqueId
    }

    try {
        await requestQueue.lpush("/balances/stock/:userId",JSON.stringify(payload));

        const responsePromise:Promise<string>= getResponseFrmEngine(pubsubSubscribe,uniqueId);

        const response = await responsePromise;

        res.status(200).send(response)
    } catch (error: any) { // Ensure TypeScript recognizes the error type
        res.status(500).send(`Failed to fetch stock: ${error.message || 'Unknown error occurred.'}`);
    } finally{
        pubsubSubscribe.unsubscribe(uniqueId.toString())
    }
})

export default balancesRouter;