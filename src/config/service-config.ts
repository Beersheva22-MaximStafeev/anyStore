import OrdersService from "../service/Orders/OrdersService";
import OrdersServiceFire from "../service/Orders/OrdersServiceFire";
import ProductService from "../service/Products/ProductService";
import ProductServiceFire from "../service/Products/ProductServiceFire";
import ShoppingCart from "../service/ShoppingCart/ShoppingCart";
import ShoppingCartFire from "../service/ShoppingCart/ShoppingCartFire";
import AuthService from "../service/auth/AuthService";
import AuthServiceFake from "../service/auth/AuthServiceFake";
import AuthServiceFire from "../service/auth/AuthServiceFire";
import AuthServiceJwt from "../service/auth/AuthServiceJwt";
// import EmployeesService from "../service/crud/EmployeesService";
// import EmployeesServiceFire from "../service/crud/EmployeesServiceFire";
// import EmployeesServiceRest from "../service/crud/EmployeesServiceRest";

export const authService: AuthService = new AuthServiceFire();
// export const authService: AuthService = new AuthServiceFake();
// export const authService: AuthService = new AuthServiceJwt('http://localhost:3500/login');
// export const employeesService: EmployeesService = new EmployeesServiceFire();
// export const employeesService: EmployeesService = new EmployeesServiceRest("http://localhost:3500/employees");

export const productService: ProductService = new ProductServiceFire();

export const shoppingCartService: ShoppingCart = new ShoppingCartFire();

export const ordersService: OrdersService = new OrdersServiceFire();