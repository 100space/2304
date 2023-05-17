import { Dispatch } from "redux"
import requestServer from "utils/requestServer"
import {
    myAccountsActionData,
    MYACCOUNTS_REQUEST_START,
    MYACCOUNTS_REQUEST_SUCCESS,
    MYACCOUNTS_REQUEST_ERROR,
} from "./myAccounts.interface"

export const changeMyAccount = () => {
    return async (dispatch: Dispatch<myAccountsActionData>) => {
        dispatch({ type: MYACCOUNTS_REQUEST_START })
        try {
            await requestServer.post("/wallet")
            const { data: myaccounts } = await requestServer.get("/wallet")
            dispatch({ type: MYACCOUNTS_REQUEST_SUCCESS, myaccounts })
        } catch (error: any) {
            dispatch({ type: MYACCOUNTS_REQUEST_ERROR, error: error.message })
        }
    }
}
