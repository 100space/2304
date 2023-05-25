const express = require("express")
const cors = require("cors")
const Web3 = require("web3")
const app = express()
const CounterContract = require("./contracts/Counter.json")

const web3 = new Web3("https://goerli.infura.io/v3/fe6fb1e940ac43ea956b72a82103f2ad")
// const web3 = new Web3(new Web3.providers.HttpProvider("https://goerli.infura.io/v3/fe6fb1e940ac43ea956b72a82103f2ad"))

app.use(cors())
app.use(express.json())

app.post("/increment", (req, res) => {
    const { from } = req.body
    const { abi } = CounterContract
    const deployed = new web3.eth.Countract(abi, "0x2bd2ddf7b294cab58d94b1a1e4fe4bf0efa09ab4")
    const data = deployed.methods.increment(1).encodeABI()

    res.json({
        from,
        to: "0x2bd2ddf7b294cab58d94b1a1e4fe4bf0efa09ab4",
        data,
    })
})

app.listen("3005", () => {
    console.log("server open")
})
