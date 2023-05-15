export const MYACCOUNTS_REQUEST_START = "MYACCOUNTS_REQUEST_START"
export const MYACCOUNTS_REQUEST_SUCCESS = "MYACCOUNTS_REQUEST_SUCCESS"
export const MYACCOUNTS_REQUEST_ERROR = "MYACCOUNTS_REQUEST_ERROR"

export interface myAccountsType {
    account: string
    publicKey: string
    privateKey: string
    balance: number
}

export interface myAccountsReqStart {
    type: typeof MYACCOUNTS_REQUEST_START
}
export interface myAccountsReqSuccess {
    type: typeof MYACCOUNTS_REQUEST_SUCCESS
    myaccounts: string[]
}
export interface myAccountsReqError {
    type: typeof MYACCOUNTS_REQUEST_ERROR
    error: string
}

export type myAccountsActionData = myAccountsReqStart | myAccountsReqSuccess | myAccountsReqError
