# 블록체인 - 블록 만들기

어제의 코드에서 블록을 생성할 때, data로 들어가는 내용은 코인베이스에 대한 내용만 들어갔다.
원래는 코인베이스를 포함해서 트랜잭션들의 내용을 배열로 가지고 블록을 만든다.

```ts
const newBlock = this.block.createBlock(latestBlock, [coinbase, ...transactionPool], adjustmentBlock)
```

# 트랜잭션 풀 (transaction Pool)

트랜잭션 풀은 블록의 데이터로 포함되지 않았던 트랜잭션들을 모아놓은 공간으로 트랜잭션의 검증과정을 거친 후 블록의 데이터로 사용되기 전 대기하는 공간이다.

트랜잭션 풀을 코드로 구현하면 단순히 배열안에 트랜잭션들을 배열로 저장한 변수이다.

```ts
const TxPool: TransactionRow = [transaction]
```

# 블록을 생성하는 기본 과정

사용자가 receipt를 노드에게 보낸다. 노드에서 영수증에 대한 검증을 한 후 트랜잭션을 생성해서 트랜잭션 풀에 담고 블록에 포함되기를 기다린다. 블록을 생성할 때 트랜잭션 풀에서 트랜잭션을 가져다가 블록의 데이터로 이용하여 블록을 생성한다. 트랜잭션이 생성이 되면 연결되어있는 모든 노드들에게 전파하여 트랜잭션 풀에 대한 내용을 동일하게 가지고 있을 수 있도록 한다.

탈중앙화의 특성상 여러 채굴자가 동시에 채굴을 하는 과정에서 동일한 높이의 블록이 생성 될 수 있다. 하지만 블록체인에 포함되는 블록체인은 1가지이므로 여러개의 블록체인 중 채굴에 성공하지 못한 블록체인은 길이가 긴체인만 포함될 수 있다. 여기서 채굴에 성공하지 못한 블록을 엉클블록이라 하며, 이 블록은 생성 단계까지 갔던 블록이므로 유효한 트랜잭션을 가지고 있기 때문에 다른 블럭을 생성을 할 때 우선으로 생성 될 가능성이 높다.

# 코드를 이용해서 구현하기

IngChain 클래스에서 sendTransaction() 메서드를 이용해서 트랜잭션을 노드로 전송하고 노드에서 트랜잭션을 검사하고, 트랜잭션 풀에서 트랜잭션이 대기하고 있다가 블록을 생성할 때 블록에 담기는 순서대로 작성한다.

## index.ts

```ts
const baekspace = new Ingchian(chain, block, transaction, unspent, accounts)
//accounts 는 의존성 주입을 할 때, public으로 했기 때문에 Ingchain의 인스턴스를 생성할 때 account로 접근이 가능하다.
const receipt = baekspace.accounts.receipt(received.account, 30)

baekspace.sendTransaction(receipt)
```

## sendTransaction()

서명을 검증하는 과정이 digitalSignature.ts에 작성되어있는 것을
Wallet 클래스에서 작성할 수 있도록 메서드를 구현한다.
**wallent.ts**

```ts
class Wallet {
    //verify 추가
    public verify(receipt: Receipt): boolean {
        return this.digitalSignature.verity(receipt)
    }
}
```

**ingchain.ts**

```ts
class Transaction {
    // sendTransaction() 추가
    public sendTransaction() {
        //영수증을 검증한다.
        const isVerify = this.accounts.verify(receipt)
        if (!isVerify) throw new Error("올바르지 않은 영수증입니다.")
        // Sender의 잔액을 확인한다.
        const myUnspentTxOuts = this.unspent.me(receipt.sender.account)
        const balance = this.unspent.getAmount(myUnspentTxOuts)
        if (balance < receipt.amount) throw new Error("잔액이 부족합니다.")
        const tx = this.transaction.create(receipt, myUnspentTxOuts)
    }
}
```

## transaction.create()

Transaction 클래스의 create() 함수를 이용하여 트랜젝션 풀에 트랜잭션을 담는 과정을 구현한다.
인자값으로 전달된 영수증 및 나의 잔액을 이용하여 구현한다.

기존 코드에서 unspent.ts에 작성되었던 getInput, getOutput 메서드는 각각 트랜잭션의 input과 output을 만드는 메서드로 UTXO를 사용하고, 반환또는 전송하는 메서드였다. 그래서 이 두개의 메서드를 transaction.ts로 옮겨서 작성하고, create()를 완성한다.

