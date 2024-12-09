import { INR_BALANCES, pubsub } from "../server";

export const checkAndLockFunds = async (
  userId: string,
  stockSymbol: string,
  quantity: number,
  price: number,
  orderType: "mint" | "buy" | "sell",
  uniqueId:number,
) => {
  switch (orderType) {
    case "sell":
      break;

    default:
      // check if sufficient funds exist and lock em
      const amountNeeded= quantity*price
      if ((INR_BALANCES[userId]?.balance || 0) >= amountNeeded) {
        INR_BALANCES[userId].balance -= quantity * price;
        INR_BALANCES[userId].locked += quantity * price;
      } else {
        await pubsub.subscribe(`${uniqueId}`,JSON.stringify({error: "Insufficient Balance to executed transaction"}))
        break;
    }
}};
