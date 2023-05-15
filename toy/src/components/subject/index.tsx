import { H1Subject } from "./styled/subject.styled"

interface Subject {
    text?: string
}
export const SubJect: React.FC<Subject> = ({ text }) => {
    return <H1Subject>{text}</H1Subject>
}
