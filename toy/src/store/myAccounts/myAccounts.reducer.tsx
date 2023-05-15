import {
    myAccountsActionData,
    MYACCOUNTS_REQUEST_START,
    MYACCOUNTS_REQUEST_SUCCESS,
    MYACCOUNTS_REQUEST_ERROR,
} from "./myAccounts.interface"

export interface myAccountsStateType {
    isLoading: boolean
    myaccounts: string[]
    error: null
}
export const initState: myAccountsStateType = {
    isLoading: false,
    myaccounts: [],
    error: null,
}

export const myAccountState = (state = initState, action: myAccountsActionData) => {
    switch (action.type) {
        case MYACCOUNTS_REQUEST_START:
            return { ...state, isLoading: true, error: null }
        case MYACCOUNTS_REQUEST_SUCCESS:
            return { ...state, isLoading: false, myaccounts: action.myaccounts }
        case MYACCOUNTS_REQUEST_ERROR:
            return { ...state, isLoading: false, error: action.error }
        default:
            return state
    }
}
