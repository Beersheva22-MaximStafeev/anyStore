import Product from "./Product";

export type ShoppingCardRecord = {
    id: string,
    count: number
}
export type ShoppingCardDetails = {
    shoppingCart: ShoppingCardRecord[]
};

export type ProductAdd = Product & {sum: number, count: number};