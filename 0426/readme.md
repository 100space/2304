어제는 해시에 대해서 배웠고, 오늘은 블럭의 생성에 대해서 나갈 예정

hashToBinary 함수의 내용을 잘 읽을 줄 알아야한다.

# Block 생성

블록을 만든다는 것은 제네시스블록을 기준으로 2번째 블록을 만드는 과정이라고 할 수 있을 것이다.

-   블록(n번째)을 생성하기위해서는 이전의 블록의 정보(n-1번째)를 가지고 있어야 한다.
-   트랜잭션의 내용을 알고 있어야한다.
    -   블럭을 생성한다는 것은 머클루트가 이미 만들어진 상태이다
    -   생성을 위해서 생성 준비단계가 있는데, 몇개의 트랜잭션을 이용해서 만들지 정해지고, 이를 이용해서 머클루트를 만든 후 해시값을 제외한 모든 내용은 만들어져있어야한다.
    -   1. previous hash 값을 구해서 대입해놓는다.
    -   2. 트랜잭션을 이용한 머클루트 해시값을 얻는다
    -   3. 해시와, nonce값을 이용해서 문제를 풀면서 마이닝을 한다.

## 코드 작성

### 1. createBlockHash 함수 변경

머클루트는 data를 이용해서 얻는 값이기 때문에, BlockInfo로 내려준다.

```ts
//기존
export class BlockInfo {
    public version!: string
    public height!: Height
    public timestamp!: Timestamp
    public previousHash!: Hash
    public merkleRoot!: Hash
    public nonce!: number
    public difficulty!: Difficulty
}

export class BlockData extends BlockInfo {
    public data!: TransactionData
}

//변경

export class BlockInfo {
    public version!: string
    public height!: Height
    public timestamp!: Timestamp
    public previousHash!: Hash
    public nonce!: number
    public difficulty!: Difficulty
}

export class BlockData extends BlockInfo {
    public merkleRoot!: Hash
    public data!: TransactionData
}
```

```ts
//기존

 createBlockHash(data: BlockInfo): Hash {
     const value = Object.values(data).sort().join("")
        return this.SHA256(value)
    }
```

기존엔 BlockInfo 타입의 데이터를 인자값으로 받은 객체를 정렬해서 해시화하는 과정을 통해서 block의 hash를 구했지만
merkleRoot의 위치가 바뀌면서 merkleRoot가 BlockData 클래스로 바뀌었으므로 BlockData를 타입으로 사용하는 매개변수로 바꿔야한다.

```ts
//변경

    createBlockHash(data: BlockData): Hash {
        const { version, height, timestamp, merkleRoot, previousHash, difficulty, nonce } = data
        const value = `${version}${height}${timestamp}${merkleRoot}${previousHash}${difficulty}${nonce}`
        return this.SHA256(value)
    }
```

연산을 하는 작업을 줄여서 최적화를 하는 과정에서 data를 구조분해할당을 이용하여 나눠준 후
값들을 스트링타입으로 다 붙여서 나온 값을가지고 다시 해시화를 하여 BlockHash(현재블록)으로 사용한다.

### 2. 생성할 블록의 정보들(createBlockInfo)을 만들기

previousHash를 구하기 위해서 외부로 부터 값을 얻어야한다.
이전 블록에 대한 정보를 받아야하는 것이다.

생성할 블록의 정보들(createBlockInfo)을 만드는 방법

```ts
// 방법 1 : 객체 리터럴을 이용하는 방법
const blockInfo: BlockInfo = {
    version: VERSION, // 보통 환경설정으로 정해두고 가져다 쓰기 때문에 상수로 만든 값을 가져오는 코드로 작성했다.
    height: previousBlock.height + 1,
    timestamp: new Date().getTime(),
    previousHash: previousBlock.hash, // 이전블럭의 해시값 = 생성할 블럭의 previousHash
    nonce: 0,
    difficulty: 0,
}
```

```ts
//방법 2 : 객체 인스턴스화 및 할당
const blockInfo = new BlockInfo()
blockInfo.version = VERSION
blockInfo.height = previousBlock.height + 1
blockInfo.timestamp = new Date().getTime()
blockInfo.previousHash = previousBlock.hash
blockInfo.nonce = 0
blockInfo.difficulty = 0
```

나중에 시간이 지난 후에도 볼 수 있도록 가독성이 좋은 코드로 작성해야 한다.
두가지 방법 모두 사용가능한 방법이지만 방법 2를 이용하면 객체의 순서가 이미 정해진 상태로 불러오는 것이기 때문에
나중에 해시를 만드는 과정에서 해시값이 바뀔 가능성이 적다.

### 3. 제네시스가 아닌 현재블록의 생성 검증

