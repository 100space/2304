import { MenuActionData, MENU_REQUEST_ERROR, MENU_REQUEST_START, MENU_REQUEST_SUCCESS } from "./menu.interface"

export interface InitStateType {
    isLoading: boolean
    data: string
    error: null
}
export const initState: InitStateType = {
    isLoading: false,
    data: "homeMenu",
    error: null,
}

export const menuState = (state = initState, action: MenuActionData) => {
    switch (action.type) {
        case MENU_REQUEST_START:
            return { ...state, isLoading: true, error: null }
        case MENU_REQUEST_SUCCESS:
            return { ...state, isLoading: false, data: action.payload }
        case MENU_REQUEST_ERROR:
            return { ...state, isLoading: false, error: action.error }
        default:
            return state
    }
}
