import { useDispatch, useSelector } from "react-redux"
import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { RootState } from "store"
import { changeMenu } from "store/menu"
import { FooterBtn, FooterBtnImg, FooterWrap } from "./styled"

export const Footer = () => {
    const { data } = useSelector((state: RootState) => state.menuState)

    const dispatch = useDispatch<ThunkDispatch<RootState, {}, AnyAction>>()
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const targetElement = e.target as HTMLDivElement
        const data = targetElement.id
        data && dispatch(changeMenu(data))
    }

    return (
        <>
            <FooterWrap onClick={(e) => handleClick(e)}>
                <FooterBtnImg id="chainMenu" />
                <FooterBtnImg id="homeMenu" />
                <FooterBtnImg id="walletMenu" />
                <FooterBtn activeState={data}></FooterBtn>
            </FooterWrap>
        </>
    )
}
