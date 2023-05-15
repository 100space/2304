import { Dispatch } from "redux"
import {
    savedAccountsActionData,
    SAVEDACCOUNTS_REQUEST_START,
    SAVEDACCOUNTS_REQUEST_SUCCESS,
    SAVEDACCOUNTS_REQUEST_ERROR,
    SAVEDACCOUNTS_REQUEST_DELETE,
} from "./savedAccounts.interface"

export const changeSavedAccount = (savedaccounts: string | string[]) => {
    return async (dispatch: Dispatch<savedAccountsActionData>) => {
        dispatch({ type: SAVEDACCOUNTS_REQUEST_START })
        try {
            if (typeof savedaccounts === "string") {
                dispatch({ type: SAVEDACCOUNTS_REQUEST_SUCCESS, savedaccounts })
            } else {
                dispatch({ type: SAVEDACCOUNTS_REQUEST_DELETE, savedaccounts })
            }
        } catch (error: any) {
            dispatch({ type: SAVEDACCOUNTS_REQUEST_ERROR, error: error.message })
        }
    }
}
