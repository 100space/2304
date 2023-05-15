import axios from "axios"

const requestNode = axios.create({
    baseURL: "http://127.0.0.1:8545",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

export default requestNode
