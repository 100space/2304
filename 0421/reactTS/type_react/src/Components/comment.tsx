import { CommentBtn, CommentWrap } from "./styled"
import { useState } from "react"

interface CommentProps {
    height: number
    text?: string
}
export const Comment: React.FC<CommentProps> = ({ height, text }) => {
    const [backgroundColor, setBackgroundColor] = useState(true)
    console.log(backgroundColor)
    const handleClick = () => {
        setBackgroundColor(!backgroundColor)
    }
    return (
        <>
            <CommentWrap height={height} backgroundColor={backgroundColor}>
                {text && <CommentBtn onClick={() => handleClick()}>{text}</CommentBtn>}
            </CommentWrap>
        </>
    )
}
