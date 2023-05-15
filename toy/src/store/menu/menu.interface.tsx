export const MENU_REQUEST_START = "MENU_REQUEST_START"
export const MENU_REQUEST_SUCCESS = "MENU_REQUEST_SUCCESS"
export const MENU_REQUEST_ERROR = "MENU_REQUEST_ERROR"

export interface MenuReqStart {
    type: typeof MENU_REQUEST_START
}
export interface MenuReqSuccess {
    type: typeof MENU_REQUEST_SUCCESS
    payload: string
}
export interface MenuReqError {
    type: typeof MENU_REQUEST_ERROR
    error: string
}

export type MenuActionData = MenuReqStart | MenuReqSuccess | MenuReqError
