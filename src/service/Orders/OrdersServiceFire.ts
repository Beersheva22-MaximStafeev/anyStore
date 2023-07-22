import { CollectionReference, DocumentReference, FirestoreError, addDoc, collection, doc, 
    getDoc, getDocs, getFirestore, query, where, orderBy, QuerySnapshot, DocumentData, updateDoc } from "firebase/firestore";
import InputResult from "../../model/InputResult";
import { ProductAdd } from "../../model/ShoppingCartDetails";
import OrdersService from "./OrdersService";
import appFirebase from "../../config/firebase-config";
import { getRandomInt } from "../../util/random";
import { OrderDetail } from "../../model/OrderDetail";
import { getAllSum } from "../../util/number-functions";

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

export default class OrdersServiceFire implements OrdersService {
    private dbFirestore = getFirestore(appFirebase);
    private collectionName = "orders";
    private collectionRef: CollectionReference = collection(this.dbFirestore, this.collectionName);

    private getDocRef(id: any): DocumentReference {
        return doc(this.collectionRef, id);
    }

    private async exists(docRef: DocumentReference): Promise<boolean> {
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    }
    
    async submitShoppingCart(userId: any, shoppingCart: ProductAdd[], deliveryAddress: string): Promise<InputResult> {
        const creationDate = new Date();
        const order: OrderDetail = {
            creationDate,
            deliveryDate: null,
            prodicts: shoppingCart,
            uid: userId,
            status: "new",
            sum: getAllSum(shoppingCart.map(el => ({sum: el.sum}))),
            deliveryAddress
        }
        console.log(order);
        let res;
        try {
            res = await addDoc(this.collectionRef, order);
        } catch (error) {
            console.log(error);
            throw getErrorMessage(error as FirestoreError);
        }
        return {status: "success", message: `Order #${res.id} added`};
    }
    async getOrders(userId: any): Promise<OrderDetail[]> {
        const myQuery = await getDocs(query(this.collectionRef, where("uid", "==", userId)));
        //, orderBy("creationDate", "desc")
        return this.arrange(myQuery);
        // return .docs.map(el => ({...el.data(), id: el.id, creationDate: new Date(el.data().creationDate)}) as OrderDetail);
        //, orderBy("creationDate", "desc")
    }
    async getAllOrders(): Promise<OrderDetail[]> {
        const myQuery = await getDocs(query(this.collectionRef));
        return this.arrange(myQuery);
        // return ().docs.map(el => ({...el.data(), id: el.id, creationDate: new Date(el.data().creationDate)}) as OrderDetail);
    }

    arrange(data: QuerySnapshot<DocumentData>): OrderDetail[] {
        // const first = (data.docs[0] as OrderDetail).creationDate;
        const res = data.docs.map(el => (
            {
                ...el.data(), 
                creationDate: el.data().creationDate.toDate(),
                id: el.id, 
                deliveryDate: el.data().deliveryDate ? el.data().deliveryDate.toDate() : el.data().deliveryDate
            }) as OrderDetail)
            .sort((order1, order2) => {
                if (order1.status > order2.status) return -1;
                if (order1.status < order2.status) return 1;
                if (order1.creationDate > order2.creationDate) return -1;
                return 1;
            });
        return res;
    }

    async updateOrderDeliveryDatetimeAndStatus(orderId: any, deliveryDatetimeUpdated: Date): Promise<void> {
        try {
            const docRef = this.getDocRef(orderId);
            const order = (await getDoc(docRef)).data() as OrderDetail;
            order.deliveryDate = deliveryDatetimeUpdated;
            order.status = "delivered";
            await updateDoc(docRef, order);
        } catch (error) {
            throw getErrorMessage(error as FirestoreError);
        }
    }
}