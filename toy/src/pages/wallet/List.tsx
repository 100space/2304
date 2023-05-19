import { AccountText } from "@components/account"
import { useHandleCopy } from "hook/Fn"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import add from "@img/add.png"
import { ListItem, ListWrap } from "./styled/savedList.styled"
import React from "react"
import { ThunkDispatch } from "redux-thunk"
import { AnyAction } from "redux"
import { changeSavedAccount } from "store/savedAccount"

export const ListComponent = () => {
    const dispatch = useDispatch<ThunkDispatch<RootState, {}, AnyAction>>()
    const { savedaccounts }: { savedaccounts: string[] } = useSelector((state: RootState) => state.savedAccountState)
    const handleDelete = (e: React.MouseEvent<HTMLImageElement>) => {
        const target = e.currentTarget.previousElementSibling as HTMLDivElement
        const newSaveAccounts = savedaccounts.filter((v) => v !== target.title)
        dispatch(changeSavedAccount(newSaveAccounts))
    }
    return (
        <>
            <ListWrap>
                {savedaccounts &&
                    savedaccounts.map((v, i) => {
                        return (
                            <ListItem key={i}>
                                {AccountText(v, useHandleCopy)}
                                <img src={add} alt="" onClick={handleDelete} />
                            </ListItem>
                        )
                    })}
            </ListWrap>
        </>
    )
}
