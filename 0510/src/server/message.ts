import Ingchain from "@core/ingchain"
import { TransactionRow } from "@core/transaction/transaction.interface"
import { Socket } from "net"
import { MessageData, Payload } from "./network.interface"

class Message {
    constructor(private readonly blockchain: Ingchain) {}
    handler(socket: Socket, data: Buffer) {
        try {
            const { type, payload } = JSON.parse(data.toString("utf8"))
            const message = (this as any)[type](payload) // 대괄호 표기법을 이용한 호출 - if문 없이 작동할 수 있다.

            return message
        } catch (e) {
            return
        }
    }

    //메세지를 받은 사람이 호출을 한다.
    private latestBlock(payload: Payload): string | undefined {
        console.log("latestBlock")
        return JSON.stringify(this.getAllBlockMessage())
    }
    private allBlock(payload: Payload): string | undefined {
        console.log("allBlock")
        //1번입장에서 allBlock을 받고 payload에서 받은 블록에서 내 체인과 검증해서 틀리다면 전체 블록을 요구하는 메세지를 보낸다.
        //검증코드가 있어야한다. (chain에서 진행)
        if (Array.isArray(payload)) return
        if (payload instanceof TransactionRow) return
        const result = this.blockchain.addBlock(payload)
        if (result) return
        return this.getReceivedChainMessage()
    }

    getLatestBlockMessage() {
        return JSON.stringify({
            type: "latestBlock",
            payload: {},
        } as MessageData)
    }

    getAllBlockMessage() {
        return JSON.stringify({
            type: "allBlock",
            payload: this.blockchain.chain.latestBlock(),
        } as MessageData)
    }
    getReceivedChainMessage() {
        return JSON.stringify({
            type: "receivedChain",
            payload: this.blockchain.chain.get(),
        } as MessageData)
    }
    getReceivedTransactionMessage(receivedTransaction: TransactionRow) {
        return JSON.stringify({
            type: "receivedTransaction",
            payload: receivedTransaction,
        } as MessageData)
    }
}
export default Message
