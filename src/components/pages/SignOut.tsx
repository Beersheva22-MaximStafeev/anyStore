import {useDispatch} from 'react-redux';
import { authActions } from '../../redux/slices/authSlice';
import { Box, Button, Typography } from '@mui/material';
import { authService } from '../../config/service-config';
import UserManagementFire from '../../service/UserManagement/UserManagementFire';
import { useSelectorAuth } from '../../redux/store';
const SignOut: React.FC = () => {
    const dispatch = useDispatch();
    // https://firebase.google.com/docs/auth/web/manage-users?hl=ru
    const userData = useSelectorAuth();


    return <Box>
        <Button variant="contained" onClick={() => {
            dispatch(authActions.reset());
            authService.logout();
        }}>confirm sign out</Button>
        
        {authService.isEmailVerifyed() || userData?.role === "admin" ? <Typography>Email confirmed</Typography> : 
        <Button onClick={() => {
            new UserManagementFire().sendEmail();
        }}>Send confirmation Email</Button>}

    </Box>
}
 
 export default SignOut;