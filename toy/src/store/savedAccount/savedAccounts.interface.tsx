export const SAVEDACCOUNTS_REQUEST_START = "SAVEDACCOUNTS_REQUEST_START"
export const SAVEDACCOUNTS_REQUEST_SUCCESS = "SAVEDACCOUNTS_REQUEST_SUCCESS"
export const SAVEDACCOUNTS_REQUEST_DELETE = "SAVEDACCOUNTS_REQUEST_DELETE"
export const SAVEDACCOUNTS_REQUEST_ERROR = "SAVEDACCOUNTS_REQUEST_ERROR"

export interface savedAccountsReqStart {
    type: typeof SAVEDACCOUNTS_REQUEST_START
}
export interface savedAccountsReqSuccess {
    type: typeof SAVEDACCOUNTS_REQUEST_SUCCESS
    savedaccounts: string
}
export interface savedAccountsReqDelete {
    type: typeof SAVEDACCOUNTS_REQUEST_DELETE
    savedaccounts: string[]
}
export interface savedAccountsReqError {
    type: typeof SAVEDACCOUNTS_REQUEST_ERROR
    error: string
}

export type savedAccountsActionData =
    | savedAccountsReqStart
    | savedAccountsReqSuccess
    | savedAccountsReqError
    | savedAccountsReqDelete
