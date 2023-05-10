# 다른 노드와의 커넥트

내 IP와, 서버를 열 때 사용했던 PORT번호를 이용해서 다른 사람의 접속을 허용할 수 있다.

```ts
//P2PNetwork class
connet(port: number, host: string) {
    const socket = new net.Socket()
    const connection = () => this.handleConnection(socket)
    socket.connect(port, host, connection)
}
```

connet 함수를 이용해서 커넥션을 맺는다. connect()에 의해 handleConnection()가 실행되며,
handleConnection()함수는 아래와 같다.

```ts
private handleConnection(socket: Socket) {
    console.log(`[+] New Connection from ${socket.remoteAddress}:${socket.remotePort}`)
    this.sockets.push(socket)
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
```

접속을 하는 사용자의 IP와 PORT를 console로 확인하고, messageHandler 함수가 실행되는데,

```ts
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
```

처음 실행에선 message가 없기 때문에 바로 리턴되며 다음 코드가 진행된다.

```ts
const message: MessageData = {
    // 요청을 위한 데이터
    type: "latestBlock",
    payload: {} as IBlock,
}
socket.write(JSON.stringify(message))
```

message는 위의 내용을 담고 socket.write가 되며, write()로 데이터를 보내면서 다른 노드의 socket.on()함수가 발동되고 type에 따른 함수가 실행된다. type을 이용하여 호출을 하기 때문에, 모든 노드에서의 type은 같아야한다. string 타입으로 오타에 조심해야 한다.

```ts
import { IBlock } from "@core/block/block.interface"
import Ingchain from "@core/ingchain"
import { TransactionRow } from "@core/transaction/transaction.interface"
import { Socket } from "net"
import { MessageData, Payload } from "./network.interface"

class Message {
    constructor(private readonly blockchain: Ingchain) {}
    handler(type: string, payload: Payload) {
        try {
            const message = (this as any)[type](payload)
            return message
        } catch (e) {
            return
        }
    }

    //메세지를 받은 사람이 호출을 한다.
    private latestBlock(): string | undefined {
        console.log("latestBlock")
        return this.getAllBlockMessage()
    }
    private allBlock(payload: Payload): string | undefined {
        console.log("allBlock")
        if (Array.isArray(payload)) return
        if (payload instanceof TransactionRow) return
        const result = this.blockchain.addBlock(payload)
        if (result) return
        return this.getReceivedChainMessage()
    }

    private receivedChain(payload: Payload) {
        //IBlock[]
        console.log("receivedChain")
        if (!Array.isArray(payload)) return
        if (payload instanceof TransactionRow) return

        this.blockchain.replaceChain(payload)
    }

    private receivedTransaction(payload: Payload) {
        if (Array.isArray(payload)) return
        if (payload instanceof IBlock) return
        console.log(`업데이트 : 트랜잭션 내용이 추가되었습니다. Peer들에게 전달합니다.`)

        this.blockchain.replaceTransaction(payload)
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
```

자세한 코드는 GitHub에 올려놓았다.

# 노드간 통신 및 노드 동기화

블록체인 네트워크에 노드가 추가되어 특정 노드와 커넥션을 맺는 과정이 중요하다.
기존에 네트워크에서 작동하고 있던 노드는 네트워크 내에서 추가되었던 블록들을 체인형태로 가지고 있다.
새로운 노드는 커넥션을 할 때, 연결할 노드와의 검증작업 및 동기화 과정을 거친다.

노드 A와 B가 서로 연결된다고 가정했을 때, 동기화를 하는 과정은 아래와 같다.

1. A와 B가 연결되면 마지막 블록을 서로에게 보내서 확인을 한다.
2. 블록의 높이가 다르다면, 각자 가지고 있는 전체 블록을 공유하여 비교한다.
3. 그 중 긴 체인을 가지고 있는 노드의 블록내용을 짧은 체인을 가진 노드에게 덮어쓴다.
4. 위의 과정을 통해서 긴 체인을 가진 노드의 블록정보를 동기화되어 새로운 노드의 블록체인 내용이 기존의 노드와 동기화가 된다.

# 지갑을 이용한 트랜잭션 생성 및 노드 동기화

wallet_front 디렉토리를 이용해서 브라우저에 wallet을 구현하였다.

wallet 서버 1개, 연결할 노드 서버 1개, 연결될 노드 서버 1개 최소 3가지의 서버에 대해서 알아야 한다.

1. 노드 두 개는 위의 방법을 이용해서 연결이 되었다면, wallet을 이용하여 계정을 만든다.
2. 생성된 계정은 잔액이 0원이기 때문에 마이닝 과정을 이용해서 보상을 받아서 잔액을 늘릴 수 있다.
3. 트랜잭션 영역에서 보낼 계정과, 금액을 작성하게 되면, 영수증이 작성되고, 이를 이용해서 트랜잭션을 만든다.
4. 작성된 트랜잭션은 노드로 전송되어 트랜잭션 풀에 담기고, 브로드캐스트를 이용해서 모든 노드의 트랜잭션 풀에 같은 정보를 가지고 대기하여 블록이 생성되기 기다린다.
5. 블록이 생성되는 과정에서 트랜잭션 풀에 있던 트랜잭션을 이용해서 데이터를 담고, 블록을 생성한다.
6. 블록이 생성되면, 브로드캐스트를 통해서 블록이 생성된 것을 알리고, 각 노드들과 동기화하는 작업을 거치며 모든 노드의 블록체인을 최신화한다.
7. 위의 과정들이 노드의 데이터가 변할 때 마다 진행되어 블록체인을 동기화하고, 트랜잭션 및 UTXO의 최신화를 유지한다.
