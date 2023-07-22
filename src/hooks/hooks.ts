import { useDispatch } from "react-redux";
import CodePayload from "../model/CodePayload";
import CodeType from "../model/CodeType";
import { codeActions } from "../redux/slices/codeSlice";
import { useEffect, useState } from "react";
// import Employee from "../model/Employee";
import { Subscription } from "rxjs";
// import { employeesService } from "../config/service-config";

export function useDispatchCode() {
    const dispatch = useDispatch();
    return (error: string, successMessage: string) => {
        let code: CodeType = CodeType.OK;
        let message: string = '';
        console.log("Type of the error is: ", typeof error, error ? "yes" : "no");
        if (error && typeof error === "string" && error.includes('Authentication')) {

            code = CodeType.AUTH_ERROR;
            message = "Authentication error, mooving to Sign In";
        } else {
            code = error && typeof error === "string" && error.includes('unavailable') ? CodeType.SERVER_ERROR :
                CodeType.UNKNOWN;
            message = error.toString();
        }
        dispatch(codeActions.set({ code, message: message || successMessage }))
    }
}
// export function useSelectorEmployees() {
//     const dispatch = useDispatchCode();
//     const [employees, setEmployees] = useState<Employee[]>([]);
//     useEffect(() => {

//         const subscription: Subscription = employeesService.getEmployees()
//             .subscribe({
//                 next(emplArray: Employee[] | string) {
//                     let errorMessage: string = '';
//                     if (typeof emplArray === 'string') {
//                         errorMessage = emplArray;
//                     } else {
//                         setEmployees(emplArray.map(e => ({ ...e, birthDate: new Date(e.birthDate) })));
//                     }
//                     dispatch(errorMessage, '');

//                 }
//             });
//         return () => subscription.unsubscribe();
//     }, []);
//     return employees;
// }

