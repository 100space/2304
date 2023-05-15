import styled from "styled-components"
import { imgCenter } from "@styled/index.styled"
import chainMenu from "@img/chainMenu.png"
import walletMenu from "@img/walletMenu.png"
import homeMenu from "@img/homeMenu.png"

interface ActiveProps {
    activeState?: string
}
export const FooterWrap = styled.div`
    width: 100%;
    height: 7rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding: 1.5rem 2.8rem;
`
export const FooterBtn = styled.div<ActiveProps>`
    width: 10rem;
    height: 6rem;
    border-radius: 3rem;
    position: absolute;
    z-index: 10;
    background-color: #96a1e3;
    transition: all 0.5s;
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
    ${(props) =>
        props.activeState === "homeMenu"
            ? "left: calc(50% - 5rem);"
            : props.activeState === "chainMenu"
            ? "left: 1.2rem;"
            : "left: 28.5rem;"}
`

export const FooterBtnImg = styled.div`
    width: 7rem;
    height: 5rem;
    z-index: 20;
    background-size: 3.5rem 3.5rem !important;
    ${imgCenter};
    cursor: pointer;
    ${(props) =>
        props.id === "chainMenu"
            ? `background-image: url(${chainMenu})`
            : props.id === "walletMenu"
            ? `background-image: url(${walletMenu})`
            : `background-image: url(${homeMenu})`};
`
