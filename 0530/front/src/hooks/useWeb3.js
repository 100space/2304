import { useEffect, useState } from "react"
import Web3 from "web3"

const useWeb3 = () => {
    const [account, setAccount] = useState([])
    const [web3, setWeb3] = useState(null)

    useEffect(() => {
        if (!window.ethereum) return

        window.ethereum
            .request({
                method: "eth_requestAccounts",
            })
            .then((accounts) => {
                const web3 = new Web3(window.ethereum)
                setAccount(accounts)
                setWeb3(web3)
            })
            .catch((error) => {
                setAccount(null)
                setWeb3(null)
            })
    }, [])
    return [account, web3]
}

export default useWeb3