```ts
describe("Block", () => {
    let block: Block
    let crypto: CryptoModule
    beforeEach(() => {
        crypto = new CryptoModule()
        block = new Block(crypto)
    })
    describe("createBlockInfo", () => {
        const previousBlock = GENESIS
        it("createBlockHash 메서드가 존재하는가", () => {
            expect(typeof block.createBlockInfo).toBe("function") //해시를 만드는 함수가 있는지 판단
        })
        it("createBlock BlockInfo가 잘 만들어지는가?", () => {
            const newBlock = block.createBlockInfo(previousBlock)
            expect(typeof newBlock).toBe("object") // 블록이 객체형태로 잘 나오는지 판단
        })
        it("createBlock에서 BlockInfo 내용이 올바른가?", () => {
            const newBlock = block.createBlockInfo(previousBlock)

            expect(newBlock.previousHash).toBe(previousBlock.hash) // '새로운 블록의 이전 블록해시'는 '이전블록의 현재해시'와 같은지 비교
            expect(newBlock.height).toBe(previousBlock.height + 1) // 현재 블록의 높이가 이전 블록의 높이보다 1 큰지 비교
        })
    })
})
```

이전 블록의 정보를 이용하여 새로 만든 블록의 정보를 검증하는 테스트 코드이다.

### 4. isValidBlock 함수

블록에 대한 검증은 모든 해시에 대한 검증을 한다는 것을 의미한다.
기본적으로 지금 생성하고 있는 블럭에 대한 데이터에서 hash를 이용하는 것은 '이전 해시', '현재 블록해시', '머클루트'이다.

다른 정보도 검증이 필요한 경우가 있지만, 보통의 경우 트랜잭션의 변조가 많고, 트랜잭션의 변조는 머클루트의 해시값 변조이다.
머클루트와 다른 정보들을 이용하여 블록해시를 설정하기 때문이 이 또한 바뀔 것이다.

데이터 조작이 되지 않았다면 모든 해시의 값이 일치할 것이기 때문에 변조를 추적하기 위해서 검증작업을 필수이다.

테스트 코드부터 작성하면 아래와 같다.
테스트 코드는 여러가지 상황을 isVailBlock()를 통해 검증하는 과정을 나타낸다.

```ts
//block.test.ts

describe("isValidBlock", () => {
    let previousBlock: IBlock

    beforeEach(() => {
        previousBlock = { ...GENESIS }
    })
    it("매개변수에 넘겨받은 블록해시값이 올바른가?", () => {
        expect(() => {
            block.isVaildBlock(previousBlock)
        }).not.toThrowError()
    })
    it("매개변수에 넘겨받은 블록해시값이 올바르지 않으면 에러를 발생하는가?", () => {
        previousBlock.hash = "00000"
        expect(() => {
            block.isVaildBlock(previousBlock)
        }).toThrowError() // 올바르게 들어가면 에러가 터지지 않아서 test 결과는 fail이 반환된다.
    })
    it("블록해시값이 올바르지 않다면 에러는 발생하는가?", () => {
        //마지막 숫자 0 지움
        previousBlock.hash = "84ffab55c48e36cc480e2fd4c4bb0dc5ee1bb2d41a4f2a78a1533a8bb7df837"
        expect(() => {
            block.isVaildBlock(previousBlock)
        }).toThrowError() // 변경된적이 없어서 같은 값이면 에러발생
    })
})
```

실제 구현 코드는 아래와 같다

```ts
 isVaildBlock(block: IBlock): void {
    this.crypto.isValidHash(block.hash)
    const validHash = this.crypto.createBlockHash(block)
    if (validHash !== block.hash)
        throw new Error(`블록 해시값이 올바르지 않습니다. hash : ${validHash},${block.hash}`)
}
```

isValidHash() 함수를 이용해서 hash의 패턴(16진수, 64자리 문자열)을 검증한다.
점증된 해시를 블록을 생성할 때 생성한다. 생성된 hash값과 block생성자 함수를 이용해 생성한 해시값을 비교한다.

### 5. merkleRoot 함수 수정

어제의 코드를 보면

```ts
merkleRoot(data: TransactionData) {
    if (data instanceof TransactionRow) {
        // data : transactionRow
    } else {
        //data:string
        return merkle("sha256").sync([data]).root()
    }
}
```

이렇게 제네시스 블록을 만들기 위해 string 타입에 대해서만 머클루트를 만드는 로직을 작성하였는데,
2번째부터 다른 블럭들을 data를 가지고 있기 때문에 수정해야 한다.

