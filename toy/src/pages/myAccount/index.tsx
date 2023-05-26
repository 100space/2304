import { Button } from "@components/button"
import { DropArrow, SelectAccout } from "@components/currentAccount/styled"
import { DropDown } from "@components/dropDown"
import { SubJect } from "@components/subject"
import { memo, useState } from "react"
import { AccountWrap } from "./styled/myAccount.styled"
import circleArrow from "@img/circleadd.png"
import { useDispatch, useSelector } from "react-redux"
import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { RootState } from "store"
import { changeMyAccount } from "store/myAccounts"
import { AccountText } from "@components/account"

export const AllAccount = memo(() => {
    const dispatch = useDispatch<ThunkDispatch<RootState, {}, AnyAction>>()
    const { account }: { account: string } = useSelector((state: RootState) => state.accountState)

    const [drop, setDrop] = useState(false)
    const handleDropDown = () => {
        setDrop(!drop)
    }
    const handleCreate = async () => {
        dispatch(changeMyAccount())
    }
    return (
        <AccountWrap>
            <SubJect text="My Account" />
            <SelectAccout>
                {AccountText(account)}
                <DropArrow onClick={handleDropDown} drop={drop}></DropArrow>
            </SelectAccout>
            <DropDown drop={drop} />
            <div id="BtnWrap">
                <img src={circleArrow} alt="" onClick={handleCreate} />
                <Button width={70} text="거래 하기" margin={4} />
            </div>
        </AccountWrap>
    )
})
