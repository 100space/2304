import React, { useEffect, useState } from "react"
import logo from "./logo.svg"
import "./App.css"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

function App() {
    const [count, setCount] = useState(null)
    const [symbol, setSymbol] = useState(null)
    const api = async () => {
        const result = await axios.get("https://api.coingecko.com/api/v3/coins/bitcoin")
        console.log(result)
        return result.data
    }

    const { data, isLoading } = useQuery(["coinName"], api, {
        onSuccess: (apiFn) => {
            localStorage.setItem("coinName", JSON.stringify(apiFn.id))
        },
    })

    useEffect(() => {
        setSymbol(data?.symbol)
    }, [data])

    useEffect(() => {
        const datas = localStorage.getItem("coinName")
        if (datas) {
            setCount(JSON.parse(datas))
        }
    }, [])
    if (isLoading) {
        return <>Loading.....</>
    }
    return (
        <>
            <h1>name: {count} </h1>
            <h1>symbol: {symbol} </h1>
        </>
    )
}

export default App
