import { Observable } from "rxjs";
import IdType from "../../model/IdType";
import Product from "../../model/Product";
import InputResult from "../../model/InputResult";
import { StorageReference } from "firebase/storage";

export default interface ProductService {
    addProduct(product: Product): Promise<Product>;
    deleteProduct(id: IdType): Promise<void>;
    updateProduct(product: Product): Promise<Product>;
    getProduct(id: IdType): Promise<Product>;
    getProductsById(id: IdType[]): Promise<Product[]>;
    getProductsByPages(limit: number, last: any): Promise<Product[]>;
    getAllProducts(): Promise<Product[]>;
    subscrbeProducts(): Observable<Product[] | string>;
    uploadFirst(data: string): Promise<InputResult>;
    uploadImg (image: File, name:string): Promise<string>;
    getImg (name?:string, storageRef?: StorageReference): Promise<string>;
}