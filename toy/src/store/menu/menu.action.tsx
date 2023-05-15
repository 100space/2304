import { Dispatch } from "redux"
import { MenuActionData, MENU_REQUEST_ERROR, MENU_REQUEST_START, MENU_REQUEST_SUCCESS } from "./menu.interface"

export const changeMenu = (data: string) => {
    return async (dispatch: Dispatch<MenuActionData>) => {
        dispatch({ type: MENU_REQUEST_START })
        try {
            dispatch({ type: MENU_REQUEST_SUCCESS, payload: data })
        } catch (error: any) {
            dispatch({ type: MENU_REQUEST_ERROR, error: error.message })
        }
    }
}
