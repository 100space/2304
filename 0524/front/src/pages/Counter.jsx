import { useEffect } from "react"
import { useState } from "react"
import CounterContract from "../contrancts/Counter.json"

const Counter = ({ web3, account }) => {
    const [count, setCount] = useState(0)
    const [deployed, setDeployed] = useState(null)

    // const get = async () => {
    //     if (deployed === null) return alert("deployed가 없습니다.")
    //     console.log(1)
    //     const value = await deployed.methods.getValue().call()
    //     console.log("vale", value)
    //     setCount(value)
    // }
    const increment = async () => {
        if (deployed === null) return alert("deployed가 없습니다.")
        const result = await deployed.methods.increment().send({
            from: account,
        })
        console.log(result)
        deployed.methods
            .getValue()
            .call()
            .then((value) => {
                setCount(value)
            })
    }
    const decrement = async () => {
        if (deployed === null) return alert("deployed가 없습니다.")
        const result = await deployed.methods.decrement().send({
            from: account,
        })
        console.log(result)
        deployed.methods
            .getValue()
            .call()
            .then((value) => {
                setCount(value)
            })
    }

    useEffect(() => {
        if (web3 == null || account === null) return

        // web3.eth.Contract() == deployed()
        const Deployed = new web3.eth.Contract(CounterContract.abi, CounterContract.networks[1684898079653].address)
        setDeployed(Deployed)

        Deployed.methods
            .getValue()
            .call()
            .then((value) => {
                setCount(value)
            })
    }, [])
    return (
        <>
            <div>
                <h2>Counter : {count}</h2>
                <button onClick={increment}> + </button>
                <button onClick={decrement}> - </button>
            </div>
        </>
    )
}

export default Counter
