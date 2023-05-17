import { MouseEvent, ReactElement } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { RootState } from "store"
import { changeAccount } from "store/currentAccount"
import requestNode from "utils/requestNode"
import { ButtonSC } from "./styled/button.styled"

interface IButton {
    text?: string
    width: number
    margin?: number
    height?: number
    type: "submit" | "reset" | "button"
    children?: ReactElement<any, any>
}
export const gettxpool = async (): Promise<string[]> => {
    const { data } = await requestNode.get("/txpool")
    const allAccounts = data.flatMap((tx: { txOuts: any[] }) => tx.txOuts.map((out) => out.account))
    return allAccounts
}
export const Button: React.FC<IButton> = ({ text, width, margin, height, children, type }) => {
    const dispatch = useDispatch<ThunkDispatch<RootState, {}, AnyAction>>()
    const { isOpen, account: currentaccount } = useSelector((state: RootState) => state.accountState)
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        const target = e.target as HTMLButtonElement
        if (target.innerHTML === "거래 하기") {
            dispatch(changeAccount(currentaccount, !isOpen))
        }
    }

    return (
        <>
            <ButtonSC width={width} type={type} margin={margin} onClick={handleClick} height={height}>
                {text}
                {children}
            </ButtonSC>
        </>
    )
}
