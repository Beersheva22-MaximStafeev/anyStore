import {useDispatch} from 'react-redux';
import { authActions } from '../../redux/slices/authSlice';
import { Button } from '@mui/material';
import { authService } from '../../config/service-config';
const SignOut: React.FC = () => {
    const dispatch = useDispatch();
    return <Button variant="contained" onClick={() => {
        dispatch(authActions.reset());
        authService.logout();
    }}>confirm sign out</Button>
}
 
 export default SignOut;