# Network

블록체인의 네트워크에서 P2P라는 단어는 빠질 수 없다.
P2P는 "Peer-to-Peer"의 약자로 중앙 서버 없이 컴퓨터나 장치들이 직접적으로 연결되는 형태를 의미한다.
중앙 서버가 없기 때문에 하나의 노드에 장애가 발생하더라도 전체 시스템에 영향을 미치지 않으며, 정상적으로 작동 할 수 있다.

P2P 시스템 특징으로 모든 노드에서 데이터를 공유하기 때문에 거래의 투명성 및 신뢰성이 생기며, 데이터의 수정과 조작이 어렵다.

블록체인 네트워크에서의 각 노드들이 연결되며 데이터를 서로 교환하고 공유한다.
노드는 데이터를 요청하는 Client의 역할을 하면서, 데이터를 응답해주는 Server의 역할도 할 수 있다.

# 노드의 통신방식

한 가지의 노드는 대표적으로 3가지 포트를 사용한다.
웹브라우저, 클라이언트 관련된 포트 2가지와 다른 노드와의 연결을 위한 포트이다.

-   웹브라우저, 클라이언트는 Http 통신과, WS통신을 이용한다.
-   다른 노드와의 상호작용을 위한 TCP 통신을 이용한다.

# Infura

일반적으로 블록체인 네트워크의 데이터를 얻기 위해서 노드와 통신을 하여 데이터를 얻어와야 한다.

노드와 통신을 하기 위해서는 내가 해당 노드와 커넥션을 해야하고 커넥션을 하기 위해서는 그 노드에 대한 정보가 있어야 하는데, 이미 네트워크에 포함되어 있는 노드에 접근은 쉽지 않다.
그래서 각 프로그래밍 언어로 만들어져 있는 기본적인 노드를 구성하는 코드를 이용해서 내가 직접 네트워크의 참여자가 되는 방법이 있다.

내가 노드를 구성해서 네트워크의 다른 노드들과 sync를 맞춰서 내 클라이언트에서 내 노드로 접근해서 데이터를 얻는 방법이 제일 일반적인 방법이지만 이 방법에 가장 큰 문제점은 동기화하는데 걸리는 시간이다.

현재까지 비트코인이든 이더리움이든 블록이 많이 생성되어있는데, 네트워크의 각 노드는 체인형태의 블록들을 다 가지고 있다. 내가 만든 노드도 네트워크에 참여하면서 공유되고 있는 블록들을 똑같이 동기화해야 하는데 동기화 하는 과정에서 많은 시간과 비용이 든다.

이런 비용과 시간을 아끼기 위해서 infura라는 서비스를 이용할 수 있다.
Infura에 API요청을 통하여 블록체인 네트워크의 정보를 얻을 수 있기 때문에, 직접 노드를 관리하는 번거로움 및 비용을 줄이고, 네트워크에 조금 더 쉽게 접근 할 수 있다.

# 브라우저와 노드의 통신

브라우저와 노드 1개인 상황에서의 통신을 구현하는 코드를 작성할 것이다.
간단한 흐름을 보기 위한 코드이기 때문에 nunjucks를 이용해서 화면을 구성할 예정이고, CSS는 제외했다.
디렉토리 구조도 잘 나누어야 하지만, wallet_front 디렉토리를 이용하여 front 서버를 이용해서 화면을 그릴 것이다.

브라우저는 3000번 포트를 이용하고, 노드는 8545번 포트를 이용한다.

# 화면 구성 (지갑 프로그램 만들기)

## Wallet

wallet 영역은 버튼을 이용해서 privateKey, publicKey, account, balance(잔액)을 생성하고, 이를 보여주는 영역이다.
privateKey, publicKey, account의 경우에는 브라우저 서버에서 단순히 메서드 호출을 이용해서 화면을 그릴 수 있지만, balance의 경우에는 UTXO(미사용 트랜잭션 출력값)을 이용해서 구해야하기 때문에
노드에서 해당 account에 대한 UTXO만 얻어서 잔액을 구할 것이다.

