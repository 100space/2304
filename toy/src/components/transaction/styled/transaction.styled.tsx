import { ButtonProps } from "@components/button/styled/button.styled"
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
export const ButtonStyleDiv = styled.p<ButtonProps>`
    ${flexCenter}
    background-color: #5c5ecc;
    border: none;
    float: right;
    border-radius: 1rem;
    height: ${(props) => (props.height ? `${props.height}rem` : "4rem")};
    font-size: ${(props) => (props.height ? `${props.height / 2}rem` : "2rem")};
    color: #fff;
    margin-top: ${(props) => props.margin}rem;
`
