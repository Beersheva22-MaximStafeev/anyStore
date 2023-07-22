import InputResult from "../../model/InputResult";
import { OrderDetail } from "../../model/OrderDetail";
import { ProductAdd } from "../../model/ShoppingCartDetails";

export default interface OrdersService {
    submitShoppingCart(userId: any, shoppingCart: ProductAdd[], deliveryAddress: string): Promise<InputResult>;
    getOrders(userId: any): Promise<OrderDetail[]>;
    getAllOrders(): Promise<OrderDetail[]>;
    updateOrderDeliveryDatetimeAndStatus(orderId: any, deliveryDatetimeUpdated: Date): Promise<void>;
}