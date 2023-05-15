import { AccountText } from "@components/account"
import { SubJect } from "@components/subject"
import { useHandleCopy } from "hook/Fn"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import requestNode from "utils/requestNode"
import { Balance } from "./balance"
import { CurrentAccoutWrap, SelectAccout } from "./styled"

export const MainAccount = () => {
    const { account }: { account: string } = useSelector((state: RootState) => state.accountState)
    const { data }: { data: string } = useSelector((state: RootState) => state.menuState)
    const [balance, setBalance] = useState(0)
    const getBalance = async (account: string) => {
        const {
            data: { balance },
        } = await requestNode.post("/getBalance", { account })
        setBalance(balance)
    }

    useEffect(() => {
        getBalance(account)
    }, [account])

    return (
        <>
            <CurrentAccoutWrap>
                <SubJect text="Account"></SubJect>
                <SelectAccout>{AccountText(account, useHandleCopy)}</SelectAccout>
                <Balance balance={balance}></Balance>
                <p onClick={() => getBalance(account)}>새로고침</p>
            </CurrentAccoutWrap>
        </>
    )
}
