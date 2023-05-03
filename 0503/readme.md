# wallet

개인키와 공개 키, 계정 및 디지털 서명을 이용해서
계정 생성, 개인키를 사용하여 계정 설정, 계정 검색 및 서명된 영수증 생성을 하는 메서드를 포함하는 클래스이다.
wallet클래스를 만들기 전에 기존에 있었던 코드의 디렉토리 구조를 변경한다.

```ts
//wallet.interface.ts
export class Sender {
    publicKey?: string
    account!: string
}
export class Receipt {
    sender!: Sender
    received!: string
    amount!: number
    signature?: SignatureInput
}
```

transaction.interface에서 정의했던 두 개의 타입을 wallet.interface.ts를 생성하여 이동해준다.
digitalSignature.ts 파일에 작성된 디지털 서명에 관한 정보도 wallet에 관련된 내용이므로 wallet 디렉토리로 이동한다.
(기존에 작성한 코드의 불러오기 경로가 많이 달라지니 확인하면서 수정을 해준다.)

```bash
|
| - wallet
| --- digitalSignature.ts
| --- wallet.interface.ts
| --- wallet.ts
|
```

```ts
///wallet.ts
class wallet {
    constructor() {}

    public create() {} // privateKey생성을 하면서 계정을 생성하는 메서드
    public set() {} // privateKey를 가진 상태에서 계정을 생성하는 메서드
    public getAccount() {} // 계정을 확인을 위한 메서드, 개인키를 노출하지않고 값을 얻을 수 있다.
    private getPrivate() {} // 계정을 이용해서 개인키를 구하는 메서드
    public receipt() {} // 서명된 영수증을 생성하는 메서드
}
export default wallet
```

```ts
//wallet.interface.ts
export class Accounts {
    privateKey!: string
    publicKey!: string
    account!: string
}
```

## wallet.ts 완성하기

```ts
class wallet {
    private readonly accounts: Accounts[] = []
    constructor(private readonly digitalSignature: DigitalSignature) {}

    // 객체를 생성해서 accounts에 넣어준다. [{},{},...]의 형태가 될 예정이다.
    create(): Accounts {
        const privateKey = this.digitalSignature.createPrivateKey()
        const publicKey = this.digitalSignature.createPublicKey(privateKey)
        const account = this.digitalSignature.createAccount(publicKey)

        const accounts: Accounts = {
            account,
            publicKey,
            privateKey,
        }
        this.accounts.push(accounts)

        return accounts
    }

    // create와 같은 기능 하지만 privateKey가 있을 때 사용하는 메서드이다.
    set(privateKey: string): Accounts {
        const publicKey = this.digitalSignature.cretePublicKey(privateKey)
        const account = this.digitalSignature.createpublicKey(publicKey)

        const accounts: Accounts = {
            account,
            publicKey,
            privateKey,
        }
        this.accounts.push(accounts)

        return accounts
    }

    // privateKey는 노출되면 안되기 때문에 getAccounts함수를 이용하여 account값을 구해서 사용한다.
    getAccounts() {
        const accounts = this.accounts.map((v) => v.account)
        return accounts
    }

    private getPrivateKey(account: string): string {
        return this.accounts.filter((v) => v.account === account)[0].privateKey
    }

    receipt(received: string, amount: number) {
        const { account, publicKey, privateKey } = this.account[0]
        const sender = {
            account,
            publicKey,
        }

        // 의존 주입을 한 digitalSignature의 메서드인 sign()은
        // privateKey를 이용하여 서명을 포함한 receipt를 작성한다.
        const receipt = this.digitalSignature.sign(privateKey, {
            sender,
            received,
            amount,
        })
        return receipt
    }
}

export default wallet
```

wallet 클래스는 한 사용자에 대한 정보이다. 멤버변수를 보면 accounts로 배열로 관리하는 것을 확인할 수 있는데, 이는 한 사용자가 여러 계정을 가질 수 있기 때문이다. 한 사람이 여러개의 계좌번호를 가질 수 있는 것과 같은 의미이다.

privateKey는 노출되면 안되지만, 클래스 내부적으로 사용하는 상황이 있기 때문에 private로 설정한다.
기본값으로 public이기 때문에 private 지정을 안한 메서드는 public 생략되어있다. public으로 지정한 요소들의 경우 클래스를 인스턴스화 했을 때, 접근이 가능하지만 private로 지정한 것은 인스턴스화 하더라도 다른 곳에서 사용할 수 없다. 이를 데이터은닉화라 한다.

# chain

blockchain을 코드로 구현하면 블록을 배열형태로 가지고 있는것을 말한다.
블록체인도 DB에 저장되며, DB에 저장된다해서 중앙화시스템이라고 할 수 없다.
블록체인은 키-값을 이용한 데이터이므로 NoSQL같은 비관계형 데이터베이스를 사용하여 저장하는 경우가 많다.

