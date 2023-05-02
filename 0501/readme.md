# 트랜잭션 만들기

## 예시

A와 B가 있을 때, A가 B에게 2BTC를 전송하는 과정에서 A가 A임을 증명하는(서명) 과정이 진행 된 후
A와 B의 거래가 이루어지는데, 이 때, 각자의 잔액에서 A는 -2BTC, B는 +2BTC를 하는 것이 아니다.
거래가 완료되기까지 여러 과정이 있는데, 그 순서는 아래와 같다.

-   1. A가 B에게 2BTC를 전송한다는 내용의 정보(영수증)를 노드에게 전달한다.
-   2. 노드는 그 영수증의 내용을 가지고 발신자에 대한 검증작업을 한다. 보내는 사람이 맞는지, A가 전송하기 위해서 충분한 양의 BTC를 가지고 있는지를 검증한다.
-   3. 검증이 완료되면 트랜잭션 생성이 된다.
    -   이 떄 트랜잭션이 생성이 되었다고 해서, 바로 거래가 성사되는 것이 아니다.
-   4. 생성된 트랜잭션은 TX pool이라는 공간에서 Block의 data로 포함되길 기다린다.
-   5. 마이닝 할 때의 구성요소 중 머클루트를 만드는 과정에서 데이터들(트랜젝션들)이 포함되면서 거래가 완료된다.
-   6. 이 시점에서 거래가 완료된다.

### 마이닝

생성된 트랜잭션들을 TX Pool에서 가져다가 블록을 생성하게 되는 과정을 채굴(마이닝)이라고 하고, 마이닝을 진행하는 마이너들에게는 보상의 개념으로 일정 비트코인 보상한다.

일반적인 트랜잭션으로 거래가 완료가 되면 누군가는 증가를하고, 누군가는 감소를 해서 거래되는 총량이 같지만, 코인베이스라 불리는 블록의 첫 번째 트랜잭션은 블록을 생성한 채굴자에게 블록에 포함된 모든 트랜잭션 수수료와 일정량의 새로 발행된 코인을 보상으로 지급한다.

## 일반적인 트랜잭션 객체

트랜잭션은 객체구조로 되어있는데, TxInput, TxOutput을 이용해서 표현할 수 있다.
정확한 표현은 아니지만 이해를 쉽게하기 위해서 Input,Output은 블록체인 네트워크를 기준으로 작성했다고 생각할 수 있다.

A라는 사람이 50BTC를 가지고있고, B라는 사람에게 20BTC를 전송하는 과정이라면

```sh
TX{
    TxInput {
        account : A
        amount : 50BTC
    },
    TxOutput [
        {
            account : A
            amount : 30BTC
        },
        {
            account : B
            amount : 20BTC
        }
    ],
    hash : 123123....
}
```

이렇게 표현할 수 있다.
50BTC를 전부 제출하고, 거래 후 잔액을 돌려받는 것이라고 생각할 수 있다.

## 코인베이스 트랜잭션 객체

기본적으로 트랜잭션 객체에는 Input, OutPut, hash가 포함되어 있는데
코인베이스의 경우
Input은 소비되는 코인이 없기 때문에 정당한 블록에서 보상이 생성되었음을 증명하기 위해서 임의 데이터나 블록의 높이를 작성한다.
Output은 보상을 받을 account와 보상의 내용을 포함하여 작성된다.

# Transaction 코드 작성하기

Transaction 관련 타입을 지정한다.

```ts
export const class TxIn {
    txOutId?:string
    txOutIndex!: number
    signature?: SignatureInput
}

export const class TxOut {
    account !: string
    amount !: number
}

export const class TransactionRow {
    txIns!:TxIn[]
    txOuts!:TxOut[]
    hash?:string
}
```

