import { flexCenter, imgCenter, ItemBox } from "@styled/index.styled"
import styled from "styled-components"
import arrow from "@img/arrow.png"

export interface DropArrowProps {
    drop?: boolean
}

export const CurrentAccoutWrap = styled.div`
    display: flex;
    flex-direction: column;
    & > p {
        ${flexCenter}
        margin: 0 auto !important;
        height: 3rem;
        width: 18rem;
        background-color: #5c5ecc;
        border-radius: 1rem;
        font-size: 1.5rem;
        color: #fff;
        &:hover {
            background-color: #8188d9;
        }
        &:active {
            background-color: #45458e;
            box-shadow: rgba(0, 0, 0, 0.25) 0px 10px 10px inset;
        }
    }
`
export const SelectAccout = styled.div`
    margin: 0 auto;
    ${ItemBox}
    ${flexCenter}
    & > #account {
        ${flexCenter}
        width: 100%;
        height: fit-content;
        font-size: 1.8rem;
        font-family: 500;
    }
`

export const DropArrow = styled.div<DropArrowProps>`
    float: right;
    width: 2rem;
    height: 2rem;
    background-image: url(${arrow});
    ${imgCenter}
    transition: all 0.3s;
    ${(props) => (props.drop ? "transform: rotate(0deg);" : "transform: rotate(180deg);")}
`
export const BalanceWrap = styled.div`
    ${flexCenter}
    margin: 2.5rem auto;
    cursor: pointer;
    & > div {
        ${flexCenter}
        align-items: flex-end;
        font-size: 4rem;
    }
    & > span {
        ${flexCenter}
        margin: 1rem 0 0 1rem;
        font-size: 3rem;
    }
`
