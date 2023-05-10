import { IBlock } from "@core/block/block.interface"
import net, { Socket } from "net"
import Message from "./message"
import { MessageData, Payload } from "./network.interface"

class P2PNetwork {
    public readonly sockets: Socket[] = []
    constructor(public readonly message: Message) {}
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

    private isJSON(buffer: Buffer) {
        try {
            JSON.parse(buffer.toString("utf8"))
            return true
        } catch (e) {
            return false
        }
    }
    private messageHandler(socket: Socket) {
        let buffer: Buffer | undefined
        return (data: Buffer) => {
            if (this.isJSON(data)) {
                const { type, payload } = JSON.parse(data.toString("utf8"))
                const message = this.message.handler(type, payload)
                if (!message) return
                if (!socket.write(message)) {
                    socket.once("drain", this.messageHandler(socket))
                }
            } else {
                buffer = !buffer ? data : Buffer.concat([buffer, data])
                if (!this.isJSON(buffer)) return this.messageHandler(socket)
                const { type, payload } = JSON.parse(buffer.toString("utf8"))
                const message = this.message.handler(type, payload)
                if (!message) return
                if (!socket.write(message)) {
                    socket.once("drain", this.messageHandler(socket))
                }
            }
        }
    }

    private handleConnection(socket: Socket) {
        console.log(`[+] New Connection from ${socket.remoteAddress}:${socket.remotePort}`)
        this.sockets.push(socket)
        // 브로드케스트

        socket.on("data", this.messageHandler(socket).bind(this))

        const message: MessageData = {
            // 요청을 위한 데이터
            type: "latestBlock",
            payload: {} as IBlock,
        }
        socket.write(JSON.stringify(message))

        const disconnect = () => this.handleDisconnect(socket)
        socket.on("drain", this.messageHandler(socket).bind(this))
        socket.on("close", disconnect)
        socket.on("error", disconnect)
    }

    private handleDisconnect(socket: Socket) {
        const index = this.sockets.indexOf(socket)
        if (index === -1) return
        this.sockets.splice(index, 1)
        console.log(`[-] Connection from ${socket.remoteAddress}:${socket.remotePort} closed`)
    }

    public broadcast(message: string) {
        this.sockets.forEach((socket) => socket.write(message))
    }
}

export default P2PNetwork
