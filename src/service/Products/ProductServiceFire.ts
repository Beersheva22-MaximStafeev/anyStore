import { Observable, catchError, map, of } from "rxjs";
import IdType from "../../model/IdType";
import Product from "../../model/Product";
import ProductService from "./ProductService";
import { CollectionReference, DocumentReference, FirestoreError, 
    addDoc, collection, deleteDoc, updateDoc, doc, getDoc, getFirestore, getDocs, getDocsFromServer, query, limit, setDoc, startAfter } 
    from "firebase/firestore";
import { StorageReference, getDownloadURL, getStorage, ref, uploadBytes, getMetadata } from "firebase/storage";
import {collectionData} from "rxfire/firestore";
import appFirebase from "../../config/firebase-config";
import InputResult from "../../model/InputResult";
import { getRandomInt } from "../../util/random";

const MIN_ID = 1000000;
const MAX_ID = MIN_ID * 10;

function getErrorMessage(firestoreError: FirestoreError): string {
    let errorMessage = "";
    if (typeof firestoreError === "string") {
        return firestoreError;
    }
    switch (firestoreError.code) {
        case "unauthenticated": 
        case "permission-denied":
            errorMessage = "Authentication error";
            break;
        default:   
            errorMessage = firestoreError.message;
    }
    return errorMessage;
}


function getProductWithId(product: Product, id?: string): any {
    const res: any = {...product, id: id ? id : product.id};
    return res;
}

export default class ProductServiceFire implements ProductService {
    private collectionRef: CollectionReference = collection(getFirestore(appFirebase), "products");
    private storage = getStorage(appFirebase);

    private getDocRef(id: IdType): DocumentReference {
        return doc(this.collectionRef, id.toString());
    }

    private async exists(docRef: DocumentReference): Promise<boolean> {
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    }

    private async getId(): Promise<string> {
        let id: string;
        do {
            id = getRandomInt(MIN_ID, MAX_ID).toString();
        } while (await this.exists(this.getDocRef(id)));
        return id;
    }

    async addProduct(product: Product): Promise<Product> {
        try {
            const id = await this.getId();
            product = getProductWithId(product, id);
            const res = await setDoc(this.getDocRef(id), product);
            return product;
        } catch (error) {
            throw getErrorMessage(error as FirestoreError);
        }
    }

    async deleteProduct(id: IdType): Promise<void> {
        const docRef: DocumentReference = this.getDocRef(id);
        if (!await this.exists(docRef)) {
            throw "Not found";
        }
        try {
            await deleteDoc(docRef);
        } catch (error) {
            throw getErrorMessage(error as FirestoreError);
        }
    }

    async updateProduct(product: Product): Promise<Product> {
        const docRef: DocumentReference = this.getDocRef(product.id ?? "");
        if (!await this.exists(docRef)) {
            throw "Not found";
        }
        try {
            await updateDoc(docRef, product);
        } catch (error) {
            throw getErrorMessage(error as FirestoreError);
        }
        return product;
    }

    async getProduct(id: IdType): Promise<Product> {
        const docRef = this.getDocRef(id);
        if (!await this.exists(docRef)) {
            throw "Not found";
        }
        return (await getDoc(doc(this.collectionRef, id))).data() as Product;
    }

    async getProductsById(id: IdType[]): Promise<Product[]> {
        return Promise.all(id.map(i => this.getProduct(i)));
        // const res: Product[] = [];
        // id.forEach(async i => res.push(await this.getProduct(i)));
        // return res;
    }

    async getProductsByPages(limitPerPage: number, lastId: any): Promise<Product[]> {
        // TODO
        // getDocsFromServer({firestore: getFirestore(appFirebase), converter: null, type: "collection"})
        const q = query(this.collectionRef, limit(limitPerPage), startAfter(lastId));
        // TODO
        return [];
    }

    async getAllProducts(): Promise<Product[]> {
        console.log("-- service getAllProducts");
        return (await getDocs(query(this.collectionRef))).docs.map(el => el.data() as Product);
    }

    subscrbeProducts(): Observable<Product[] | string> {
        return collectionData(this.collectionRef)
            // .pipe(
            //     map(el => {
            //         if (this.dataWithNoIds) {
            //             console.log("error observing");
            //             throw "Updating data";
            //         } else {
            //             console.log("end error observing");
            //         }
            //         return el;
            //     }),
            //     catchError(err => of(err))
            // )
            .pipe(catchError(error => of(getErrorMessage(error)))) as Observable<Product[] | string>;
    }

    async uploadFirst(data: string): Promise<InputResult> {
        try {
            const json = JSON.parse(data);
            json.products.forEach(async (product: Product) => {
                await this.addProduct(product);
            })
        } catch {
            return {status: "error", message: "wrong file"};
        }
        return {status: "success", message: "good"};
    }

    async uploadImg (image: File, name:string): Promise<string> {  
        console.log("--- start upload imgae");
        const fileName = `images/${name}.jpg`;
        const newImgRef = ref(this.storage, fileName); 
        let fileExists: boolean = false;
        const errorFileExists = "File with this name already exists";
        try {
            await getDownloadURL(newImgRef);
            console.log("file exists");
            throw errorFileExists;
        } catch (error) {
            if (error === errorFileExists) {
                throw error;
            }
            console.log("file NOT exists");
        }
        console.log(newImgRef);
        const metadata = {
            contentType: 'image/jpeg', 
        }; 
        try { 
          await uploadBytes(newImgRef, image, metadata);
          console.log("Uploaded ok");
        } catch (error: any) { 
            const firestorError: FirestoreError = error; 
            const errorMessage = getErrorMessage(firestorError); 
            throw errorMessage; 
        } 
        console.log("--- end upload imgae");
        return await getDownloadURL(newImgRef);
    } 
         
    async getImg (name?:string, storageRef?: StorageReference): Promise<string> { 
 
        const newImgRef: StorageReference = name==undefined ? storageRef! : ref(this.storage, `images/${name}.jpg`); 
        const newLink = await getDownloadURL(newImgRef) 
        return newLink; 
        
    }
}