import Ingchain from "@core/ingchain"
import { Socket } from "net"
import { MessageData, Payload } from "./network.interface"

class Message {
    constructor(private readonly blockchain: Ingchain) {}
    handler(socket: Socket, data: Buffer) {
        const { type, payload } = JSON.parse(data.toString("utf-8"))
        const message = (this as any)[type](payload) // 대괄호 표기법을 이용한 호출 - if문 없이 작동할 수 있다.
        if (!message) return
        socket.write(message)
        socket.end()
    }

    //메세지를 받은 사람이 호출을 한다.
    private latestBlock(payload: Payload) {
        const message: MessageData = {
            // 받는사람이 다시 보내는 상황이기 때문에 다른 메세지로 보내는 것이다.
            type: "allBlock",
            payload: this.blockchain.chain.latestBlock(),
        }
        return JSON.stringify(message)
    }
    private allBlock(payload: Payload) {
        //1번입장에서 allBlock을 받고 payload에서 받은 블록에서 내 체인과 검증해서 틀리다면 전체 블록을 요구하는 메세지를 보낸다.
        console.log(payload)
    }
}
export default Message
