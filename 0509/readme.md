# P2P

네트워크의 통신방식 중 하나인 P2P는 블록체인에서 중요한 통신방식중 하나이다.
이 P2P 방식은 클라이언트이자 서버라는 개념을 알고 시작해야 한다.

하나의 프로그램(코드들)을 작동시켜 하나의 프로세스(실행)로 실행하게 된다면 Client이자, Server가 구축되는 것이다. 코드기준으로 생각해보면 하나의 동일한 프로그램에서 클라이언트 측과, 서버 측 코드를 작성하는 것이다. 그렇기 때문에, 각 노드는 클라이언트와 서버의 역할을 하기 때문에 중앙서버 없이 통신이 가능하다.

블록체인은 각 노드가 데이터를 저장하며 블록체인을 형성하는 분산 원장 기술이다. 그래서 블록체인에서 P2P네트워크는 각 노드가 연결되어 데이터를 주고받으며 분산 원장을 유지하고 전파하는데 중요한 역할을 한다.

# 코드 작성하기

네트워크 구성을 위하여 하나의 노드를 만드는데, Client측 코드와, Server측 코드를 작성할 것이다.
A와 B노드가 있을 때, 각 노드는 P2P방식으로 통신하므로 A노드가 B노드로 요청을 보내면서 다른 노드의 요청에 응답을 할 수 있도록 코드를 작성할 것이다.

이번에 목표는 기본적으로 P2P 네트워크 통신을 위해 net모듈을 이용해서 TCP 서버 코드를 작성하고,
2개의 노드가 있을 때, 1번 노드와 2번 노드의 블록을 비교했을 때, 차이가 생긴다면, 긴 체인을 따르는 과정을 만들 예정이다.

## server/p2p.ts

서버측 코드를 작성해서 서버를 열고 대기상태를 만드는 listen()를 작성한다.

```ts
class P2PNetwork {
    listen(port: number) {
        const connection = (socket: Socket) => console.log(socket)
        const server = net.createServer(connection)
        server.listen(port)
    }
}
```

이 코드를 이용해서 서버를 열기 위해서 index.ts를 수정하여 8555번 포트로 실행시킨다.

```ts
// index.ts
import Block from "@core/block/block"
import ProofOfWork from "@core/block/workproof/proofofwork"
import WorkProof from "@core/block/workproof/workproof"
import Chain from "@core/chain/chain"
import CryptoModule from "@core/crypto/crypto.module"
import Ingchain from "@core/ingchain"
import Transaction from "@core/transaction/transaction"
import Unspent from "@core/transaction/unspent"
import DigitalSignature from "@core/wallet/digitalSignature"
import Wallet from "@core/wallet/wallet"
import App from "@server/app"
import Message from "@server/message"
import P2PNetwork from "@server/p2p"

const chain = new Chain()
const crypto = new CryptoModule()
const proof = new ProofOfWork(crypto)
const workProof = new WorkProof(proof)
const block = new Block(crypto, workProof)
const transaction = new Transaction(crypto)
const unspent = new Unspent()
const digitalSignature = new DigitalSignature(crypto)
const accounts = new Wallet(digitalSignature)
const baekspace = new Ingchain(chain, block, transaction, unspent, accounts)
const app = App(baekspace)

const message = new Message(baekspace)
const p2p = new P2PNetwork(message)
p2p.listen(8555)
```

코드를 실행시켜도 'console.log(socket)'이 출력되지 않는다.

서버를 열고, 대기 상태이기 때문에 connection 함수가 실행되지 않는다.
console.log(socket)이 정장적으로 작동하여 출력되는 시점은 다른 노드측과 새로운 연결이 되면서 커넥션이 맺어졌을 때 작동된다.

클라이언트 부분을 작성하기 위해서 일반적으로 server측 코드와는 다른 파일에서 작성이 되었지만 P2P network를 위해서 서버측을 구성하는 코드와, 클라이언트를 구성하는 코드를 같은 파일에 작성한다.

```ts
class P2PNetwork {
    listen() {} // 서버를 열고 대기 상태로 한다.
    connet() {} // 대기하는 서버에게 요청을 보낸다.
}
```

## P2PNetwork 클래스 완성하기

```ts
//network.interface.ts
import { IBlock } from "@core/block/block.interface"

export type MessageType = "latestBlock" | "allBlock"
export type Payload = IBlock | IBlock[]

export interface MessageData {
    type: MessageType
    payload: Payload
}
```

