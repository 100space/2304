import { useState } from "react"
import add from "@img/add.png"
import { useDispatch, useSelector } from "react-redux"
import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { RootState } from "store"
import { changeSavedAccount } from "store/savedAccount"
import { InputWrap, InputAccount } from "./styled"

export const InputComponent = () => {
    const [value, setValue] = useState("")
    const { savedaccounts }: { savedaccounts: string[] } = useSelector((state: RootState) => state.savedAccountState)
    const dispatch = useDispatch<ThunkDispatch<RootState, {}, AnyAction>>()
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement
        setValue(target.value)
    }
    const handleAdd = () => {
        const hexRegExp = /^[0-9a-fA-F]{40}$/
        const check = savedaccounts.indexOf(value)
        if (!hexRegExp.test(value)) return
        if (check >= 0) return
        dispatch(changeSavedAccount(value))
        setValue("")
    }
    return (
        <InputWrap>
            <InputAccount onChange={handleInput} value={value} />
            <img src={add} alt="" onClick={handleAdd} />
        </InputWrap>
    )
}
