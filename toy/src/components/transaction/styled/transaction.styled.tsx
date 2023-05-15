import { flexCenter, ItemBox } from "@styled/index.styled"
import styled from "styled-components"

export const TransactionWrap = styled.div`
    display: flex;
    flex-direction: column;
`

export const TransactionForm = styled.form`
    position: relative;
    width: 100%;
    height: fit-content;
    & > div {
        ${ItemBox}
        ${flexCenter}
        justify-content:flex-start !important;
    }
    & > div + div {
        margin-top: 1rem;
    }
    & > div > input {
        border: none;
        background-color: initial;
        font-size: 2rem;
        width: 100%;
    }
    & > button {
        float: right;
    }
`
