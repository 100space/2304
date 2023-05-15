import styled from "styled-components"

interface ButtonProps {
    width: number
    margin?: number
    height?: number
}
export const ButtonSC = styled.button<ButtonProps>`
    background-color: #5c5ecc;
    border: none;
    border-radius: 1rem;
    height: ${(props) => (props.height ? `${props.height}rem` : "4rem")};
    font-size: ${(props) => (props.height ? `${props.height / 2}rem` : "2rem")};
    color: #fff;
    margin-top: ${(props) => props.margin}rem;
    width: ${(props) => props.width}%;
    &:hover {
        background-color: #8188d9;
    }
    &:active {
        background-color: #45458e;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 10px 10px inset;
    }
`
