import Redis from "ioredis";
import { Balance, StockBalance, StockOrderBook } from "./types/types";
import { checkAndLockFunds } from "./utils/checkAndLockFunds";

const requestQueue = new Redis(6379);
export const pubsub = new Redis(6380);

interface userPayload {
  userId: string;
  uniqueId: number;
}

interface stockSymPayload {
  stockSymbol: string;
  uniqueId: number;
}

interface onrampPayload {
  userId: string;
  amount: number;
  uniqueId: number;
}

interface mintPayload {
  userId: string;
  stockSymbol: string;
  quantity: number;
  price: number;
  uniqueId: number;
}

//In mem states

export let INR_BALANCES: { [userId: string]: Balance } = {
  user1: {
    balance: 400_00,
    locked: 600_00,
  },
  user2: {
    balance: 2100_00,
    locked: 25,
  },
};

export let ORDERBOOK: { [symbol: string]: StockOrderBook } = {
  ETH_USD_15_Oct_2024_12_00: {
    yes: {
      6.0: {
        total: 100,
        orders: [
          {
            userId: "user1",
            quantity: 100,
            reciprocal: false,
            orderId: "ORD001",
            timestamp: 1729278230859,
          },
        ],
      },
      7.0: {
        total: 200,
        orders: [
          {
            userId: "probo user1",
            quantity: 200,
            reciprocal: true,
            orderId: "936d84",
            timestamp: 1729325107876,
          },
        ],
      },
    },
    no: {
      5.0: {
        total: 200,
        orders: [
          {
            userId: "user2",
            quantity: 100,
            reciprocal: false,
            orderId: "ORD002",
            timestamp: 1729278249618,
          },
          {
            userId: "user2",
            quantity: 100,
            reciprocal: false,
            orderId: "ORD2002",
            timestamp: 1729278273652,
          },
        ],
      },
    },
  },
  SOL: {
    yes: {},
    no: {},
  },
};

export let STOCK_BALANCES: { [userId: string]: { [symbol: string]: StockBalance } } = {
  user1: {
    ETH_USD_15_Oct_2024_12_00: {
      yes: {
        quantity: 0,
        locked: 100,
      },
      no: {
        quantity: 100,
        locked: 0,
      },
    },
    SOL: {
      yes: {
        quantity: 100,
        locked: 0,
      },
      no: {
        quantity: 100,
        locked: 0,
      },
    },
  },
  user2: {
    BTC_USDT_10_Oct_2024_9_30: {
      yes: {
        quantity: 0,
        locked: 0,
      },
      no: {
        quantity: 0,
        locked: 0,
      },
    },
    SOL: {
      yes: {
        quantity: 100,
        locked: 0,
      },
      no: {
        quantity: 100,
        locked: 0,
      },
    },
    ETH_USD_15_Oct_2024_12_00: {
      yes: {
        quantity: 0,
        locked: 0,
      },
      no: {
        quantity: 0,
        locked: 200,
      },
    },
  },
};

