import IdType from "./IdType";
import Unit from "./Unit"

type Product = {
    id?: IdType,
    name: string,
    description: string,
    category: string,
    imageUrl: string,
    price: number,
    unit: string
}
export default Product;