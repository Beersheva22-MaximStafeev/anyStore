import {GoogleAuthProvider, getAuth, initializeAuth, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, signOut} from "firebase/auth"
import appFirebase from "../../config/firebase-config";

class UserManagementFire {
    private auth = getAuth(appFirebase);

    async sendEmail() {
        sendEmailVerification(this.auth.currentUser!)
            .then(() => console.log("Email sent"));
    }
}
export default UserManagementFire;