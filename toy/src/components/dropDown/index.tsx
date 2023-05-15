import { AccountText } from "@components/account"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { RootState } from "store"
import { changeAccount } from "store/currentAccount"
import { myAccountsStateType } from "store/myAccounts"
import { DropDownWrap } from "./styled"

interface IDrop {
    drop?: boolean
}

export const DropDown: React.FC<IDrop> = ({ drop }) => {
    const dispatch = useDispatch<ThunkDispatch<{}, {}, AnyAction>>()
    const handleAccount = (e: React.MouseEvent<HTMLDivElement>) => {
        const account = (e.target as HTMLDivElement).title
        dispatch(changeAccount(account, true))
    }
    const { myaccounts } = useSelector((state: RootState) => state.myAccountState) as myAccountsStateType
    const accountDiv = myaccounts.map((v, i) => (
        <div key={i} onClick={handleAccount}>
            {AccountText(v)}
        </div>
    ))
    return (
        <>
            <DropDownWrap drop={drop}>{accountDiv}</DropDownWrap>
        </>
    )
}
