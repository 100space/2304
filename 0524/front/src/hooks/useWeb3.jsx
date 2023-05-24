import Web3 from "web3"
import { useEffect, useState } from "react"

const useWeb3 = () => {
    const [account, setAccount] = useState(null)
    const [web3, setWeb3] = useState(null)

    const init = async () => {
        const [account] = await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        const web3 = new Web3(window.ethereum)
        setAccount(account)
        setWeb3(web3)
    }

    useEffect(() => {
        //브라우저에 월렛이 있는가?
        if (!window.ethereum) return
        // 메타마스크 연결
        init()
    }, [])

    return [account, web3]
}
export default useWeb3
