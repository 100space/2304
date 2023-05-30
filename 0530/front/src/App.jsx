import useWeb3 from "./hooks/useWeb3"
import AppleShop from "./pages/appleShop"

const App = () => {
    const [account, web3] = useWeb3()
    if (!account || !web3) return <> 메타마스크와 연결 후 사용해주세요!</>
    return (
        <>
            <h1> 사과가게 </h1>
            <AppleShop />
        </>
    )
}
export default App
