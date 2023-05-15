import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { RootState } from "store"
import { changeAccount } from "store/currentAccount"
import { changeMenu } from "store/menu"
import { HeaderWrap, Logo, MyPageImage } from "./styled"

export * from "./styled"
export const Head = () => {
    const dispatch = useDispatch<ThunkDispatch<{}, {}, AnyAction>>()
    const { isOpen, account } = useSelector((state: RootState) => state.accountState)
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        dispatch(changeMenu("homeMenu"))
        dispatch(changeAccount(account, !isOpen))
    }
    return (
        <>
            <HeaderWrap>
                <div></div>
                <Logo />
                <MyPageImage onClick={(e) => handleClick(e)}>
                    <div></div>
                </MyPageImage>
            </HeaderWrap>
        </>
    )
}