```ts
merkleRoot(data:TransactionData){
    if(typeof data === "string"){
        return merkle("sha256").sync([data]).root()
    }else if(Array.isArray(data)){
        // [{},{},{}....] -> 유효한 hash만 남긴다 [{},{},...] -> value로만 이루어진 배열로 만든다 ["","",...]
        const sync = data
            .filter((v: TransactionRow) => {
                if (!v.hash) return false
                else this.isValidHash(v.hash)
                return true
            })
            .map((v) => v.hash) as string[]
        return merkle("sha256").sync(sync).root()
    }
}
```

### 6. 블록의 구성요소 만들기

4번 과정을 완성하면 블록의 해시의 변조를 검증할 수 있다.
그래서 4번 과정을 이용해서 2번 과정에서 만들었던 정보들을 만들기 전에
검증하는 과정을 거치고 정보를 생성하게 되면 블록의 불변성을 유지할 수 있다.

```ts
// 2번과정을 정리해보면

createBlockInfo(previousBlock:IBlock):BlockInfo{
    this.inVaildBlock(previousBlock)

    const blockInfo = new BlockInfo()
    blockInfo.version = VERSION
    blockInfo.height = previousBlock.height + 1
    blockInfo.timestamp = new Date().getTime()
    blockInfo.previousHash = previousBlock.hash

    return blockInfo
}
```

이렇게 블록의 기본 정보를 생성하는 메서드를 완성시킬 수 있고, 이 createBlockInfo() 함수를 이용하여
블록의 data와 merkleRoot가 포함된 객체를 생성하는 메서드(createBlockData)를 만들 수 있다.

```ts
createBlockData(blockInfo : BlockInfo, data:TransactionData):BlockData{
    return {
        ...blockInfo
        merkleRoot:this.crypto.merkleRoot(data)
        data
    } as BlockData
}
```

createBlockData() 함수는 blockInfo와 트랜잭션으로 이루어져있는 data를 인자값으로 받는다.
위에서 createBlockInfo() 함수는 새로운 블록을 만들고 이 함수의 return이 blockInfo임을 이용하여 createBlockData()를 수정 할 수 있다.

```ts
createBlockData(previousBlock:IBlock, data:TransactionData) : BlockData{
    const blockInfo = this.createBlockInfo(previousBlock)
    return {
        ...blockInfo
        merkleRoot:this.crypto.merkleRoot(data)
        data
    } as BlockData
}
```

data는 TransactionData의 테이터 타입을 가지고 있는데, 이 데이터 타입을 살펴보면

```ts
export class TransactionRow {
    hash?: string
}
export type TransactionData = string | TransactionRow[]
```

위와 같다. string 타입과 TransactionRow[]타입을 가지고 있는데, 제네시스 블록에서 Data의 값은 텍스트로 지정해뒀기 때문에 string 타입이며,
제네시스 블록이 아닌 블럭들은 data에 트랜잭션들이 있고 한 개의 트랜잭션에는 해시값을 가지고 있는 상황으로 구성하였다. 그래서 제네시스 블록이 아닌 블록은 해시값을 포함하는 객체들을 배열 형태로 가지고 있다고 지정하였기 때문에 TransactionRow[] 라는 데이터 타입을 가지게 되었다.

# UTXO 모델의 기본적인 이해

Unspent Transaction Output의 약자로 아직 쓰지않은 잔액이라는 의미로 비트코인 기술의 기본개념이다.
비트코인 네트워크에서는 잔액이라는 개념이 없고 트랜잭션에 의한 결과물(UTXO)의 합을 잔액이라는 개념으로 사용한다.

UTXO는 쉽게 생각하면 비트코인이 적혀있는 종이라고 생각할 수 있다.

A,B,C 3명의 사람이 있을 때, A라는 사람과, B라는 사람이 C라는 사람에게 1BTC, 3BTC를 주었다고 했을 때, C에게는 지갑에 4BTC가 있지만 1BTC 를 담은 UTXO, 3BTC를 담은 UTXO 2 종류를 가지고 있는 것이다. 이때, A와 B가 각각 가지고 있었던 1BT, 3BTC를 담은 UTXO는 파기된다.

### 사진 1

이후 C가 다시 A에게 2BTC를 주게 된다면, C는 가지고 있던 1BTC와 3BTC중 3BTC를 사용하여 2BTC를 보낸 후 남은 1BTC를 새로운 UTXO로 다시 반환받는다. 그리고 기존의 사용한 3BTC UTXO는 파기가 된다.

### 사진 2

## UTXO 모델의 장점

### 1. 보안성

수신 주소와 관련된 개인 키의 소유자만 UTXO를 사용할 수 있도록 디지털 서명이 필요하다.

### 2. 투명성

UTXO 모델은 각 트랜잭션의 입출력을 공개된 블록체인에 기록하기 때문에 트랜잭션의 투명성을 가능하게 한다. 누구나 내역을 확인가능하고, 감시할 수 있다.

### 3. 프라이

## UTXO 모델의 단점
