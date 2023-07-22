import { useSelectorAuth } from "../../../redux/store";
import OrdersAdmin from "./OrdersAdmin";
import OrdersUser from "./OrdersUser";

const Orders: React.FC = () => {
    const userData = useSelectorAuth();
    return (userData?.role === "admin") ? <OrdersAdmin/> : <OrdersUser />
}
 
export default Orders;