```ts
class Chain {
    constructor() {}

    get() {} // chain 배열을 구하는 메서드
    length() {} // 체인의 총 길이를 구하는 메서드
    latestBlock() {} // 만들어진 가장 최신 블록을 구하는 메서드
    addToChain() {} // 블록을 체인에 추가하는 메서드
    getBlock() {} // 해시or블록높이에 따른 블록을 찾기위한 메서드
    getBlockbyHash() {} // 해당 블록해시를 찾는 메서드 (내부에서 getBlock()실행)
    getBlockbyHeight() {} // 해당 블록높이를 찾는 메서드 (내부에서 getBlock()실행)
    getAdjustmentBlock() {} // 난이도를 위한 기준 블록을 구하는 메서드
    serialize() {} // 블록체인 네트워크에서 객체를 주고받을 수 없기 때문에 string으로 변환하는 메서드
    deserialize() {} // serialize 메서드의 반대
}
```

Chain 클래스는 기본 블록체인을 구현하기 위한 기본적인 구조의 역할을 하며 블록체인을 만들고 관리하는 메서드를 담은 클래스이다.

## chain.ts 완성하기

```ts
class Chain {
    private readonly INTERVAL: number = DIFFICULTY_ADJUSTMENT_INTERVAL // 블록난이도 조정을 위한 간격을 설정하는 변수이다. 10으로 설정해두었다.
    private readonly chain: IBlock[] = [GENESIS]

    get() {
        return this.chain
    }
    length() {
        return this.chain.length
    }
    latestBlock() {
        return this.chain[this.length() - 1]
    }
    addToChain(receivedBlock: IBlock) {
        this.chain.push(receivedBlock)
        return this.latestBlock()
    }

    getBlock(callbackFn: (blcok: IBlock) => boolean) {
        const findBlock = this.chain.find(callbackFn)
        if (!findBlock) throw new Error("해당되는 블록이 없습니다.")
        return findBlock
    }
    getBlockbyHash(hash: string): IBlock {
        return this.getBlock((block: IBlock) => block.hash === hash)
    }
    getBlockbyHeight(height: number): IBlock {
        return this.getBlock((block: IBlock) => block.height === height)
    }

    getAdjustmentBlock() {
        const { height } = this.latestBlock()
        const findHeight = height < this.INTERVAL ? 1 : Math.floor(height / this.INTERVAL) * this.INTERVAL
        return this.getBlockbyHeight(findHeight)
    }
    serialize() {
        return JSON.stringify(this.chain)
    }
    deserialize(chunk: string) {
        return JSON.parse(chunk)
    }
}
export default Chain
```

# ingChain

현재 코드는 class를 이용해서 기능을 구현하는 메서드를 만든 상황이다.
그래서 레고 조각 같은 느낌으로 메서드들이 조각조각 있는데, 이를 필요한 기능에 맞춰서 간단하게 쓸 수 있도록 해야한다.
그래서 실행을 위한 하나의 클래스(IngChain)로 필요한 기능들을 조합해서 새로운 메서드로 만들 예정이다.
기존에 작성했던 UTXO에 관련된 코드의 리펙토링도 필요하다.

## unspent.ts

