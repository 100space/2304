import { SubJect } from "@components/subject"
import { Wallet, WalletWrap } from "./styled"
import { memo } from "react"
import { InputComponent } from "./input"
import { ListComponent } from "./List"

export const MainWallet = memo(() => {
    return (
        <Wallet>
            <WalletWrap>
                <SubJect text="Saved Wallet" />
                <InputComponent />
                <ListComponent />
            </WalletWrap>
        </Wallet>
    )
})
