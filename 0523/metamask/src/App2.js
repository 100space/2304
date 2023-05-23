import { useEffect, useState } from "react"
import useWeb3 from "./hooks/web3.hook"
import abi from "./abi/counter.json"

const App2 = () => {
    const { user, web3 } = useWeb3()
    const [count, setCount] = useState(0)

    const getCount = () => {
        if (web3 === null) return
        const getValueData = abi.find((data) => data?.name === "getValue")
        const data = web3.eth.abi.encodeFunctionCall(getValueData, [])
        web3.eth
            .call({
                to: "0x1E9BE4ab1aBC0B7D1ED7bA2b59189e884D660A2c",
                data,
            })
            .then((data) => {
                const result = web3.utils.toBN(data).toString(10)
                setCount(result)
            })
    }
    const increment = async () => {
        const incrementData = abi.find((data) => data.name === "increment")
        const data = web3.eth.abi.encodeFunctionCall(incrementData, [])

        const from = user.account
        const to = "0x1E9BE4ab1aBC0B7D1ED7bA2b59189e884D660A2c"

        const tx = {
            from,
            to,
            data,
        }
        await web3.eth.sendTransaction(tx).then((data) => {
            getCount()
        })
    }
    const decrement = async () => {
        const decrementData = abi.find((data) => data.name === "decrement")
        const data = web3.eth.abi.encodeFunctionCall(decrementData, [])

        const from = user.account
        const to = "0x1E9BE4ab1aBC0B7D1ED7bA2b59189e884D660A2c"

        const tx = {
            from,
            to,
            data,
        }
        await web3.eth.sendTransaction(tx).then((data) => {
            getCount()
        })
    }

    useEffect(() => {
        if (web3 !== null) getCount()
    }, [web3])

    if (user.account === null) return "값이 존재하지 않는다."
    return (
        <>
            <div>
                <h2>카운터 : {count}</h2>
                <button onClick={increment}> 증가 </button>
                <button onClick={decrement}> 감소 </button>
            </div>
        </>
    )
}

export default App2
