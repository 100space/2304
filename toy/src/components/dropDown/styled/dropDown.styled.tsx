import { flexCenter, ItemBox } from "@styled/index.styled"
import styled from "styled-components"

interface DropProps {
    drop?: boolean
}

export const DropDownWrap = styled.ul<DropProps>`
    width: 100%;

    ${(props) => (props.drop ? "height: 50%;" : "height: 0%;")}
    transition: all 0.5s;
    border-radius: 1rem;
    overflow-y: scroll;
    & > div {
        margin: 1rem auto 0;
        ${ItemBox}
        ${flexCenter}
        & > .account {
            ${flexCenter}
            width: 100%;
            height: fit-content;
            font-size: 1.8rem;
            font-family: 500;
            cursor: pointer;
        }
    }
`
