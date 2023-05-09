import net, { Socket } from "net"

class P2PNetwork {
    listne(port: number) {
        const server = net.createServer((socket: Socket) => {
            console.log(socket)
        })
        console.log("p2p server start")
        server.listen(port)
    }
    connet(port: number, host: string) {
        const socket = new net.Socket()
        socket.connect(port, host, () => {
            console.log("connect")
        })
    }
}

export default P2PNetwork
