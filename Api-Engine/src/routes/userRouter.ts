import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { pubsubSubscribe, requestQueue } from "../server";
import getResponseFrmEngine from "../utils/getResponeFrmEngine";
import { idGen } from "../utils/idGen";
const userRouter= Router();

userRouter.post("/create/:userId",authMiddleware,async (req,res)=>{
    const uniqueId= idGen();
    const payload=  {
        userId: req.userId,
        uniqueId: uniqueId
    }

    try {
        await requestQueue.lpush("/user/create",JSON.stringify(payload));

        const responsePromise:Promise<string>= getResponseFrmEngine(pubsubSubscribe,uniqueId);

        const response = await responsePromise;
        res.status(200).send(response)
    } catch (error) {
        res.status(500).send("Failed to create userID. Please try again later")
    } finally{
        pubsubSubscribe.unsubscribe(uniqueId.toString())
    }
})

export default userRouter;