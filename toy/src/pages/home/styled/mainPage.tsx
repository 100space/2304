import styled from "styled-components"

export const Home = styled.div`
    width: 40rem;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 2.5rem;
    & > div + div {
        margin-top: 2rem;
    }
`
