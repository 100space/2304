import { IBlock } from "@core/block/block.interface"
import net, { Socket } from "net"
import { MessageData } from "./network.interface"

class P2PNetwork {
    listen(port: number) {
        const server = net.createServer((socket: Socket) => {
            console.log(socket.remotePort)
            console.log("connection")
            socket.write("hello??")

            socket.on("data", (data: Buffer) => {
                console.log(data.toString("utf-8"))
                const messageString = data.toString("utf-8")

                const message = JSON.parse(messageString)
                console.log(message)
            })
        })
        console.log("p2p server start")
        server.listen(port)
    }
    connet(port: number, host: string) {
        const socket = new net.Socket()
        socket.connect(port, host, () => {
            console.log(socket.remotePort)
            console.log("connect")

            socket.on("data", (data: Buffer) => {
                console.log(data)
                console.log(data.toString("utf-8")) //Buffer을 UTF-8 글자셋으로 변환해준다.
                const message: MessageData = {
                    type: "latestBlock",
                    payload: {} as IBlock,
                }
                const messageString = JSON.stringify(message)
                socket.write(messageString)
            })
        })
    }
}

export default P2PNetwork
