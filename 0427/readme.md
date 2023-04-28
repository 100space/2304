# 블록체인 일반적인 블록 만들기 (2) - 비트코인

어제 블록의 구성요소까지 만들어봤다.
블록체인에서의 2번부터 N번째 블록을 만드는 과정을 만들 것이다.

## createBlock()

createBlock()함수를 새로 만든다.

```ts
class Block {
    //이전 코드

    createBlock() {}
}
```

createBlock()함수는 3가지의 인자값이 필요하다.

-   1. 이전 블록 : 이전블록의 정보를 얻기위해서
-   2. data: 트랜잭션 및 머클루트 값을 구하기 위한 data
-   3. 난이도 조절을 위한 10번째 블록의 값

세번째 인자값인 adjustmentBlock은 난이도를 조정하는 역할을 위해서 기준이되는 난이도와, timestamp를 제공한다.

```ts
class Block {
    constructor(private readonly crypto: CryptoModue, private readonly workProof: WorkProof) {}

    //이전 코드

    createBlock(previousBlock: IBlock, data: TransactionData, adjustment: IBlock) {
        const blockData = this.createBlockData(previousBlock, data)
        const newBlock = this.workProof.run(blockData, adjustmentBlock)
        return newBlock
    }
}
```

블록을 생성하는 과정에서 작업증명을 우선적으로 해야한다.
작업증명을통해서 복잡한 문제를 풀고 이를 해결한 한명의 채굴자에게만 블록을 생성할 수 있고, 블록체인에 추가할 수 있다.

### difficulty (난이도)

블록체인에서 난이도는 새블록을 추가하는 데 필요한 계산수준을 나타낸다.
일반적인 블록체인 네트워크에서 블록이 일정한 속도로 블록체인에 추가되도록 새롭게 마이닝(채굴)되는 블록의 채굴 난이도를 주기적으로 조정한다.

## 전략 패턴을 이용한 합의 알고리즘 구현

블록을 생성하기 전에 작업증명 과정을 거치기 때문에
작업 증명 기능을 구현할 예정이다.

블록을 생성할 권한을 얻을 수 있는 방식을 대표적으로 POW(작업증명), POS(지분증명)로 나뉘기 때문에 블록을 생성하기 전에 POW 방식으로 진행 할 것인지 POS 방식으로 진행할 것인지 프로젝트나 서비스에 따라 달라질 수 있을 것이다. (불과 몇개월전에도 이더리움도 POW에서 POS로 바뀌었다.)

일반적으로 두가지 방식을 할 것을 생각하고 구현했을 때,
기능을 담당하는 하나의 클래스에서 조건문을 활용하여 분기처리를 했을 것이다.

```ts
class WorkProof {
    constructor(private readonly work: ProofOfWork) {}
    run(type: string) {
        if (type === "pow") {
            console.log("POW 로직")
        }
        if (type === "pos") {
            console.log("POS 로직")
        }
    }
}

const work = new ProofOfWork()
new WorkProof(work)
//또는
//const work = new ProofOfStake()
// new  WorkProof(work)
```

위의 예시코드 조건문을 통해서 분기처리를 한다고 해서 코드가 구현이 되지 않는 것은 아니지만, POS를 구현하는 과정이 힘들며, 의존성 주입으로 인해서 관련된 로직들의 에러가 발생할 수 있다.

그렇기 때문에, 처음에 서비스를 구현할 때, 확장성을 고려하여, 디자인패턴중 전략패턴을 이용한 방식으로 구현하게 되면, POW, POS를 담당하는 클래스가 독립적으로 존재하고, 각각의 내부에서 작동하는 코드는 관계가 없어지기 때문에 에러가 발생하는 상황을 막아줄 수 있다.

그래서 전략패턴을 이용한 방식으로 구현할 예정이다.

### POW, POS를 분기처리

