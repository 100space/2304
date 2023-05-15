import {
    savedAccountsActionData,
    SAVEDACCOUNTS_REQUEST_START,
    SAVEDACCOUNTS_REQUEST_SUCCESS,
    SAVEDACCOUNTS_REQUEST_ERROR,
    SAVEDACCOUNTS_REQUEST_DELETE,
} from "./savedAccounts.interface"

export interface savedAccountsStateType {
    isLoading: boolean
    savedaccounts: string[]
    error: null
}
export const initState: savedAccountsStateType = {
    isLoading: false,
    savedaccounts: [],
    error: null,
}

export const savedAccountState = (state = initState, action: savedAccountsActionData) => {
    switch (action.type) {
        case SAVEDACCOUNTS_REQUEST_START:
            return { ...state, isLoading: true, error: null }
        case SAVEDACCOUNTS_REQUEST_SUCCESS:
            console.log(action.savedaccounts)
            return { ...state, isLoading: false, savedaccounts: [...state.savedaccounts, action.savedaccounts] }
        case SAVEDACCOUNTS_REQUEST_DELETE:
            return { ...state, isLoading: false, savedaccounts: action.savedaccounts }
        case SAVEDACCOUNTS_REQUEST_ERROR:
            return { ...state, isLoading: false, error: action.error }
        default:
            return state
    }
}
