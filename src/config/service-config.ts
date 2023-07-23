import OrdersService from "../service/Orders/OrdersService";
import OrdersServiceFire from "../service/Orders/OrdersServiceFire";
import ProductService from "../service/Products/ProductService";
import ProductServiceFire from "../service/Products/ProductServiceFire";
import ShoppingCart from "../service/ShoppingCart/ShoppingCart";
import ShoppingCartFire from "../service/ShoppingCart/ShoppingCartFire";
import AuthService from "../service/auth/AuthService";
import AuthServiceFire from "../service/auth/AuthServiceFire";

export const authService: AuthService = new AuthServiceFire();

export const productService: ProductService = new ProductServiceFire();

export const shoppingCartService: ShoppingCart = new ShoppingCartFire();

export const ordersService: OrdersService = new OrdersServiceFire();