```ts
class Unspent {
    private readonly unspentTxOuts: UnspentTxOutPool = []
    constructor() {}

    //getter
    getUnspentTxPool() {
        return this.unspentTxOuts
    }

    // UTXO에서 input에 사용된 메서드를 삭제하는 메서드
    delete(txin: TxIn) {
        const { txOutId, txOutIndex } = txin
        const index = this.unspentTxOuts.findIndex((utxo: UnspentTxOut) => {
            return utxo.txOutId === txOutId && utxo.txOutIndex === txOutIndex
        })
        if (index !== -1) this.unspentTxOuts.splice(index, 1)
    }
    // UTXO 배열안에 새로운 UTXO객체를 넣는 메서드이다
    create(hash: string) {
        return (txout: TxOut, txOutIndex: number) => {
            const { amount, account } = txout
            this.unspentTxOuts.push({
                txOutId: hash,
                txOutIndex,
                account,
                amount,
            })
        }
    }

    // 트랜젝션의 요소 하나씩 update 함수에 대입하여 처리할 수 있도록 한다.
    sync(transactions: TransactionData) {
        if (typeof transactions === "string") return
        transactions.forEach(this.update.bind(this))
    }
    //트랜잭션의 내용을 이용하여 UTXO를 정리하는 메서드이다.input, output을 처리한다.
    update(transaction: TransactionRow): void {
        const { txIns, txOuts, hash } = transaction
        if (!hash) throw new Error("hash값이 없습니다.")
        txOuts.forEach(this.create(hash))
        txIns.forEach(this.delete.bind(this))
    }

    //내 UTXO만 뽑아오는 메서드
    me(account: string): UnspentTxOut[] {
        // const utxo = this.UnspentTxOuts
        const myUnspentTxOuts = this.unspentTxOuts.filter((utxo) => utxo.account === account)
        return myUnspentTxOuts
    }

    //amount 값구하기
    getAmount(myUnspentTxOuts: UnspentTxOut[]) {
        return myUnspentTxOuts.reduce((acc, utxo) => {
            return acc + utxo.amount
        }, 0)
    }

    isAmount(currentAmount: number, targetAmount: number) {
        if (currentAmount < targetAmount) return true
        return false
    }
    isAmount2(account: string, sendAmount: number) {
        const myUnspentTxOuts = this.me(account)
        const totalAmount = this.getAmount(myUnspentTxOuts)
        if (totalAmount < sendAmount) return true
        return false
    }

    //영수증의 정보를 가지고 미사용트랜잭션을 구해올 수 있다.
    getInput(myUnspentTxOuts: UnspentTxOut[], receiptAmount: number, signature: SignatureInput) {
        let targetAmount = 0 //

        const txins = myUnspentTxOuts.reduce((acc: TxIn[], unspentTxOut: UnspentTxOut) => {
            const { amount, txOutId, txOutIndex } = unspentTxOut
            if (targetAmount >= receiptAmount) return acc
            targetAmount += amount
            acc.push({ txOutIndex, txOutId, signature })
            return acc
        }, [] as TxIn[])

        return txins
    }

    //내가 가지고 있는 자산에서
    //보낼 금액을 뺐을 때 0 이상일 경우 잔돈을 준다.
    // 보내는 사람주고, 보낼금액, 나의주소, 나의금액
    getOutput(received: string, amount: number, sender: string, balance: number) {
        const txouts: TxOut[] = []
        txouts.push({ account: received, amount })
        if (balance > 0) {
            txouts.push({ account: sender, amount: balance })
        }
        return txouts
    }
}
export default Unspent
```

## ingchain.ts

```ts
class Ingchain {
    constructor(
        private readonly chain: Chain,
        private readonly block: Block,
        private readonly transaction: Transaction,
        private readonly unspent: Unspent
    ) {}

    //블록을 생성하기 위한 메서드
    mineBlock(account: string) {
        const latestBlock = this.chain.latestBlock()
        const adjustmentBlock = this.chain.getAdjustmentBlock()

        const coinbase = this.transaction.createCoinbase(account, latestBlock.height)
        const newBlock = this.block.createBlock(latestBlock, [coinbase], adjustmentBlock)
        this.chain.addToChain(newBlock) // [GENESIS, block#2]
        console.info(`블럭이 생성되었습니다.`)
        this.unspent.sync(newBlock.data)

        return this.chain.latestBlock()
    }

    // 내 계정에 대한 UTXO를 구하고, UTXO의 amount만 합하여 총 잔액을 보여준다.
    getBalance(account: string) {
        const myUnpentTxOuts = this.unspent.me(account)
        const balance = this.unspent.getAmount(myUnpentTxOuts)
        return balance
    }
}
export default Ingchain
```

# index.ts

모든 메서드는 조각조각으로 각 파일, 클래스안에 있다. 이 메서드들을 IngChain에서 의존성 주입을 받아서 블록을 생성하기위해서 단하나의 메서드만 부를 수 있도록 각 메서드를 모아서 로직을 구현해 놨다.

블록을 생성하는 것 뿐아니라 잔액을 구하는 메서드를 만들어 최종적으로 각 파일들에 있던 메서드들을 모아주는 하나의 클래스를 만들었다고 생각하면 된다.

그 최종적으로 만들어진 메서드를 index.ts에서 하나만 사용하므로써 안에있는 로직이 구현 될 수 있도록 한다.

```ts
const chain = new Chain()

const crypto = new CryptoModule()
const proof = new ProofOfWork(crypto)

const workProof = new WorkProof(proof)
const block = new Block(crypto, workProof)

const transaction = new Transaction(crypto)
const unspent = new Unspent()
const baekspace = new Ingchain(chain, block, transaction, unspent)

const digitalSignature = new DigitalSignature(crypto)
const accounts = new wallet(digitalSignature)

const sender = accounts.create()
const received = accounts.create()

baekspace.mineBlock(sender.account)
baekspace.mineBlock(sender.account)
baekspace.mineBlock(sender.account)
baekspace.mineBlock(sender.account)
baekspace.mineBlock(sender.account)
baekspace.mineBlock(received.account)
baekspace.mineBlock(received.account)

const balance = baekspace.getBalance(sender.account)
const balance2 = baekspace.getBalance(received.account)
console.log(balance, balance2)
```

블록을 생성하기 위해서는 mineBlock()만 호출하면 되고, 잔액을 구하기 위해서 getBalance()만 호출하면 된다.
매개 변수로 받아야 하는 것이 많아서 복잡해 보일 수 있다.
