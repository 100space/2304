# 트랜잭션

```ts
const block1 = block.createBlock(GENESIS, "123123", GENESIS)
```

블록을 생성할 때 data를 string으로 강제로 넣은 상태로 블록을 생성했었지만, 원래 data는 트렌잭션들로 이루어져 있다. 트랜잭션을 간단히 설명하자면 블록체인에서 데이터를 처리하고 저장하는 기본 단위이다.

트랜잭션은 크게 input, output, fees, change, locktime, 그리고 signatures로 구성되어 있다.
간략하게 표현하자면

Input에는 발신자의 UTXO, 발신자의 주소 담겨있고,

Output에는 수신자에게 전달될 암호화폐 양과 수신자의 주소가 적혀있다.

Fees는 수수료로 발신자가 채굴자에게 블록을 생성하는 댓가를 지불한다.

Change에는 input의 양이 output과 fees를 더한 값 보다 클 경우 발신자에게 반환될 양이 포함된다.

Locktime은 블록에 포함될 수 있는 시간 또는 블록의 높이를 지정할 수 있는 선택적 필드이다.
현재 생성될 블럭이 5번인데 7번에 생성되길 원할 경우, 해당 블록에 도달할 때까지 ,트랜잭션이 처리되지 않는다.

Signatures는 트랜잭션을 처리하기 위해서 가장 중요한 요소로 발신자의 소유권과 본인이 작성한게 맞다는 것을 증명할 수 있다.

## Signatures (서명)

온라인에서 나를 증명하는 대표적인 방법은 아이디와 패스워드를 이용하는 로그인이다. 로그인이 나를 증명할 수 있는 이유는 패스워드는 나만 알고 있는 정보이기 때문이다.

블록체인에서 나를 증명하는 대표적인 방법은 디지털 서명을 이용하는 것이다.
디지털 서명은 트랜잭션의 신뢰성과 무결성을 확인하는 수학적 알고리즘으로 트랜잭션의 중요한 구성 요소이다.

## 디지털 서명

암호화의 방식은 크게 대칭형, 비대칭형이 있다.

대칭 암호화는 동일한 대칭키 2개를 발신자와, 수신자가 각각 가지고 있으며, 평문을 대칭키를 이용해서 암호화를 한다면 수신자는 암호화 된 텍스트를 복호화해서 평문으로 되돌릴 때도 수신자가 가진 대칭키를 이용해서 복호화 한다.

비대칭 암호화는 서로 다른 키 2개를 발신자와 수신자가 각각 가지고 있다. 서로 다른 키는 각각 개인키, 공개키라고 하며, 개인키는 개인이 직접 보관하면서 공개되지 않도록 조심해야 한다. 공개키는 공개가 되도 괜찮은 키이다. 암호화 할 때는 비밀키를 이용하고, 복호화할 때는 공개키를 이용한다.
비밀키과 공개키는 쌍으로 이루어져 있어서 이를 키페어라고 한다.

단방향 암호화는 복호화에 초점을 두는 것이 아닌 데이터의 무결성을 검증하는 것에 초점을 둔 암호화 방식이다.
그래서 데이터를 단방향 암호화 방식으로 암호화를 한 경우 데이터를 복구할 수 없다.

일반적인 블록체인의 트랜잭션의 서명의 암호화 방식은 비대칭-단방향 암호화로 되어있고,
공개키와 개인키는 키페어이기 때문에 개인키를 이용해서 암호화를 하고 공개키를 이용해서 본인과 키페어인 개인키로 암호화 했던 데이터를 확인하고 증명을 할 수 있다.

## 공개키 생성방법

대부분의 블록체인 시스템에서 공개 키는 SECP256K1 암호화 알고리즘 같은 수학적 암호화 알고리즘을 이용하여 생성된다. 이 알고리즘은 타원 곡성 암호화를 사용하여 공개키가 개인키를 이용해서 생성되는 공개-개인 키쌍( 키페어 )를 생성한다.

## 블록체인에서의 서명

-   1. A는 B에게 1 BTC를 보내기를 원하므로 A는 B의 지갑 주소와 금액을 지정하여 트랜잭션을 생성한다.
-   2. A는 개인 키를 사용하여 거래에 서명하여 전송된 비트코인의 소유권을 증명한다.
-   3. A는 트랜잭션을 비트코인 ​​네트워크로 보내고 다른 노드는 이를 검증한다(예: A의 자금이 충분한지 확인)
    -   이 때 트랜잭션에 포함되어 있는 공개키를 이용하여 서명이 유효한지 검증 할 수 있다.
-   4. 검증되면 트랜잭션 풀이라는 공간에 트랜잭션이 저장되어 블록에 포함되기를 기다린다.
-   5. 채굴하는 동안 채굴자는 풀에서 트랜잭션을 선택하고 여러 트랜잭션을 사용하여 Merkle 루트를 만들고 새 블록 채굴을 시작한다.
-   6. 블록이 성공적으로 채굴되면 블록체인의 마지막 블록으로 추가된다.

# 디지털 서명 만들기

트랜잭션을 생성할 때 포함되는 디지털 서명키는 비대칭키 단방향 암호화 방식을 이용한 키를 이용하여 생성된다.

