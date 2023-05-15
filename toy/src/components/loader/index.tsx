import { flexCenter } from "@styled/index.styled"
import styled, { keyframes } from "styled-components"

const pulsate = keyframes`
  0%, 40%, 100% {
    transform: scale(0.4);
  }
  20% {
    transform: scale(0.8);
  }
`

const Ul = styled.ul`
    position: relative;
    /* top: 50%; */
    /* right: 10%; */
    /* transform: translate(-50%, -50%); */
    ${flexCenter}
    margin: 0;
    padding: 0;
`

const Li = styled.li`
    list-style: none;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    animation: ${pulsate} 1.6s ease-in-out infinite;

    &:nth-child(1) {
        animation-delay: -1.4s;
        background: #ffe100;
        box-shadow: 0 0 50px #ffe100;
    }
    &:nth-child(2) {
        animation-delay: -1s;
        background: #f06292;
        box-shadow: 0 0 50px #f06292;
    }
    &:nth-child(3) {
        animation-delay: -0.8s;
        background: #4fc3f7;
        box-shadow: 0 0 50px #4fc3f7;
    }
    &:nth-child(4) {
        animation-delay: -0.6s;
        background: #1cad26;
        box-shadow: 0 0 50px #1cad26;
    }
    &:nth-child(5) {
        animation-delay: -0.4s;
        background: #f57c00;
        box-shadow: 0 0 50px #f57c00;
    }
`

export const Loading: React.FC = () => {
    return (
        <Ul>
            <Li />
            <Li />
            <Li />
            <Li />
            <Li />
        </Ul>
    )
}