```ts
class WorkProof {
    constructor(private readonly proof: Proof) {}
    run(blockData: BlockData, adjustmentBlock: IBlock): IBlock {
        const props: ProofProps = {
            blockData,
            adjustmentBlock,
        } as ProofProps
        return this.proof.execute(props)
    }
}
```

WorkProof class를 이용해서 두가지 상황에 대해서 분기처리를 할 수 있도록 구현하였다.
해당 클래스에 맞는 인터페이스를 설정하면 아래와 같다.

```ts
export interface ProofOfWorkProps {
    blockData: BlockData
    adjustmentBlock: IBlock
}
export interface ProofOfStakeProps {} // 아직 구현 전

export type ProofProps = ProofOfWorkProps | ProofOfStakeProps

export interface Proof {
    // execute()는 두가지 타입중 하나가 선택된다.
    execute(props: ProofProps): IBlock
}
```

execute() 함수의 인자값으로 props를 받을 떄 2가지 타입중 하나를 가지게 되면서 분기처리를 할 수 있도록 하였다.

```ts
// POW
class ProofOfWork implements Proof {
    execute(props: ProofOfWorkProps): IBlock {
        //POW 로직구현
        console.log("POW 실행")
        return {} as IBlock
    }
}

export default ProofOfWork

// POS
class ProofOfStake implements Proof {
    execute(props: ProofOfStakeProps): IBlock {
        //POS 로직구현
        console.log("POS 실행")
        return {} as IBlock
    }
}

export default ProofOfStake
```

ProofOfWork()와 ProofOfStake()함수는 Proof 타입으로 확장한 클래스로 execute()함수를 가지고 있고, 각각의 클래스에서 직접적으로 POW, POS의 로직이 구현된다.

### POW 로직구현

```ts
class ProofOfWork implements Proof {
    execute(props: ProofOfWorkProps): IBlock {
        //인자값으로 들어온 blockData와 adjustmentBlock을 구조분해할당을 이용하여 각각 할당한다.
        const { blockData, adjustmentBlock } = props

        return {} as IBlock
    }
}

export default ProofOfWork
```

인자값 2개를 props로 받았기 때문에 이를 구조분해할당을 이용해서 할당한다.

blockData는 이전 블록의 요소를 담고있으며 hash는 없다.
adjustmentBlock은 10번째 전의 블록을 뜻하고 블록의 구성을 다 갖췄기 때문에 hash까지 포함하는 IBlock 타입을 가진다.

POW의 로직을 구현할 떄 필요한 내용은 IBlock 타입과 같으며 순서대로 적어보면,

-   1. 생성할 블록의 nonce는 blockData.nonce + 1이다.
-   2. timestamp는 현재의 시간을 timestamp로 저장한다.
-   3. difficulty 구하기
-   4. 정보들을 이용하여 hash 만들기
-   5. 블록의 해시값을 binany 변환해서 difficulty 값이랑 비교한다.
    -   binany로 변환했을 때 0의 갯수가 difficulty와 같을 때까지 반복한다.
-   6. 만들어진 블럭을 return 값으로 반환한다.

난이도를 만들기 위한 로직을 구현할 때 조건이 있다.

1. 블록의 높이가 20일 때는 체크하지 않는다.
2. 블록의 높이가 10의 배수가 아닐 경우 가장 최근의 10의 배수 블럭 난이도로 설정한다.
    - height = 20~29 : 10번 블록난이도, 30~39: 20번 블록난이도
3. 모든 조건이 통과 되었을 때, 현재 블록생성시간-10번째 전 블록의 생성시간 = 총걸린시간

    생성시간이 빨랐다: 총걸린시간 < 목표시간 / 2 = 이전블록의 난이도 +1
    생성시간이 느렸다: 총걸린시간 > 목표시간 X 2 = 이전블록의 난이도 -1
    비슷하다면 이전블록의 난이도

4. difficulty가 - 값을 가지게 되면 0으로 바꾼다.

