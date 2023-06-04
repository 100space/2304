import { useEffect, useState } from "react"
import Web3 from "web3"

const useWeb3 = () => {
    const [account, setAccount] = useState(null)
    const [web3, setWeb3] = useState(null)

    const init = async () => {
        try {
            const [account] = await window.ethereum.request({ methods: "eth_requestAccounts" })
            const web3 = new Web3(window.ethereum)
            setAccount(account)
            setWeb3(web3)
        } catch (e) {
            setAccount(null)
            setWeb3(null)
        }
    }

    useEffect(() => {
        if (!window.ethereum) return
        init()
    }, [])
    return [account, web3]
}

export default useWeb3
