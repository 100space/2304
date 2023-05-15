import { MainAccount } from "@components/currentAccount"
import { MainTransaction } from "@components/transaction"
import { Home } from "./styled"

export const MainHome = () => {
    return (
        <Home>
            <MainAccount></MainAccount>
            <MainTransaction></MainTransaction>
        </Home>
    )
}