```ts
class DigitalSignature {
    private readonly ec = new elliptic.ec("secp256k1")
    constructor(private readonly crypto: CryptoModule) {}

    // 개인키 만들기
    createPrivateKey() {
        return randomBytes(32).toString("hex")
    }
    // 공개키 만들기
    createPublickKey(privateKey: string) {
        const keyPair = this.ec.keyFromPrivate(privateKey)
        const publicKey = keypair.getPublick().encode("hex", true)

        return publicKey
    }
    // 계정 만들기
    createAccount(publicKey: string) {
        const buffer = Buffer.from(publicKey)
        // publicKey가 33byte이기 때문에 13byte를 자르면 20byte가 된다.
        const account = buffer.slice(26).toString()

        return account
    }
    // 서명 만들기
    sign(privateKey: string, receipt: Receipt) {
        const keyPair = this.ec.keyFromPrivate(privateKey)
        const receiptHash = this.crypto.createReceiptHash(receipt)
        const signature = keyPair.sign(receiptHash, "hex").toDER("hex")
        receipt.signature = signature
        return receipt
    }
    //receipt 검증하기
    verity (receipt : Receipt):boolean{
        const{
            sendser:{publicKey}
            signature
        } = receipt

        if(!pulicKey || !signature) throw new Error("receipt 내용이 올바르지 않습니다.")
        const receiptHash = this.crypto.createReceiptHash(receipt)

        return this.ec.verity(receiptHash, signature, this.ec.keyFromPublic(publicKey, "hex"))
}
}
```

## 개인키 만들기

randomBytes() 함수는 암호학적으로 안전한 임의의 값을 생성하는 crypto 라이브러리에 정의된 메서드입니다.
매개변수로 생성할 바이트 문자열의 길이를 지정할 수 있으며, 생성된 바이트를 버퍼 개체에 반환합니다.
이 버퍼 값을 toString()을 이용해서 string 타입으로 바꾸는데 이때 hex값으로 인코딩을 한다.

## 공개키 만들기

publicKey를 만들기 위해서는 privateKey를 이용해서 만든다.
privateKey를 수학적 알고리즘을 이용해서 생성한다.(타원 곡선)
타원곡선 알고리즘을 이용해서 직접적으로 구현하는 것이 어렵기 때문에 elliptic 라이브러리를 이용해서 공개키를 만든다.

이렇게 생성된 공개키는 33byte 문자열로 되어있으며, 첫 번째 바이트는
공개키의 형식을 표기한다. 02인 경우, 공개키의 y좌표가 짝수이고, 03인 경우에는 y좌표가 홀수이다. 04의 경우에는 압축되지 않은 공개키를 의미한다.

타원곡선 이라는 수학적 알고리즘이 포함되어 있는 내용이라 자세히 설명하기 쉽지 않지만, 기본적인 개념은 알고리즘이 수학 함수를 사용하여 개인 키에서 공개 키를 생성한 다음 비트코인 ​​네트워크에서 암호화 작업에 사용할 수 있다

## 계정 만들기

계정이라는 것은 이더리움에서 주로 사용되는 용어로 암호화폐를 보유하고 네트워크와 상호 작용을 할 때 사용되며, 공개키를 이용해서 만드는 20byte의 문자열이다.
공개키의 해시값을 통해서 생성이 되는데, 암호화 알고리즘이 이후에 생성되기 때문에 중복이 되지 않는다. 마지막 20byte를 이용해서 생성되며 계정의 고유식별자 역할을 한다.

## 서명 만들기

서명을 만들기 위해서는 개인키와 데이터(평문)이 있어야한다.
데이터는 트랜잭션 정보들이다.

**receipt의 데이터 타입**
보내는 사람에 대한 데이터 타입과, 트랜잭션에 담길 정보의 타입을 지정한다.

```ts
class Sender {
    publicKey?: string
    account!: string
}
class Receipt {
    sender!: Sender
    receied!: string
    amount!: number
    signature?: SignatureInput
}
```

**reciept 해시화**
트랜잭션안에 요소들을 Hash화 하는 함수를 만들어준다.
객체로 만들어진 Receipt 클래스를 Hash화 하는 과정에서 순서에 따른 값이 바뀔 수 있기 때문에, 확실하게 순서를 고정해서 해시화 하는 작업이 필요하다.

```ts
//crypto.module.ts

createReceiptHash(receipt:Receipt){
    const {
        sender: { publiicKey },
        received,
        amount,
    } = receipt

    const message = [publicKey, received, amount].join("")
    return this.SHA(message)
}
```

receipt hash값과 private키를 이용해서 서명을 만들면 된다. - sign 함수

## receipt 검증하기

receipt(데이터)를 이용해서 sender 객체안의 publicKey와 signature의 값을 얻는다. 이 둘 중에 한개라도 없으면 에러를 발생한다.

receipt와 createReceiptHash 함수를 이용해서 해시값을 얻고 elliptic 라이브러리의 verity 메서드를 이용하여 검증한다.
verity 메서드는 총 3가지의 인자값을 갖는다.

-   'receiptHash' : receipt 데이터의 해시
-   'signature': 'receipt' 객체에서 추출한 디지털 서명
-   공개 키 객체 : 이를 이용해서 암호화 및 서명 검증과 같은 다양한 암호화 작업에 사용

타원 곡선 라이브러리를 이용하여 디지털 서명을 검증하고 'receipt' 객체를 검증한다.
