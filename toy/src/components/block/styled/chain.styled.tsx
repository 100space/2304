import { flexCenter, imgCenter } from "@styled/index.styled"
import styled from "styled-components"
import hex from "@img/hex.png"

export const Chain = styled.div`
    width: 40rem;
    max-height: 56rem;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    overflow-y: scroll;
    & > div:nth-child(2n) {
        background-color: #cbd4f2;
    }
    & > div:nth-child(2n-1) {
        background-color: #eaecf1;
    }
`
export const Container = styled.div`
    width: 100%;
    height: 10rem;
    display: flex;
    align-items: center;
    padding: 2rem;
    background: rgb(236, 236, 236);
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
        rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    & > div + div {
        margin-left: 2rem;
    }
    & + & {
        margin-top: 1rem;
    }
`
export const BlockNum = styled.div`
    background-image: url(${hex});
    ${imgCenter}
    ${flexCenter}
    width: 7rem;
    height: 7rem;
    border-radius: 1rem;
    font-size: 2rem;
    font-weight: 700;
`
export const BlockInfo = styled.div`
    width: 80%;
    height: 100%;
    font-size: 1.4rem;
    & > div:nth-child(2n-1) {
        font-weight: 700;
    }
    & > div:nth-child(2n) {
        text-align: end;
    }
`
