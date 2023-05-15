import { flexCenter, imgCenter, ItemBox } from "@styled/index.styled"
import styled from "styled-components"

export const Wallet = styled.div`
    width: 40rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    ${flexCenter}
`
export const WalletWrap = styled.div`
    width: 90%;
    height: 95%;
    margin-top: 2rem;
    ${flexCenter}
    flex-direction: column;
    align-items: flex-start;
`
export const InputWrap = styled.div`
    position: relative;
    width: 95% !important;
    height: 10rem;
    border-bottom: 1px solid #a0a0a0;
    margin: 0rem auto 2rem;
    ${flexCenter}
    & > img {
        position: absolute;
        right: 1rem;
        width: 2rem;
        ${imgCenter}
    }
`
export const InputAccount = styled.input`
    background: initial;
    padding: 0.7rem 5rem 0.7rem 1.4rem !important;
    outline: none;
    font-size: 2rem;
    border: none;
    width: 95%;
    ${ItemBox}
`
