import useWeb3 from "./hooks/useWeb3"
import { Counter } from "./pages/counter"

const App = () => {
    const [web3, account] = useWeb3()
    if (!account) return <>메타마스크를 연결하고 사용익 가능합니다.</>
    return (
        <>
            <Counter web3={web3} account={account} />
        </>
    )
}
export default App
