import { useDispatch } from "react-redux";
import CodePayload from "../model/CodePayload";
import CodeType from "../model/CodeType";
import { codeActions } from "../redux/slices/codeSlice";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";

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
