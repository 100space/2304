// import { useEffect } from "react"
// import { useState } from "react"
// import ContractCounter from "../contracts/Counter.json"

// export const Counter = ({ account, web3 }) => {
//     const [count, setCount] = useState(null)
//     const [loding, setLoding] = useState(true)
//     const [deploy, setDeploy] = useState(null)

//     const get = () => {
//         if (deploy === null) return
//         deploy.methods
//             .get()
//             .call()
//             .then((data) => {
//                 setCount(data)
//             })
//     }

//     useEffect(() => {
//         const Deploy = new web3.eth.Contract(ContractCounter.abi, "0x2BD2Ddf7b294cAB58D94b1A1e4fe4bF0EFA09ab4")
//         setDeploy(Deploy)
//         web3.eth.subscribe("logs", { address: "0x2BD2Ddf7b294cAB58D94b1A1e4fe4bF0EFA09ab4" }).on("data", (log) => {
//             const params = [
//                 {
//                     indexed: false,
//                     internalType: "uint256",
//                     name: "count",
//                     type: "uint256",
//                 },
//             ]
//             console.log(log)
//             const value = web3.eth.abi.decodeLog(params, log.data)
//             console.log(value.count)
//             setCount(value.count)
//         })
//         get()
//     }, [])

//     const increment = async () => {
//         setLoding(false)
//         await deploy.methods.increment().send({
//             from: account,
//         })
//         get()
//         setLoding(true)
//     }
//     const decrement = async () => {
//         setLoding(false)
//         await deploy.methods.decrement().send({
//             from: account,
//         })
//         get()
//         setLoding(true)
//     }

//     if (count === null) get()
//     if (!loding) return "거 아직 블록이 안만들어졌수"

//     return (
//         <>
//             count : {count}
//             <button onClick={increment}>+</button>
//             <button onClick={decrement}>-</button>
//         </>
//     )
// }

import { useState } from "react"
import { useEffect } from "react"
import CounterContract from "../contracts/Counter.json"

export const Counter = ({ web3, account }) => {
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [deployed, setDeployed] = useState(null)

    const get = () => {
        if (deployed === null) return
        deployed.methods
            .get()
            .call()
            .then((value) => {
                setCount(value)
            })
    }
    const increment = async () => {
        if (deployed === null) return
        const result = await deployed.methods.increment().send({
            from: account,
        })
        console.log(result)
        get()
    }
    const decrement = async () => {
        if (deployed === null) return
        const result = await deployed.methods.decrement().send({
            from: account,
        })
        console.log(result)
        get()
    }

    useEffect(() => {
        // 0xc94dc1f84184d814eaa0657f9b4c7d8f99e6e163
        if (!deployed) {
            setDeployed(new web3.eth.Contract(CounterContract.abi, "0x2BD2Ddf7b294cAB58D94b1A1e4fe4bF0EFA09ab4"))
        }
        web3.eth.subscribe("logs", { address: "0x2BD2Ddf7b294cAB58D94b1A1e4fe4bF0EFA09ab4" }).on("data", (log) => {
            const params = [
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "count",
                    type: "uint256",
                },
            ]
            const value = web3.eth.abi.decodeLog(params, log.data)
            console.log(value.count)
            setLoading(false)
            get()
        })
    }, [])

    useEffect(() => {
        if (!deployed || !loading) get()
        setLoading(false)
    }, [loading])

    if (loading) return "loading...."
    return (
        <>
            <h1>Counter : {count}</h1>

            <button onClick={increment}> + </button>
            <button onClick={decrement}> - </button>
        </>
    )
}
