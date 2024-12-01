import { Redis } from "ioredis";

export default function getResponseFrmEngine(pubsub:Redis, uniqueId:number):Promise<string> {
      return new Promise((resolve,reject)=>{
        
        const timer=setTimeout(() => {
                reject(new Error ("Timeout waiting for response"))
        }, 10000);

        pubsub.subscribe(uniqueId.toString(),(err)=>{
            if(err){
                clearTimeout(timer);
                reject(new Error("failed to wait for response to buy:"))
            }
            console.log("Waiting for Response");
        })

        pubsub.on("message",(channel,message)=>{
            if (channel===uniqueId.toString()) {
                console.log(message);
                console.log(typeof message);
                
                const data = JSON.parse(message);
                clearTimeout(timer);
                resolve(data);
            }
        })
    })
}