## Wallet List

Wallet List는 생성버튼을 이용해서 만드는 keypair 및 account가 여러개 있을 경우 그 목록을 보여주는 역할을 하며, account 값만 나열한다. 이 account 값을 누르면 wallet의 항목에 내가 선택한 계정의 정보가 보인다.

## Transaction

Transaction 영역은 송금을 보내는 역할로 "받는 사람"과 "보내는 금액"을 작성할 수 있다.
wallet 영역에 선택된 계정에서 보내며, 해당 계정의 UTXO를 사용한다.

# 코드 작성하기

## Node 만들기

```ts
// index.ts

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

const app = App(baekspace) // server/app.ts

app.listen(8545, () => {
    console.log(`server start`)
})
```

```ts
//server/app.ts

import Ingchain from "@core/ingchain"
import express from "express"

export default (blockchain: Ingchain) => {
    const app = express()
    app.use(express.json())

    app.get("/", (req, res) => {
        res.send("Hello, Ingchain")
    })

    //잔액 구하기
    app.post("/getBalance", (req, res) => {
        const { account } = req.body
        const balance = blockchain.getBlance(account)
        res.json({ balance })
    })

    //계정 생성
    app.put("/accounts", (req, res) => {
        const account = blockchain.accounts.create() // account는 public으로 주입했다.
        res.json({ ...account })
    })

    //계정 목록 불러오기
    app.get("/accounts", (req, res) => {
        const account = blockchain.accounts.getAccounts()
        res.json(account)
    })

    //블록 마이닝
    app.post("/mineblock", (req, res) => {
        const { account } = req.body
        const newBlock = blockchain.mineBlock(account)
        res.json(newBlock)
    })

    // 트랜잭션
    app.post("/transaction", (req, res) => {
        const { receipt } = req.body
        receipt.amount = parseInt(receipt.amount)
        const transaction = blockchain.sendTransaction(receipt)
        res.json({
            transaction,
        })
    })
    return app
}
```

## 브라우저 wallet 만들기

브라우저에서 wallet을 화면에 그릴 때 기존에 코드를 잘 작성해놓게 되면 코드의 재활용이 좋다.
단순히 Node를 구성하는데에만 쓰는 메서드가 아닌 브라우저에서도 사용할 수 있기 때문에 코드를 확장성 있게 잘 구현하면 좋다.

**src/wallet_front** 디렉토리 안에서 구현할 예정이다

```ts
//  wallet_front/index.ts
import CryptoModule from "@core/crypto/crypto.module"
import DigitalSignature from "@core/wallet/digitalSignature"
import Wallet from "@core/wallet/wallet"
import WalletClient from "@wallet_front/app"
const crypto = new CryptoModule()
const digitalSignature = new DigitalSignature(crypto)
const accounts = new Wallet(digitalSignature)
const app = WalletClient(accounts)

app.listen(3000, () => {
    console.log(`wallet Start`)
})
```

```ts
//  wallet_front/app.ts
import express from "express"
import nunjucks from "nunjucks"
import axios from "axios"
import path from "path"
import Wallet from "@core/wallet/wallet"

export default (accounts: Wallet) => {
    const app = express()
    const viewDir = path.join(__dirname, "views")
    app.use(express.json())
    app.set("view engine", "html")
    nunjucks.configure(viewDir, {
        express: app,
    })

    app.get("/", (req, res) => {
        res.render("index")
    })

    //계정 생성하기
    app.post("/wallet", async (req, res) => {
        const account = accounts.create()
        const {
            data: { balance },
        } = await axios.post("http://127.0.0.1:8545/getBalance", {
            account: account.account,
        })
        res.json({ ...account, balance })
    })

    //계정 목록 불러오기
    app.get("/wallet", (req, res) => {
        const accountList = accounts.getAccounts()
        res.json(accountList)
    })

    //계정을 이용해서 잔액 구하기
    app.get("/wallet/:account", async (req, res) => {
        const account = accounts.get(req.params.account)
        const {
            data: { balance },
        } = await axios.post("http://127.0.0.1:8545/getBalance", {
            account: account.account,
        })
        res.json({ ...account, balance })
    })

    // 트랜잭션 만들기
    app.post("/transaction", async (req, res) => {
        const { sender, received, amount } = req.body
        const { publicKey, privateKey } = accounts.get(sender)
        const receipt = accounts.sign(
            {
                sender: {
                    account: sender,
                    publicKey,
                },
                received,
                amount,
            },
            privateKey
        )
        const tx = await axios.post("http://127.0.0.1:8545/transaction", { receipt })
        res.json(tx.data)
    })
    return app
}
```