```ts
class ProofOfWork implements Proof {
    execute(props: ProofOfWorkProps): IBlock {
        //인자값으로 들어온 blockData와 adjustmentBlock을 구조분해할당을 이용하여 각각 할당한다.
        const { blockData, adjustmentBlock } = props
        let block: IBlock = { ...blockData, hash: "" }

        do {
            block.nonce += 1
            block.timestamp = new Date().getTime()
            block.difficulty = this.getDifficulty(this.getDifficultyProps(block, adjustmentBlock))
            block.hash = this.crypto.createBlockHash(block)
        } while (!this.crypto.hashToBinary(block.hash).startsWith("0".repeat(block.difficulty)))
        return block as IBlock
    }

    //난이도를 구하는 함수를 작성한다, 난이도를 구할 때 매개변수가 4개여서 가독성에 좋지않기 때문에 매개변수를 return 해주는 함수도 구현한다.

    getDifficultyProps(block: IBlock, adjustmentBlock: IBlock): DifficultyProps {
        const { height, timestamp: currentTime } = block
        const { difficulty, timestamp: adjTime } = adjustmentBlock
        return {
            height,
            currentTime,
            adjTime,
            difficulty,
        }
    }

    getDifficulty(props: DifficultyProps): number {
        const { height, currentTime, adjTime, difficulty } = props
        const timeTaken = currentTime - adjTime //총 걸린시간(timestamp) : 현재시간 - 10번째 전 블록생성시간
        const timeExpected = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL

        //조건 1번
        if (height < 0) throw new Error("높이가 0미만입니다.")
        if (height < 10) return 0
        if (height < 21) return 1
        //조건 2번
        if (height % DIFFICULTY_ADJUSTMENT_INTERVAL !== 0) return difficulty
        //조건 3번
        if (timeTaken < timeExpected / 2) return difficulty + 1
        if (timeTaken > timeExpected * 2) return difficulty - 1
        //조건 4번
        if (difficulty < 0) return 0
        return difficulty
    }
}
export default ProofOfWork
```

```ts
// 해시를 바이너리로 바꾸는 hashToBinary() 를 crypto에서 구현해야 한다.
class CryptoModule {
    hashToBinary(hash: Hash): string {
        let binary = ""
        for (let i = 0; i < hash.length; i += 2) {
            const hexByte = hash.substr(i, 2)
            const decimal = parseInt(hexByte, 16)
            const binaryByte = decimal.toString(2).padStart(8, "0")
            binary += binaryByte
        }
        return binary
    }
}
```

16진수를 바이너리로 표현하면 4글자로 이루어져있다.그래서 16진수는 1글자에 4bit이다. 1byte가 8bit이기 때문에, 16진수를 2글자씩 자르면 1byte의 8글자로 출력이 된다.
ex) xxxx xxxx
16진수 바이트 값을 2진수 바이트 값으로 변환하고 2진수 값이 8비트 길이가 되도록 빈 자리에는 0을 추가한다.

## 1~100번까지의 블록을 배열에 담기

```ts
const crypto = new CryptoModule()
const proofofwork = new ProofOfWork(crypto)
const workProof = new WorkProof(proofofwork)
const block = new Block(crypto, workProof)

let blockArr = [GENESIS] // 배열의 첫 블럭은 제네시스 블럭이다.
let Nblock: IBlock
let previousBlock = GENESIS
let adjustmentBlock = GENESIS

for (let i = 1; i < 100; i++) {
    previousBlock = blockArr[i - 1]
    if (i > 19) adjustmentBlock = blockArr[Math.floor(i / 10 - 1) * 10]
    Nblock = block.createBlock(previousBlock, "123123124124", adjustmentBlock)
    blockArr.push(Nblock)
}
console.log(blockArr) // 100개의 블럭이 생성되었다.
```

# 합의 알고리즘