```ts
//p2p.ts
class P2PNetwork {
    private readonly sockets: Socket[] = []
    constructor(private readonly message: Message) {}
    listen(port: number) {
        const connection = (socket: Socket) => this.handleConnection(socket)
        const server = net.createServer(connection)
        server.listen(port)
    }
    connet(port: number, host: string) {
        const socket = new net.Socket()
        const connection = () => this.handleConnection(socket)
        socket.connect(prot, host, connection)
    }

    private handleConnection(socket: Socket) {
        console.log(`[+] New Connection from ${socket.remoteAddress}:${socket.remotePort}`)
        this.sockets.push(socket)

        const dataCallback = (data: Buffer) => this.message.handler(socket, data)
        socket.on("data", dataCallback)

        const message : MessageData = {
            type:"latestBlock"
            payload:{} as IBlock
        }
        socket.write(JSON.stringify(message))

        const disconnect = () => this.handleDisconnect(socket)

        // 소켓을 끄거나 에러가 발생할 때 disconnect 함수를 실행한다.
        socket.on("close", disconnect)
        socket.on("error", disconnect)
    }

    private handleDisconnect (socket:Socket){
        const index = this.socket.indexOf(socket)
        if(index === -1) return
        this.sockets.splice(index,1)
        console.log( `[-] Connection from ${socket.remoteAddress}:${socket.remotePort} closed`)
    }
}
export default P2PNetwork

```

현재 이 코드는 하나의 노드에 대해서 listen과 connet를 작성했다.
하나의 노드로는 테스트를 진행할 수 없기 때문에 응답을 주고 받기 위해서는 같은 코드를 이용하는 프로세스를 하나 더 실행시켜서 동작을 확인할 수 있다.

```ts
//client.ts
import P2PNetwork from "@server/p2p"
import Block from "@core/block/block"
import ProofOfWork from "@core/block/workproof/proofofwork"
import WorkProof from "@core/block/workproof/workproof"
import Chain from "@core/chain/chain"
import CryptoModule from "@core/crypto/crypto.module"
import Ingchain from "@core/ingchain"
import Transaction from "@core/transaction/transaction"
import Unspent from "@core/transaction/unspent"
import DigitalSignature from "@core/wallet/digitalSignature"
import Wallet from "@core/wallet/wallet"
import App from "@server/app"
import Message from "@server/message"

const chain = new Chain()
const crypto = new CryptoModule()
const proof = new ProofOfWork(crypto)
const workProof = new WorkProof(proof)
const block = new Block(crypto, workProof)
const transaction = new Transaction(crypto)
const unspent = new Unspent()
const digitalSignature = new DigitalSignature(crypto)
const accounts = new Wallet(digitalSignature)
const baekspace = new Ingchain(chain, block, transaction, unspent, accounts)
const app = App(baekspace)

const message = new Message(baekspace)
const p2p = new P2PNetwork(message)

p2p.listen(8556)
p2p.connet(8555, "127.0.0.1") // 1번 노드의 서버측 코드와 커넥션을 맺기 위해서 port, host를 작성한다.
```

1번 노드인 index.ts와 같은 코드이지만 2번 노드는 1번 노드와 연결되기 위해서 connet()함수를 호출하여 준다.

## Message 클래스 완성하기

의존성 주입한 message는 요청과 응답에 대한 처리를 위해 따로 분리해서 작성한 class이다.

```ts
class Message {
    constructor(private readonly blockchain: Ingchain) {}
    handler(socket: Socket, data: Buffer) {
        const { type, payload } = JSON.parse(data.toString("utf-8"))
        const message = (this as any)[type](payload) // type 값에 따라 해당 메서드를 동적으로 호출하기 위해 대괄호 표기법을 사용
        if (!message) return
        socket.write(message)
    }

    private latestBlock(payload: Payload): string | undefined {
        const message: MessageData = {
            type: "allBlock",
            payload: this.blockchain.chain.latestBlock(), // Ingchian에서 의존 주입된 chain을 public으로 바꾼다.
        }
        return JSON.stringify(message)
    }

    private allBlock(payload: Payload): string | undefined {
        if (Array.isArray(payload)) return
        // 1. 블록의 해시를 이용해 검증한다.
        this.blockchain.block.isValidBlock(payload)
        // 2. 블록체인의 높이를 이용해 검증한다.
        const isValid = this.blockchain.chain.isValidChain(payload)
        if (isValid) {
            // 두 노드의 블록체인이 다르다면 긴체인을 덮어쓰고 끝낸다.
            this.blockchain.chain.addToChain(payload)
            console.log(this.blockchain.chain.get()) // 블록체인 확인을 위한 console.log
        }
        return
    }
}
export default Message
```

```ts
// chain.ts
// inValidChain 메서드 추가
public isValidChain(receivedBlock: IBlock) {
    const latestBlock = this.latestBlock()
    if (latestBlock.height + 1 !== receivedBlock.height) {
        return false
    } else if (latestBlock.timestamp > receivedBlock.timestamp) {
        return false
    }
    return true
}

```

타입을 이용하여 함수를 실행한다. type을 이용하여 함수를 실행하기 때문에, 여러 조건문을 작성하지 않고 해당 메서드로 바로 실행하면서 자원을 아낄 수 있다.

노드 2개가 커넥션이 되면 처음 각자의 마지막 블록을 공유하면서 비교를 한다. 그 중에 블록체인이 같지 않은 노드를 발견시 짧은 체인을 가진 노드가 더 긴 체인과 일치하도록 블록체인을 업데이트한다.

이 과정을 통해서 노드는 항상 같은 높이의 블록체인을 유지할 수 있다.
