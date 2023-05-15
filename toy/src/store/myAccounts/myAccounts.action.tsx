import { Dispatch } from "redux"
import {
    myAccountsActionData,
    MYACCOUNTS_REQUEST_START,
    MYACCOUNTS_REQUEST_SUCCESS,
    MYACCOUNTS_REQUEST_ERROR,
} from "./myAccounts.interface"

export const changeMyAccount = (myaccounts: string[]) => {
    return async (dispatch: Dispatch<myAccountsActionData>) => {
        dispatch({ type: MYACCOUNTS_REQUEST_START })
        try {
            dispatch({ type: MYACCOUNTS_REQUEST_SUCCESS, myaccounts })
        } catch (error: any) {
            dispatch({ type: MYACCOUNTS_REQUEST_ERROR, error: error.message })
        }
    }
}
