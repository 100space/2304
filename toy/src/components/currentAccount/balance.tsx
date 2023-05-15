import { BalanceWrap } from "./styled"

interface IBalance {
    balance?: number
}

export const Balance: React.FC<IBalance> = ({ balance }) => {
    return (
        <BalanceWrap>
            <div>{balance}</div>
            <span>Coin</span>
        </BalanceWrap>
    )
}
