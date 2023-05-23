import { useEffect, useState } from "react"
import Web3 from "web3"

const App = () => {
    const [account, setAccount] = useState(null)
    const [web3, setWeb3] = useState(null)

    useEffect(() => {
        ;(async () => {
            const [data] = await window.ethereum.request({
                method: "eth_requestAccounts",
            })
            console.log(data)
            setWeb3(new Web3(window.ethereum)) // 브라우저에서 월렛으로 요청하기 위해서 매핑을 한다.
            setAccount(data)
        })()
    }, [])
    const handleClick = () => {
        web3.eth.getBalance(account).then(console.log)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const to = e.target.received.value
        const value = web3.utils.toWei(e.target.amount.value)
        const tx = {
            from: account,
            to,
            value,
        }
        web3.eth.sendTransaction(tx).then(console.log)
    }

    return (
        <>
            {account || "로그인 전 입니다.."}
            <button onClick={handleClick}>Balance</button>
            <br />
            <form onSubmit={handleSubmit}>
                <input type="text" id="received" placeholder="받을 계정" />
                <input type="text" id="amount" placeholder="보낼 금액" />
                <button type="submit">전송</button>
            </form>
        </>
    )
}

export default App