```html
<!--  화면 그리기 -->
<!--  views/index.html -->
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    </head>
    <body>
        <h2>wallet</h2>
        <button id="wallet_btn">지갑생성</button>
        <ul id="wallet_list">
            <li>privateKey : <span class="privateKey"></span></li>
            <li>publicKey : <span class="publicKey"></span></li>
            <li>account : <span class="account"></span></li>
            <li>balance : <span claa="balance"></span></li>
        </ul>

        <h2>Wallet List</h2>
        <ul id="wallet_list2"></ul>

        <h2>Transaction</h2>
        <form action="" id="transactionForm">
            <ul>
                <li>received : <input type="text" id="received" placeholder="보낼계정" /></li>
                <li>amount : <input type="text" id="amount" placeholder="보낼금액" /></li>
            </ul>
            <button type="submit">전송</button>
        </form>
    </body>
    <script type="text/javascript">
        const walletBtn = document.querySelector("#wallet_btn")
        const walletUl = document.querySelector("#wallet_list2")
        const transactionForm = document.querySelector("#transactionForm")

        const createWallet = async () => {
            const response = await axios.post("http://127.0.0.1:3000/wallet")
            console.log(response.data)
            view(response.data)
            walletList()
        }

        const view = (accounts) => {
            const walletList = document.querySelectorAll("#wallet_list > li > span")
            walletList[0].innerHTML = accounts.privateKey
            walletList[1].innerHTML = accounts.publicKey
            walletList[2].innerHTML = accounts.account
            walletList[3].innerHTML = accounts.balance
        }

        const walletList = async () => {
            const { data } = await axios.get("http://127.0.0.1:3000/wallet")
            const accountList = data.map((account) => `<li>${account}</li>`).join("")
            walletUl.innerHTML = accountList
        }
        const clickHandler = async (e) => {
            try {
                const account = e.target.innerHTML
                if (account.length !== 40) return
                const { data } = await axios.get(`http://127.0.0.1:3000/wallet/${account}`)
                view(data)
            } catch (e) {
                console.error(e.message)
            }
        }
        const submitHansdler = async (e) => {
            e.preventDefault()
            const request = {
                sender: document.querySelector(".account").innerHTML,
                received: e.target.received.value,
                amount: e.target.amount.value,
            }
            await axios.post("http://127.0.0.1:3000/transaction", {
                ...request,
            })
        }
        walletBtn.addEventListener("click", createWallet)
        walletUl.addEventListener("click", clickHandler)
        transactionForm.addEventListener("submit", submitHansdler)
        walletList()
    </script>
</html>
```

nunjucks를 이용해서 간단하게 구현하는 코드가 완성되었다.

트랜잭션을 전송하게되면 화면에 보이는 것이 없어서 제대로 트랜잭션이 생성되었는지 확인할 수 없지만 진행 된 것이기 때문에 여러번 누르지 않도록 해야하고, 보통은 다음블록이 생성되면서 트랜잭션이 데이터에 포함되기 전까지 로딩페이지를 보여줄 수 있고, 아니면 락 기능을 이용해서 처리가 된 것을 시각화 해줄 수 있다.

그리고, 현재 작성한 코드는 트랜잭션이 발생해도 다음 블록이 생성되야 잔액이 보이기 때문에 트랜잭션을 생성한 후에 블록을 생성하여서 제대로 트랜잭션이 처리되었는지 확인할 수 있다.
