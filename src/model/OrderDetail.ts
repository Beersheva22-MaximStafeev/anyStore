import { ProductAdd } from "./ShoppingCartDetails"

export type OrderDetail = {
    id?: string,
    uid: string,
    creationDate: Date,
    // creationDateString: string,
    status: "new" | "delivered",
    deliveryDate: Date | null,
    // deliveryDateString: string,
    sum: number,
    deliveryAddress: string,
    prodicts: ProductAdd[]
}