import {useDispatch} from 'react-redux';
import { authActions } from '../../redux/slices/authSlice';
import { Box, Button } from '@mui/material';
import { authService } from '../../config/service-config';
import UserManagementFire from '../../service/UserManagement/UserManagementFire';
const SignOut: React.FC = () => {
    const ooo = {
        "10": 1,
        "20": 4,
        "11": 400
    }
    console.log(ooo);
    
    
    console.log(typeof ooo);
    console.log(ooo[10]);
    console.log(Object.keys(ooo).some(el => el === "10"));

    const mapa = new Map<string, number>();
    mapa.set("10", 1);
    mapa.set("20", 4);
    mapa.set("11", 400);
    console.log(mapa.has("13"));
    console.log(typeof mapa);
    
    const dispatch = useDispatch();
    return <Box>
        <Button variant="contained" onClick={() => {
            dispatch(authActions.reset());
            authService.logout();
        }}>confirm sign out</Button>
        <Button onClick={() => {
            new UserManagementFire().sendEmail();
        }}>Send confirmation Email</Button>
    </Box>
}
 
 export default SignOut;