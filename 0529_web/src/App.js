import logo from "./logo.svg"
import "./App.css"
import { useEffect, useState } from "react"
import LotteryContract from "./contracts/Lottery.json"
import useWeb3 from "./hooks/useWeb3"

const App = () => {
    const [account, web3] = useWeb3()
    const [deployed, setDeployed] = useState(null)
    const [pot, setPot] = useState(null)
    const [owner, setOwner] = useState(null)

    const init = async () => {
        if (!deployed) return
        let pot = await deployed.methods.getPot().call()
        console.log(pot)
        const onwer = await deployed.methods.onwer().call()
        setPot(pot)
        setOwner(onwer)
    }
    useEffect(() => {
        if (!web3) return
        const lottery = new web3.eth.Contract(LotteryContract.abi, "0x920277907bD53c5A6e6b64aE563b370927BBbAe0")
        setDeployed(lottery)
        init()
    }, [])

    useEffect(() => {
        console.log(pot)
        console.log(owner)
    }, [pot])

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
            </header>
        </div>
    )
}

export default App
