import Ingchain from "@core/ingchain"
import express from "express"

export default (blockchain: Ingchain) => {
    //
    const app = express()

    app.use(express.json())

    app.get("/", (req, res) => {
        res.send("hello ingchain")
    })

    app.post("/getBalance", (req, res) => {
        //getBalance Method call
        const { account } = req.body
        const balance = blockchain.getBalance(account)
        res.json({ balance })
    })

    //계정 생성
    app.put("/accounts", (req, res) => {
        const account = blockchain.accounts.create()
        res.json({ ...account })
    })

    //계정 확인하기
    app.get("/accounts", (req, res) => {
        const account = blockchain.accounts.getAccounts()
        res.json(account)
    })

    app.post("/mineblock", (req, res) => {
        const { account } = req.body
        const newBlock = blockchain.mineBlock(account)
        res.json(newBlock)
    })

    app.post("/transaction", (req, res) => {
        const { receipt } = req.body
        console.log(receipt.amount)
        receipt.amount = parseInt(receipt.amount)
        const transaction = blockchain.sendTransaction(receipt)
        res.json({
            transaction,
        })
    })
    return app
}
