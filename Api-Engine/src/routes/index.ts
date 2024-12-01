import { Router } from "express";
import authRouter from "./authRouter";
import orderRouter from "./orderRouter";
 
const rootRouter = Router();

// handle auth
rootRouter.use("/auth",authRouter);

// app.post("api/v1/user")
// app.post("api/v1/symbol")
// app.post("api/v1/orderbook") //2
// app.post("api/v1/balances") //4
// app.post("api/v1/reset")
// app.post("api/v1/onramp")
// app.post("api/v1/onramp")
rootRouter.use("/order",orderRouter)
// app.post("api/v1/trade") 

export default rootRouter;