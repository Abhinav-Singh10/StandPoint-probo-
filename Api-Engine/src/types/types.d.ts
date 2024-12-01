export type OrderPayload ={
    userId:string,
    stockSymbol:string,
    quantity:number,
    price:number,
    stockType: "yes"|"no",
    uniqueId? : number
}