다수의 참여자들이 하나의 통일된 의사결정을 하기 위해 사용하는 알고리즘이고, 합의 알고리즘에 의해 동일하게 유지되는 것을 말한다. 블록체인 네트워크를 구성하는 각 노드가 각각 장부를 가지고 있고 이 장부 내용은 합의 알고리즘에 의해서 동일하게 유지된다.

POW, POS, POA 등이 있으며, POW는 작업증명, POS는 지분증명, POA는 권한증명이라고 한다.

### 작업증명이란 ?

POW라고도 하며, Proof of Work의 약자이다.
연산을 누가 더 빨리하는지를 판단하면서, 경쟁하는 과정이 있고, 이 과정에서 가장 빨리 연산을 처리하는 사람만 채굴 및 블록을 생성할 수 있다.
에너지 효율이 안좋다는 점이 단점이다. 동시에 채굴을 한 채굴자들 중 1명이 채굴에 성공하게 되면 성공한 채굴자를 제외한 나머지는 기존의 작업을 다 버리게 되기 때문이다.

### 지분증명이란 ?

POS라고도 하며, Proof of Stake의 약자이다.
지분을 많이 가지고 있는 노드에게 블록을 생성할 권한을 부여한다. 많은 지분을 가지고 있을수록 많은 블록을 기록할 권한이 생긴다.
이로 인해 빈부격차가 커질 수 있다. 에너지 효율이 좋고, 노드가 암호화폐를 장기간 보유하도록 유도하게 되어, 네트워크 안정성과 보안을 향상 시킬 수 있다. 하지만 많은 지분을 가진 다수의 노드가 조작을 할 수 있기 때문에 공격에 취약할 수 있다.

### 권한증명이란 ?

POA라고도 하며, Proof of Authority의 약자이다.
일부에게만 블록을 생성할 수 있는 권한이 생긴다. Private 블록체인 네트워크에서 사용된다.
private이기 때문에 노드로 아무나 참여할 수 없으며 대표적인 사례가 COOV이다. 블록체인 기술을 이용한 백신 접종 증명서의 역할을 했던 COOV도 private 네트워크였다.
권한이 있는 노드만 블록을 생성하고, 네트워크를 구축하기 때문에, 트랜잭션 속도는 빠르지만, 노드의 갯수가 적기 때문에 보안성에는 취약하다.

# class 설계 - UML

ERD처럼 class도 설계를 할 때 UML 모델링 작업을 한다.

UML은 소프트웨어 설계 및 개발에 사용되는 표준화된 표기법 및 시각적 언어인 'Unified Modeling Language'의 약자이다.

UML 다이어그램은 종종 소프트웨어 개발자가 복잡한 시스템 설계를 시각화하고 전달하는 데 도움을 주기 위해 사용하며, 여러 팀원이 동일한 코드를 이해하고 작업해야 하는 공동 개발 프로젝트에 특히 유용하다.

클래스 다이어그램, 개체다이어그램, 시퀀스다이어그램 등 여러 시점에 따라서 다른 다이어그램으로 표현 할 수 있다.

보통 설계 단계에서 작성하게 되며, 클래스 다이어그램의 경우 구현 해야할 메서드나, 맴버변수에 대해서 표현되어 있다.

코드로 봤을 때, 여러 클래스가 있는 경우 클래스간의 관계를 쉽게 알 수 없지만, 클래스 다이어그램을 이용하면 쉽게 확인할 수 있고, 이를 이용해서 코드를 읽어나갈 수 있다는 장점이 있다.

최근에 작성했던 '블록체인의 블록 만들기' 코드에 대한 UML 다이어그램을 그려보면 아래의 사진과 같다. ( crypto 클래스가 누락되었음...)

맨 처음 프로젝트의 코드만 봤을 땐 이해하기 어려웠던 것들도, 한 눈에 확인할 수 있기 때문에 큰 장점으로 와닿았다.
