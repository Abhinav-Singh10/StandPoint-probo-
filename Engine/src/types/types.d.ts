export type Balance = {
    balance: number,
    locked: number,
};

export type OrderList = {
    total: number,
    orders: Order[]
};

export type Order={
    userId:string,
    quantity: number,
    reciprocal: boolean,
    orderId: string,
    timestamp:number
}

export type StockPrice=number;

export type StockOrderBook = {
    yes: { [price in StockPrice]: OrderList },
    no: { [price in StockPrice]: OrderList }
};

export type StockBalance = {
    yes: {
      quantity: number,
      locked: number
    };
    no: {
      quantity: number,
      locked: number
    };
};

export type TradePayload ={
    userId:string,
    stockSymbol:string,
    quantity:number,
    price:number
}

export type OrderPayload ={
    userId:string,
    stockSymbol:string,
    quantity:number,
    price:number,
    stockType: "yes"|"no"
}