async function processQueue() {
  while (true) {
    console.log("Accepting Requests from Queue");

    try {
      console.log("Fetching requests");

      const result = await requestQueue.brpop(
        "/user/create",
        "/symbol/create/:stockSymbol",
        "/orderbook",
        "/orderbook/:stockSymbol",
        "/balances/inr",
        "/balances/stock",
        "/balances/inr/:userId",
        "/balances/stock/:userId",
        "/reset",
        "/onramp/inr",
        "/order/buy",
        "/order/sell",
        "/trade/mint",0
      );

      if (result) {
        const [queue, data] = result;
        console.log(`queue: ${queue}`);
        console.log(`data: ${data}`);

        switch (queue) {
          case "/orderbook": {
            const uniqueId = data;
            await pubsub.publish(`${uniqueId}`, JSON.stringify(ORDERBOOK));
            break;
          }

          case "/balances/inr": {
            const uniqueId = data;
            await pubsub.publish(`${uniqueId}`, JSON.stringify(INR_BALANCES));
            break;
          }

          case "/balances/stock": {
            const uniqueId = data;
            await pubsub.publish(`${uniqueId}`, JSON.stringify(STOCK_BALANCES));
            break;
          }

          case "/reset": {
            const uniqueId = data;
            INR_BALANCES = {};
            STOCK_BALANCES = {};
            ORDERBOOK = {};
            await pubsub.publish(
              `${uniqueId}`,
              JSON.stringify("Reset Successful")
            );
            break;
          }

          case "/user/create": {
            const parsedJson: userPayload = JSON.parse(data);
            const userId = parsedJson.userId;
            const uniqueId = parsedJson["uniqueId"];

            if (INR_BALANCES[userId]) {
              await pubsub.publish(
                `${uniqueId}`,
                JSON.stringify({ error: "User is already created" })
              );
              break;
            }

            INR_BALANCES[userId] = {
              balance: 0,
              locked: 0,
            };
            STOCK_BALANCES[userId] = {};

            await pubsub.publish(
              `${uniqueId}`,
              JSON.stringify("User Created Sucessfully")
            );

            break;
          }

          case "/symbol/create/:stockSymbol": {
            const parsedBody: stockSymPayload = JSON.parse(data);
            const stockSymbol = parsedBody.stockSymbol;
            const uniqueId = parsedBody.uniqueId;

            console.log("StockSymbol", stockSymbol);
            console.log(typeof stockSymbol);

            if (ORDERBOOK[stockSymbol]) {
              await pubsub.publish(
                `${uniqueId}`,
                JSON.stringify({
                  error: "Market already exists for this Stock Symbol",
                })
              );
              break;
            }

            ORDERBOOK[stockSymbol] = {
              yes: {},
              no: {},
            };

            await pubsub.publish(
              `${uniqueId}`,
              JSON.stringify("Market with Stock Symbol created sucessfully")
            );

            break;
          }

          case "/balances/stock/:userId": {
            const parsedJson: userPayload = JSON.parse(data);
            const userId = parsedJson.userId;
            const uniqueId = parsedJson.uniqueId;

            if (!STOCK_BALANCES[userId]) {
              await pubsub.publish(
                `${uniqueId}`,
                JSON.stringify({
                  error: "User does not exist",
                })
              );
              break;
            }

            await pubsub.publish(
              `${uniqueId}`,
              JSON.stringify(STOCK_BALANCES[userId])
            );
            break;
          }

          case "/balances/inr/:userId": {
            const parsedJson: userPayload = JSON.parse(data);
            const userId = parsedJson.userId;
            const uniqueId = parsedJson.uniqueId;

            if (!INR_BALANCES[userId]) {
              await pubsub.publish(
                `${uniqueId}`,
                JSON.stringify({
                  error: "User does not exist",
                })
              );
              break;
            }

            const res = INR_BALANCES[userId];
            await pubsub.publish(`${uniqueId}`, JSON.stringify(res));
            break;
          }

          case "/onramp/inr": {
            const parsedBody: onrampPayload = JSON.parse(data);
            const userId = parsedBody.userId;
            const amount = parsedBody.amount;
            const uniqueId = parsedBody.uniqueId;

            if (!INR_BALANCES[userId]) {
              await pubsub.publish(
                `${uniqueId}`,
                JSON.stringify({
                  error: "User does not exist",
                })
              );
              break;
            }

            INR_BALANCES[userId].balance += +amount;

            await pubsub.publish(
              `${uniqueId}`,
              JSON.stringify(INR_BALANCES[userId])
            );

            break;
          }

          case "/trade/mint": {
            const parsedBody: mintPayload = JSON.parse(data);
            const userId = parsedBody.userId;
            const stockSymbol = parsedBody.stockSymbol;
            const quantity = parsedBody.quantity;
            const price = parsedBody.price;
            const uniqueId = parsedBody.uniqueId;

            await checkAndLockFunds(userId,stockSymbol,quantity,price,"mint",uniqueId)

            if (STOCK_BALANCES[userId][stockSymbol]?.yes) {
                STOCK_BALANCES[userId][stockSymbol].yes.quantity+=quantity;
                STOCK_BALANCES[userId][stockSymbol].no.quantity+=quantity;
                }else{
                STOCK_BALANCES[userId][stockSymbol]={
                  yes:{
                    quantity:quantity,
                    locked:0,
                  },
                  no:{
                    quantity:quantity,
                    locked:0,
                  }
                }
            }

            await pubsub.publish(
                `${uniqueId}`,
                JSON.stringify(STOCK_BALANCES[userId][stockSymbol])
              );
  
              break;
          }

          default: {
            const parsedBody: stockSymPayload = JSON.parse(data);
            const stockSymbol = parsedBody.stockSymbol;
            const uniqueId = parsedBody.uniqueId;

            if (!ORDERBOOK[stockSymbol]) {
              await pubsub.publish(
                `${uniqueId}`,
                JSON.stringify({
                  error: "Market does not exist",
                })
              );
              break;
            }

            await pubsub.publish(
              `${uniqueId}`,
              JSON.stringify(ORDERBOOK[stockSymbol])
            );

            break;
          }
        }
      }
    } catch (error) {
      console.error("Error processing from request queue:", error);
    }
  }
}
processQueue();
