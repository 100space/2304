import { MainChain } from "./chain"
import { MainHome } from "./home"
import { MainWallet } from "./wallet"
export const BodyPage = () => {
    return (
        <>
            <MainChain></MainChain>
            <MainHome></MainHome>
            <MainWallet></MainWallet>
        </>
    )
}
