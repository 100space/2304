import useWeb3 from "./hooks/useWeb3"
import Counter from "./pages/Counter"

const App = () => {
    const [account, web3] = useWeb3()

    if (!account) return <>메타마스크를 연결하고 사용익 가능합니다.</>
    return (
        <>
            <h1>Hello Counter</h1>
            <Counter web3={web3} account={account} />
        </>
    )
}

export default App
