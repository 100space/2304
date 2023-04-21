import styled from "styled-components"
interface CommentWrapProps {
    height?: number
    backgroundColor?: boolean
}

export const CommentWrap = styled.div<CommentWrapProps>`
    width: 70%;
    height: ${(props) => (props.height ? props.height : "4")}rem;
    margin: 0 auto;
    padding: 0 0 4rem 0;
    background-color: ${(props) => (props.backgroundColor ? "blue" : "pink")};
    display: flex;
    justify-content: center;
    align-items: flex-end;
`
