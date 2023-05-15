import { BodyPage } from "@pages/index"
import { AllAccount } from "@pages/myAccount"
import { useSelector } from "react-redux"
import { RootState } from "store"
import { BodyWrap } from "./styled"

export const Body = () => {
    const { data } = useSelector((state: RootState) => state.menuState)
    const { isOpen, account } = useSelector((state: RootState) => state.accountState)
    console.log(isOpen, account)
    return (
        <>
            <BodyWrap activeState={data} isOpen={isOpen}>
                {isOpen && <AllAccount />}
                <BodyPage />
            </BodyWrap>
        </>
    )
}
