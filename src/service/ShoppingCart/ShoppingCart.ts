import { ProductAdd, ShoppingCardDetails } from "../../model/ShoppingCartDetails";

export default interface ShoppingCart {
    addToCart(userId: any, productId: any): Promise<void>;
    getCart(userId: any): Promise<ShoppingCardDetails>;
    setProductCount(userId: any, productId: any, count: number): Promise<void>;
    getCartWithDetails(userId: any): Promise<ProductAdd[]>;
    clearShoppingCart(userId: any): Promise<void>;
}