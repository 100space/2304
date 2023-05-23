import "./App.css"
import { useEffect, useState } from "react"

const App = () => {
    const [account, setAccount] = useState(null)

    useEffect(() => {
        window.ethereum
            .request({
                // 메서드로 요청을 하게 되면 메타마스크에 연결을 위한 요청이 온다. 원하는 계좌를 선택해서 커넥트를 맺을 수 있다.
                method: "eth_requestAccounts",
            })
            .then((data) => {
                setAccount(...data)
            })
    }, [])

    return <>{account || "로그인 전 입니다.."}</>
}

export default App
