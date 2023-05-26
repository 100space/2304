import { Button, gettxpool } from "@components/button"
import { Loading } from "@components/loader"
import { SubJect } from "@components/subject"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "store"
import requestServer from "utils/requestServer"
import { ButtonStyleDiv, TransactionForm, TransactionWrap } from "./styled/transaction.styled"

export const MainTransaction = () => {
    const [txState, setTxState] = useState(true)
    const { account } = useSelector((state: RootState) => state.accountState)
    const { data } = useSelector((state: RootState) => state.menuState)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const target = e.target as HTMLFormElement
        let receivedAccount = target.receivedAccount
        let receivedAmount = target.receivedAmount
        if (receivedAccount.value && receivedAmount.value > 0 && account) {
            const receiptData = {
                sender: account,
                received: receivedAccount.value,
                amount: receivedAmount.value,
            }
            await requestServer.post("/transaction", receiptData)
            receivedAccount.value = ""
            receivedAmount.value = ""
            getTxlist()
        } else {
            alert(`누락된 정보가 있습니다.`)
        }
    }
    const getTxlist = async () => {
        const tx = (await gettxpool()).indexOf(account)
        if (tx >= 0) {
            setTxState(false)
        } else {
            setTxState(true)
        }
    }
    useEffect(() => {
        getTxlist()
    }, [account, txState, data])
    return (
        <>
            <TransactionWrap>
                <SubJect text="Transaction"></SubJect>
                <TransactionForm onSubmit={handleSubmit}>
                    <div>
                        <input type="text" placeholder="보낼 계좌" name="receivedAccount" />
                    </div>
                    <div>
                        <input type="text" placeholder="보낼 금액" name="receivedAmount" />
                    </div>
                    {txState ? (
                        <Button text="Send" width={30} margin={3}></Button>
                    ) : (
                        <ButtonStyleDiv width={30} margin={3}>
                            <Loading />
                        </ButtonStyleDiv>
                    )}
                </TransactionForm>
            </TransactionWrap>
        </>
    )
}
