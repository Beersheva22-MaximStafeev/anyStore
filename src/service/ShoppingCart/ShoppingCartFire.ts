import { CollectionReference, DocumentReference, FirestoreError, collection, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import appFirebase from "../../config/firebase-config";
import { ProductAdd, ShoppingCardDetails } from "../../model/ShoppingCartDetails";
import ShoppingCart from "./ShoppingCart";
import { productService } from "../../config/service-config";
import Product from "../../model/Product";
import { getSum } from "../../util/number-functions";

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

export default class ShoppingCartFire implements ShoppingCart {
    private collectionRef: CollectionReference = collection(getFirestore(appFirebase), "shoppingCart");

    private getDocRef(id: any): DocumentReference {
        return doc(this.collectionRef, id);
    }

    private async exists(docRef: DocumentReference): Promise<boolean> {
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    }

    async addToCart(userId: any, productId: any): Promise<void> {
        try {
            const currentCart = await this.getCart(userId);
            const currentRecord = currentCart.shoppingCart.find(rec => rec.id === productId);
            if (currentRecord) {
                this.setProductCount(userId, productId, currentRecord.count + 1);
            } else {
                this.setProductCount(userId, productId, 1);
            }
        } catch (error) {
            throw getErrorMessage(error as FirestoreError);
        }
    }
    
    async getCart(userId: any): Promise<ShoppingCardDetails> {
        const cartRef = this.getDocRef(userId);
        try {
            if (await this.exists(cartRef)) {
                return (await getDoc(cartRef)).data() as ShoppingCardDetails;
            }
        } catch (error) {
            throw getErrorMessage(error as FirestoreError);
        }
        return {shoppingCart: []} as ShoppingCardDetails;
    }

    async getCartWithDetails(userId: any): Promise<ProductAdd[]> {
        const res: ProductAdd[] = [];
        try {
            const currentCart = await this.getCart(userId);
            for (let i = 0; i < currentCart.shoppingCart.length; i++) {
                const el = currentCart.shoppingCart[i];
                let prod: Product;
                try {
                    prod = await productService.getProduct(el.id);
                } catch (error) {
                    await this.setProductCount(userId, el.id, 0);
                    continue;
                }
                const prodAdd: ProductAdd = {...prod, count: el.count, sum: getSum({count: el.count, price: prod.price})};
                res.push(prodAdd);
            }
        } catch (error) {
            console.log("Throw error here!" , error, typeof error, typeof (error  as FirestoreError), getErrorMessage(error as FirestoreError));
            
            throw getErrorMessage(error as FirestoreError);
        }
        return res;
    }

    async setProductCount(userId: any, productId: any, count: number): Promise<void> {
        try {
            const currentCart = await this.getCart(userId);
            const newCart: ShoppingCardDetails = currentCart;
            console.log(newCart);
            if (count === 0) {
                newCart.shoppingCart = currentCart.shoppingCart.filter(rec => rec.id != productId);
            } else {
                const productIndex = currentCart.shoppingCart.findIndex(rec => rec.id === productId);
                if (productIndex === -1) {
                    currentCart.shoppingCart.push({id: productId, count})
                } else {
                    currentCart.shoppingCart[productIndex].count = count;
                }
            }
            console.log(newCart);
            const cartRef = this.getDocRef(userId);
            await setDoc(cartRef, newCart);
        } catch (error) {
            throw getErrorMessage(error as FirestoreError);
        }
    }
    
    async clearShoppingCart(userId: any): Promise<void> {
        const cartRef = this.getDocRef(userId);
        await setDoc(cartRef, {shoppingCart: []} as ShoppingCardDetails);
    }
}