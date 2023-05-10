import { IBlock } from "@core/block/block.interface"
import { Handler } from "express"
import net, { Socket } from "net"
import Message from "./message"
import { MessageData } from "./network.interface"

class P2PNetwork {
    private readonly sockets: Socket[] = []
    constructor(private readonly message: Message) {}
    listen(port: number) {
        const connection = (socket: Socket) => this.handleConnection(socket)
        const server = net.createServer(connection)
        console.log("p2p server start")
        server.listen(port)
    }
    connet(port: number, host: string) {
        const socket = new net.Socket()
        const connection = () => this.handleConnection(socket)
        socket.connect(port, host, connection)
    }

    private handleConnection(socket: Socket) {
        console.log(`[+] New Connection from ${socket.remoteAddress}:${socket.remotePort}`)
        this.sockets.push(socket)
        // 브로드케스트

        const dataCallback = (data: Buffer) => this.message.handler(socket, data)
        socket.on("data", dataCallback)

        const message: MessageData = {
            // 요청을 위한 데이터
            type: "latestBlock",
            payload: {} as IBlock,
        }
        socket.write(JSON.stringify(message))

        const disconnect = () => this.handleDisconnect(socket)
        socket.on("close", disconnect)
        socket.on("error", disconnect)
    }

    private handleDisconnect(socket: Socket) {
        const index = this.sockets.indexOf(socket)
        if (index === -1) return
        this.sockets.splice(index, 1)
        console.log(`[-] Connection from ${socket.remoteAddress}:${socket.remotePort} closed`)
    }
}

export default P2PNetwork
