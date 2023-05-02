# 트랜잭션 만들기 (2)

## 3번째 블록만들기

블록을 생성하기 위해서 아래와 같은 내용이 필요하다.

-   이전 블록에 대한 내용을 알아야하고 : 높이가 2인 블록
-   10번째 블록에 대한 내용을 알아야한다. : 제네시스블록

블록이 생성되는 시간의 텀은 10분정도가 있다.
그 10분간 일어나는 일중에 하나가 여러 거래이다.
그래서 TX Pool이라는 공간에 처리되지 않은 거래들이 담겨있다.

블록을 생성할 떄, 머클루트라는 것이 있기 때문에 블록을 생성하겠다라는 의미는 기존에 있던 트랜잭션을 이용해서 만든다.
예를들어, 2번블록이 9시 10분에 생성이 됐고 3번블록이 9시 20분에 생성이 된다했을 떄,
3번 블록에 포함되는 트랜잭션은 2번블록이 생성되는 시기, 즉 9시~9시10분에 만들어진 트랜잭션들을 포함할 수 있다.

트랜잭션이 만들어지기 위해서 필요한 내용은 트랜잭션의 영수증이다.
영수증을 이용해서 트랜잭션을 만들 수 있다.

## 총 발행량

제네시스 블록, 블록2, 블록 3

block2의 트랜잭션 : coinbase
block3의 트랜잭션 : coinbase, transaction 1건에 대한 블록

coinbase의 내용은 채굴하면 보상으로 50을 준다.
A가 채굴을 해서 보상을 받는 내용이고,
transaction의 내용은 A(채굴자)가 B에게 30을 준다는 내용의 트랜잭션이다.

총 3개를 만들면서 sender와, received의 잔액은
70, 30이 되었다.

채굴을 하면서 블록이 생성될 때 보상이 주어지기 때문에, 블록 2,3번에 대한 보상이 주어졌다. 그래서 코인의 총 통화량이 100개이며, 그 중에 30을 received에 보내주었기 때문에, 70,30 으로 잔액이 남는다.
블록이 생성된다는 것은 마이닝을 했다는 것이고, 마이닝을 하면서 보상이 생긴다는 점을 인지해야 한다.

## 트랜잭션 최적화

기존의 코드를 이용하면 직관적이지 않고, 트랜잭션을 만드는 것도 메서드를 하나하나 찾아서 작성해야하는 불편함이 있다.

그래서 receipt 객체가 하나 주어지면 이를 이용해서 트랜잭션을 만들 수 있도록 함수로 따로 관리하는 것이 좋다.

```ts
// index.ts
// TxIn
const txin1 = transaction.createTxIn(1, "", receipt.signature)
// TxOut
// 총수량 - amount
const txout_sender = transaction.createTxOut(receipt.sender.account, 50 - receipt.amount)
const txout_received = transaction.createTxOut(receipt.received, receipt.amount)

const tx1 = transaction.createRow([txin1], [txout_sender, txout_received])
```

이렇게 작성되었던 코드를 아래와 같이 따로 함수로 뺄 수 있다.
tranasaction.ts에서 작성되기 때문에 trasaction.~~~는
this.~~로 바뀐다.

```ts
// transaction.ts
create(receipt: Receipt) {
    const totalAmount = 50
    // TxIn
    const txin1 = this.createTxIn(1, "", receipt.signature)
    // TxOut
    // 총수량 - amount
    const txout_sender = this.createTxOut(receipt.sender.account, 50 - receipt.amount)
    const txout_received = this.createTxOut(receipt.received, receipt.amount)
    return this.createRow([txin1], [txout_sender, txout_received])
}

//index.ts
const tx2 = transaction.create(receipt)

```

index에서 간편하게 쓰기 위해서 tx1을 만드는 메서드들을 transaction.ts에서 함수를 이용해서 작성하고 index.ts에서 조금더 쉽게 tx를 생성할 수 있다.

# 미사용 트랜잭션 출력값(UnspentTxOuts)

```ts
create(receipt: Receipt) {
    const totalAmount = 50
    const txin1 = this.createTxIn(1, "", receipt.signature)
}
```

위의 creat() 함수에서 잔액을 하드코딩으로 작성하였다.
하지만 이 부분을 따로 구현할 수 있다. 나의 잔액을 구하는 로직이 있어야 하는데, UTXO를 만드는 것이다.

미사용 트랜잭션 (UTXO)를 구하기 위해서는 입금을 받은 내용들인 Output의 객체들 중에서 Input으로 사용되지 않은 객체들을 제외하게 되면 최종적으로 남는 객체들이 Input에서 사용하지 않은 객체들이고 이 객체들을 UTXO라고 부른다.
기존에 UTXO로 있었던 객체가 다음 트랜잭션에서 사용하게 되면 그 객체는 미사용 트랜잭션이 아니므로 UTXO Pool에서 제외된다.

#### 사진....

각 트랜잭션이 일어나고 난 뒤에 사용하지 않은 객체를 단계별로 표현하게 되면 위의 그림과 같다.

이 트랜잭션 및 UTXO에서 중요한 것은 C의 UTXO이다.
C에서 D에게 15를 전송하는 #tx5를 생성할 때, Input에는 C와 관련된 2개의 UTXO를 작성하게 된다.
그리고, 2개의 UTXO가 모두 사용되면서 UTXO Pool에서는 C관련 객체가 제거되고 D에게 15를 주고, 5를 반환받는 과정으로 Output이 작성되게 된다.

## UTXO 파악하기

사용한 객체와 사용하지 않은 객체를 파악하는 방법은
UTXO들을 UTXO Pool 공간에 따로 배열로 모아서 관리하고, UTXO가 Input에 사용되는 순간 UTXO Pool에서 제거하여 관리할 수 있다.

이 UTXO Pool을 이용해서 UTXO를 관리하게 되면 트랜잭션에 Input에 포함된 객체 검증 및 계정에 대한 잔액을 관리하기 쉽다.

transactionRow에 hash값이 있는데, 이 hash는 트랜잭션의 고유 식별자이다.
hash를 이용해서 UTXO가 트랜잭션의 Input에 사용되었는지 확인할 수 있다.

```ts
// interface.ts
export class TransactionRow {
    txIns!: TxIn[]
    txOuts!: TxOut[]
    hash?: string
}
```

UTXO Pool에는 똑같은 형태로 미사용객체들이 구현되기 때문에 UTXO 인터페이스가 필요하고 이를 배열로 만들어서 관리한다.

```ts
export class UnspentTxOut {
    txOutId!: string
    txOutIndex!: number
    account!: string
    amount!: number
}

export type UnspentTxOutPool = UnspentTxOut[]
export type TransactionPool = TransactionRow[]
```

미사용 객체들을 모아둔 곳을 UnspentTxOutPool, 트랜잭션들을 모아두는 곳을 TransactionPool로 작성한다.

UnspentTxOutPool,UnspentTxOut[] 두개의 데이터 형태는 같지만
UnspentTxOutPool은 완성된 실제로 사용할 UTXO객체라고 생각하면 된다.
