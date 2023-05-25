import Web3 from "web3"
import { useState, useEffect } from "react"

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
        if (!window.ethereum) return
        init()
    }, [])

    return [web3, account]
}
export default useWeb3
