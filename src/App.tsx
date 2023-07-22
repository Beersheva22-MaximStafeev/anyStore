import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigatorDispatcher from "./components/navigators/NavigatorDispatcher";
import { RouteType } from "./components/navigators/Navigator";

import routesConfig from './config/routes-config.json';

import SignIn from "./components/pages/SignIn";
import SignOut from "./components/pages/SignOut";
import NotFound from "./components/pages/NotFound";
import Orders from "./components/pages/Orders/Orders";
import ShoppingCart from "./components/pages/ShoppingCart";
import Users from "./components/pages/Users";
import Products from "./components/pages/Products/Products";
// import Employees from "./components/pages/Employees";
// import AddEmployee from "./components/pages/AddEmployee";
// import AgeStatistics from "./components/pages/AgeStatistics"; 
// import SalaryStatistics from "./components/pages/SalaryStatistics";
// import Generation from "./components/pages/Generation";
import './App.css'
import { useDispatch } from "react-redux";
import { useSelectorAuth } from "./redux/store";
import { useSelectorCode } from "./redux/store";
import { codeActions } from "./redux/slices/codeSlice";

import { useMemo } from "react";
import UserData from "./model/UserData";
import { StatusType } from "./model/StatusType";
import CodeType from "./model/CodeType";
import { authActions } from "./redux/slices/authSlice";
import { authService } from "./config/service-config";
import { Alert, Snackbar } from "@mui/material";

const { pages } = routesConfig;
type RouteTypeOrder = RouteType & { order?: number }

function getRoutes(userData: UserData): RouteType[] {
  const role = userData ? userData.role : "notAuthenticated";
  return pages
    .filter(page => (page.roles as string[]).some(r => r === role || userData && (r === "authenticated")))
    .map(route => {
      if (route.to === "/signout") {
        route.label = userData?.email ?? route.label;
      }
      return route;
    });
}

function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

const App: React.FC = () => {
  const userData = useSelectorAuth();
  const code = useSelectorCode();
  const dispatch = useDispatch();

  const [alertMessage, severity] = useMemo(() => codeProcessing(), [code]);
  const routes = useMemo(() => getRoutes(userData), [userData]);
  function codeProcessing(): [string, StatusType] {
    const res: [string, StatusType] = [code.message, 'success'];
    switch (code.code) {
      case CodeType.OK: res[1] = 'success'; break;
      case CodeType.SERVER_ERROR: res[1] = 'error'; break;
      case CodeType.UNKNOWN: res[1] = 'error'; break;
      case CodeType.AUTH_ERROR: res[1] = 'error';
        dispatch(authActions.reset());
        authService.logout()
    }
    return res;
  }
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<NavigatorDispatcher routes={routes} />}>
        <Route index element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="shoppingCart" element={<ShoppingCart />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signout" element={<SignOut />} />
        <Route path="users" element={<Users />} />
        <Route path="/*" element={<NotFound />} />
      </Route>
    </Routes>
    <Snackbar open={!!alertMessage} autoHideDuration={20000}
      onClose={() => dispatch(codeActions.reset())}>
      <Alert onClose={() => dispatch(codeActions.reset())} severity={severity} sx={{ width: '100%' }}>
        {alertMessage}
      </Alert>
    </Snackbar>
  </BrowserRouter>
}
export default App;