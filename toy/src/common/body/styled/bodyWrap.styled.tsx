import { flexCenter } from "@styled/index.styled"
import styled from "styled-components"

interface ActiveProps {
    activeState?: string
    isOpen?: boolean
}
export const BodyWrap = styled.div<ActiveProps>`
    width: 120rem;
    height: 100%;
    display: flex;
    transition: all 0.5s;
    position: relative;
    ${flexCenter}
    ${(props) =>
        props.activeState === "chainMenu"
            ? "margin-left:0rem"
            : props.activeState === "homeMenu"
            ? "margin-left:-40rem"
            : "margin-left:-80rem"};
`
