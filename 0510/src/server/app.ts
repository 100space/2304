import Ingchain from "@core/ingchain"
import express from "express"
import P2PNetwork from "./p2p"
import cors from "cors"

export default (blockchain: Ingchain, p2p: P2PNetwork) => {
    const app = express()
    app.use(express.json())
    app.use(cors({ origin: true, credentials: true }))

    app.get("/", (req, res) => {
        res.send("hello ingchain")
    })

    app.post("/getBalance", (req, res) => {
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
        p2p.broadcast(p2p.message.getAllBlockMessage())
        res.json(newBlock)
    })

    app.post("/transaction", (req, res) => {
        const { receipt } = req.body
        console.log(receipt.amount)
        receipt.amount = parseInt(receipt.amount)
        const transaction = blockchain.sendTransaction(receipt)
        p2p.broadcast(p2p.message.getReceivedTransactionMessage(transaction))
        res.json({
            transaction,
        })
    })

    app.post("/addPeer", (req, res) => {
        const { host, port } = req.body
        console.log(port)
        p2p.connet(parseInt(port), host)
        res.send("connection 성공")
    })

    app.get("/peers", (req, res) => {
        const sockets = p2p.sockets.map((socket) => `${socket.remoteAddress}:${socket.remotePort}`)
        res.json(sockets)
    })

    app.get("/view", (req, res) => {
        const blocks = blockchain.chain.get()
        res.send(blocks)
    })
    app.get("/txpool", (req, res) => {
        const txpool = blockchain.transaction.getPool()
        res.json(txpool)
    })
    return app
}
