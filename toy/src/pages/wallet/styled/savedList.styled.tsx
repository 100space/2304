import { flexCenter, ItemBox } from "@styled/index.styled"
import styled from "styled-components"

export const ListWrap = styled.ul`
    width: 100%;
    height: 100%;
    padding: 1rem;
    overflow-y: scroll;
`
export const ListItem = styled.li`
    ${flexCenter}
    ${ItemBox}
   
    width: 100%;
    height: 5rem;
    & > img {
        width: 2.15rem;
        transform: scale(0.9) rotate(45deg);
    }
    &:nth-child(2n-1) {
        background-color: #cbd4f2;
    }
    &:nth-child(2n) {
        background-color: #eaecf1;
    }
    & + & {
        margin-top: 1rem;
    }
`