```ts
class Transaction {
    // 마이닝 성공시 보상 : 반감기에 대한 내용은 생략
    private readonly REWARD = 50
    constructor(private readonly crypto: CryptoModule) {}

    // TX Output을 만드는 메서드
    createTxOut(account: string, amount: number) {
        if (account.length !== 40) throw new Error("Account 형식이 올바르지 않습니다.")
        const txout = new TxOut()
        txout.account = account
        txout.amount = amount
        return txout
    }

    //TX Input을 만드는 메서드 : 코인베이스는 txOutIndex만 필요하기 때문에
    // '?' 를 이용해서 예외 조건을 만들어준다.
    createTxIn(txOutIndex: number, txOutId?: string, signature?: SignatureInput) {
        const txIn = new TxIn()
        txIn.txOutIndex = txOutIndex
        txIn.txOutId = txOutId
        txIn.signature = signature
        return txIn
    }

    //TX객체를 만드는 메서드
    createRow(txIns: TxIn[], txOuts: TxOut[]) {
        const transactionRow = new TransactionRow()
        transactionRow.txIns = txIns
        transactionRow.txOuts = txOuts
        transactionRow.hash = this.serializeRow(transactionRow)
        return transactionRow
    }

    //코인베이스 만들기
    createCoinbase(account: string, lastestBlockHeight: number) {
        const txin = this.createTxIn(lastestBlockHeight + 1)
        const txout = this.createTxOut(account, this.REWORD)
        return this.createRow([txin], [txout])
    }

    //TxIn 해시 :코인베이스를 구하는 상황에서는 txOutIndex만 있기 때문에 아래와 같이 구현되었다.
    serializeTxIn(txIn: TxIn) {
        const { txOutIndex } = txIn
        const text = [txOutIndex].join("")
        return this.crypto.SHA256(text)
    }
    //TxOut 해시
    serializeTxOut(txOut: TxOut) {
        const { account, amount } = txOut
        const text = [account, amount].join("")
        return this.crypto.SHA256(text)
    }

    //공통된 문자열 더하는 과정을 함수로 빼고, 타입을 제네릭으로 지정해서 상황에 따라 바뀔 수 있게 함.
    serializeTx<T>(data: T[], callback: (item: T) => string) {
        return data.reduce((acc: string, item: T) => {
            return acc + callback(item) // string + string
        }, "")
    }

    // Input, Output의 문자열을 더한 값을 해시화
    serializeTxRow(row: TransactionRow) {
        const { txIns, tsOuts } = row
        const text1 = this.serializeTx<TxOut>(txOuts, (item) => this.serializeTxOut(item))
        const text2 = this.serializeTx<TxIn>(txIns, (item) => this.serializeTxIn(item))
        return this.crypto.SHA256(text1 + text2)
    }
}

export default Transaction
```

## TxIns, TxOuts

TxIns와 TxOuts를 배열 형태로 받는 이유는 UTXO의 개념과 관련있다.
사용하지 않은 트랜잭션이 잔액의 형태로 한 객체에 포함되어 있는 것이 아닌 여러 화폐단위를 가지고 있듯 여러 객체를 가지고 있기 때문이다.
잔액이 150BTC라고 했을 때, 50/50/50BTC로 가지고 있을 수 있고, 70/80BTC로 가지고 있을 수 있다.

## transactionRow

transactionRow 객체는 txIn, txOut, hash로 이루어져있으며,
hash는 단순히 txIn+txOut의 해시값이라는 것 뿐만 아니라 해시값으로 관리하기 때문에 데이터의 변조에 대해서도 검증 할 수 있는 역할을 한다.

## 2번째 블록

GENESIS블록이 있는 상태에서 2번째 블록을 만들어 볼 예정이다.
2번째 블록은 tx로 Coinbase만을 담고 있으며, 이전블록은 제네시스블록을 이용한다.

```ts
//코인베이스
// const privateKey = digitalSignature.createPrivateKey()
const privateKey = "7252c2df08138d6baa44532ecccef306595c4e0fce99d37fd7a2f4df2cfe048b"
const publicKey = digitalSignature.createPublicKey(privateKey)
const account = digitalSignature.createAccount(publicKey)

// TX
const tx = transaction.createCoinbase(account, GENESIS.height)
const block2 = block.createBlock(GENESIS, [tx], GENESIS)
console.log(block2)
```
