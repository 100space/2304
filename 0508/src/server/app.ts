import Ingchain from "@core/ingchain"
import express from "express"

export default (web3: Ingchain) => {
    //
    const app = express()

    app.use(express.json())

    app.get("/", (req, res) => {
        res.send("hello ingchain")
    })

    app.get("/getBalance", (req, res) => {
        //getBalance Method call

        res.send("balance...")
    })
    return app
}
