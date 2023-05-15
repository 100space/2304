import styled from "styled-components"
import logo from "@img/logo.png"
import MyPageImg from "@img/MyPageImg.png"
import { flexCenter, imgCenter } from "@styled/index.styled"

export const HeaderWrap = styled.div`
    width: 100%;
    height: 8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 2.5rem;

    & > div {
        ${flexCenter}
        margin: 0 auto;
    }
    & > div:nth-child(1) {
        width: 3.5rem;
        height: 3.5rem;
    }
    & > div:nth-child(3) {
        margin: 0 0 0 3rem;
    }
`
export const Logo = styled.div`
    width: 19rem;
    height: 5rem;
    background-image: url(${logo});
    ${imgCenter}
`

export const MyPageImage = styled.div`
    width: 3.5rem;
    height: 100%;
    ${flexCenter}
    & > div {
        ${imgCenter}
        margin-top: 0.8rem;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-image: url(${MyPageImg});
        cursor: pointer;
    }
`
