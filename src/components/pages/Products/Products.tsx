import { useSelectorAuth } from "../../../redux/store";
import ProductsUser from "./ProductsUser";
import ProductsAdmin from "./ProductsAdmin";


const Products: React.FC = () => {
    const userData = useSelectorAuth();
    return (userData?.role === "admin") ? <ProductsAdmin/> : <ProductsUser />
}
export default Products;