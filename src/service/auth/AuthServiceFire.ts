import LoginData from "../../model/LoginData";
import UserData from "../../model/UserData";
import AuthService from "./AuthService";
import {getFirestore, collection, getCountFromServer, query, where, getDoc, doc} from "firebase/firestore";
import {GoogleAuthProvider, getAuth, initializeAuth, signInWithEmailAndPassword, signInWithPopup, signOut} from "firebase/auth"
import appFirebase from "../../config/firebase-config";

export default class AuthServiceFire implements AuthService {
    
    private auth = getAuth(appFirebase);
    private administrators = collection(getFirestore(appFirebase), "administrators");

    private async isAdmin(uid: any): Promise<boolean> {
        const docRef = doc(this.administrators, uid);
        const res = await getDoc(docRef);
        // console.log(uid);
        // console.log(docRef);
        // console.log(res);
        // console.log(res.exists());
        
        return res.exists();
        // return false;
    }

    async login(loginData: LoginData): Promise<UserData> {
        let userData: UserData = null;
        try {
            const userAuth = loginData.email === "GOOGLE" ? 
                await signInWithPopup(this.auth, new GoogleAuthProvider()) :
                await signInWithEmailAndPassword(this.auth, loginData.email, loginData.password);
            userData = {email: userAuth.user.email!, role: (await this.isAdmin(userAuth.user.uid)) ? "admin": "user"}
        } catch (error) {

        }
        return userData;
        // throw new Error("Method not implemented.");
    }
    logout(): Promise<void> {
        return signOut(this.auth);
        // throw new Error("Method not implemented.");
    }

}