create() 함수는 4가지 단계로 진행된다.

-   1. txIns : 사용할 UTXO 및 사용할 양 지정
-   2. txOuts : Output
-   3. txIns와 txOuts를 이용해서 객채 생성
-   4. 트랜잭션 풀에 담기

```ts
class Transaction {
    private readonly transactionPool: TransactionPool = []

    createInput(myUnspentTxOuts: UnspentTxOut[], receiptAmount: number, signature: SignatureInput): [TxIn[], number] {
        let targetAmount = 0 // 가지고 있는 UTXO에서 쓸 양을 나타내는 변수이다.

        const txins = myUnspentTxOuts.reduce((acc: TxIn[], unspentTxOut: UnspentTxOut) => {
            const { amount, txOutId, txOutIndex } = unspentTxOut
            if (targetAmount >= receiptAmount) return acc
            targetAmount += amount
            acc.push({ txOutIndex, txOutId, signature })
            return acc
        }, [] as TxIn[])
        return [txins, targetAmount]
    }
    createOutput(received: string, amount: number, sender: string, balance: number) {
        const txouts: TxOut[] = []
        txouts.push({ account: received, amount })
        if (balance - amount > 0) {
            txouts.push({ account: sender, amount: balance - amount })
        }
        const outAmount = txouts.reduce((acc, txout: TxOut) => acc + txout.amount, 0)
        if (balance !== outAmount) throw new Error("금액오류")
        return txouts
    }

    create(receipt: Receipt, myUnspentTxOuts: UnspentTxOut[]) {
        if (!receipt.signature) throw new Error("서명이 존재하지 않습니다.")
        const [txIns, balance] = this.createInput(myUnspentTxOuts, receipt.amout, receipt.signature)

        const txOuts = this.createOutput(receipt.received, receipt.amount, receipt.sender.account, balance)

        const transaction: TransactionRow = {
            txIns,
            txOuts,
        }
        transaction.hash = this.serializeRow(transaction) //  txIns, txOuts을 더해서 해시화한다.
        this.transactionPool.push(transaction)
        return transaction
    }
}
```

## mineBlock()

IngChain 클래스에 있는 블록을 생성하는 메서드를 수정한다.

```ts
class Ingchain {
    public mineBlock(account: string) {
        const latestBlock = this.chain.latestBlock()
        const adjustmentBlock = this.chain.getAdjustmentBlock()

        const transaction = this.transaction.getPool()
        const coinbase = this.transaction.createCoinbase(account, latestBlock.height)
        const newBlock = this.block.createBlock(latestBlock, [coinbase, ...transaction], adjustmentBlock)
        this.chain.addToChain(newBlock) // [GENESIS, block#2]
        console.info(`블럭이 생성되었습니다.`)
        this.unspent.sync(newBlock.data)
        this.transaction.sync(newBlock.data)

        return this.chain.latestBlock()
    }
}
```

**transaction.sync()**

```ts
class Transaction {
    //사용한 트랜잭션은 소멸해야된다.
    sync(transaction: TransactionData) {
        if (typeof transaction === "string") return
        transaction.forEach(this.update.bind(this))
    }
    update(transaction: TransactionRow) {
        // 내블럭의 data속성 안에 있는 transaction hash 값이랑 transactionPool에 있는 hash 값이 같으면 삭제
        const findCallback = (tx: TransactionRow) => {
            return transaction.hash === tx.hash
        }
        const index = this.transactionPool.findIndex(findCallback)

        if (index !== -1) this.transactionPool.splice(index, 1)
    }
}
```

현재 구현되어 있는 순서를 확인해보면

-   1. sendTransaction()을 이용하여 transactionPool에 트랜잭션을 대기상태로 두고
-   2. mineBlock()를 이용해서 블록을 생성하면 Pool에 있는 트랜잭션을 이용하여 블록을 생성한다.
-   3. 사용된 트랜잭션은 Pool에서 제거하고 사용된 UTXO도 Pool에서 제거하고 반환된 값이 있을 경우 UTXO Pool에 다시 추가한다.

현재 잠재적 문제로는 블록을 생성하기 전에 트랜잭션이 대기 상태일 때 잔액이 증감되지 않은 상태여서 이중지불 문제가 생길 수 있다.
이를 해결하기 위해서 많은 방법 중 lock기능을 추가해서 자금을 일시적으로 보류하도록 하여 이중지불을 막을 수 있다.
