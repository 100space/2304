import { flexCenter, ItemBox } from "@styled/index.styled"
import styled from "styled-components"

export const AccountWrap = styled.div`
    z-index: 30;
    position: absolute;
    top: 0;
    margin-top: 3rem;
    width: 35rem;
    height: 55rem;
    background-color: #f5f5f5;
    padding: 2rem;
    border-radius: 2rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

    & > div:nth-child(1) {
        ${ItemBox}
    }
    & > #BtnWrap {
        position: absolute;
        bottom: 4rem;
        width: 31rem;
        ${flexCenter}
        flex-direction: column;
        & > img {
            width: 5rem;
            &:active {
                transform: scale(0.8);
                border-radius: 2.5rem;
                box-shadow: 0 0 10px #45458ea4;
            }
        }
    }
`
