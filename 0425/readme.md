# 블록체인 제네시스 블록 만들기 - Hash

블록은 블록체인을 구성하는 요소 중 가장 기본 단위이다. 블록 1개를 생성할 때 이전 블록의 해시 값을 참조하여 생성하기 때문에 체인처럼 엮여 있는 구조이므로 블록체인이라고 할 수 있다.

하지만 블록체인 중 제일 처음인 블록은 이전 블록이 없기 때문에 참조할 수 없다. 이 첫 번째 블록을 제네시스 블록이라고 한다. 블록체인의 네트워크를 구성하기 위해서 가장 중요한 블록이다.

이 제네시스 블록의 구성에 대해서 알아볼 예정이다.

## 1. 블록의 기본요소를 구성하는 요소의 데이터 타입

기본적으로 필요한 데이터는 version, height(블록의 id를 의미한다.), timestamp, previousHash(이전 블록 해시값), merkleRoot, nonce, difficulty로 구성되어 있다.

그리고, data가 필요한데, data는 블록에 들어가는 트랜잭션들을 의미한다.
하지만 제네시스 블록은 기본적으로 임의의 값을 이용해서 data를 구성하고 이를 해시화 해서 블록을 만드는데 이용하였다.

블록을 구성하는 기본요소 몇가지를 아래와 같이 표현할 수 있다.

```ts
// src/types/block.d.ts
export type Height = number
export type Timestamp = number
export type Difficulty = number
export type Hash = string

// src/core/transaction/transaction.interface.ts
export class TransactionRow {}
export type TransactionData = string | TransactionRow

// src/core/block/block.interface.ts
class BlockInfo {
    version!: string
    height!: Height
    timestamp!: Timestamp
    previousHash!: Hash
    merkleRoot!: Hash
    nonce!: number
    difficulty!: Difficulty
}

class BlockData extends BlockInfo {
    data!: TransactionData
}
export class IBlock extends BlockData {
    hash!: Hash
}
```

BlockInfo의 기본 요소와 transaction들(data)로 이루어진 포함한 IBlock을 만든다.

### 1-1. interface와 class의 차이점

인터페이스의 경우는 구현하는데 세부정보를 제공하지 않기 때문에 인스턴스화 할 수 없다(구현체가 아니다) 그래서 'instanceof' 연산자를 사용할 수 없다. 하지만 class로 구현된 경우, 인스턴스 생성을 할 수 있고, instanceof를 이용하면 어떤 클래스의 인스턴스인지 확인할 수 있다.

### 1-2. TransactionData

비트코인 블록체인에서 각 블록에는 BlockInfo에 대한 내용뿐만 아니라 트랜잭션 기록이 포함됩니다. 그러나 제네시스 블록은 트랜잭션 기록이 없는 블록체인의 첫 번째 블록이므로 string 타입을 이용해서 데이터 타입을 지정하였다.

### 1-3. 생성된 블록의 해시값 구하기

BlockInfo 요소와 data를 포함한 class BlockData는 블록을 구성하는 기본요소들이고, 이를 이용해서 블록의 해시 값을 구할 수 있다.
이 해시 값과 BlockData를 포함하여 블록의 요소가 구성되기 때문에 이를 블록의 기본 데이터 타입 IBlock으로 만들었다.

## 2. Genesis 블록 만들기

```ts
const GENESIS: IBlock = {
    version: "1.0.0",
    height: 1,
    timestamp: 1231006506, // 비트코인의 제네시스 블록의 타임스템프
    nonce: 0,
    difficulty: 0,
    hash: "0".repeat(64), //버전, 머클루트, 이전 블록 해시값 등등 여러 속성을 이용해서 만든 해시값
    merkleRoot: "0".repeat(64),
    previousHash: "0".repeat(64), // 64개의 0으로 이루어진 문자열
    data: "2009년 1월 3일 더 타임스, 은행들의 두번째 구제금융을 앞두고 있는 U.K 재무장관", // 비트코인의 제네시스 블록의 데이터
}
```

비트코인 제네시스 블록을 만들기 전, 기본 구성을 적성했다.

### 2-1. previousHash

제네시스 블록의 이전 블록이 없기 때문에 null 해시 또는 0 해시 라고하는 고유값을 이용해서 작성한다.
hash의 기본구조인 16진수, 64글자의 데이터를 맞춰서 0을 64개 작성하는 코드로 기본 데이터를 입력해줬다.

merkleRoot와 hash 속성도 일단은 기본 데이터타입을 지켜주기 위해서 "0".repeat(64)를 통해서 형태만 맞춰 두었다.

### 2-2. genesis.test.ts

```ts
describe("제네시스 블럭", () => {
    it("제네시스 블럭 형태가 올바른가?", () => {
        expect(GENESIS.version).toBe("1.0.0")
        expect(GENESIS.height).toBe(1)
        expect(GENESIS.timestamp).toBe(1231006506)
        expect(GENESIS.nonce).toBe(0)
        expect(GENESIS.difficulty).toBe(0)
        expect(GENESIS.hash).toBe("0".repeat(64))
        expect(GENESIS.merkleRoot).toBe("0".repeat(64))
        expect(GENESIS.previousHash).toBe("0".repeat(64))
        expect(GENESIS.data).toBe("2009년 1월 3일 더 타임스, 은행들의 두번째 구제금융을 앞두고 있는 U.K 재무장관")
    })
})
```

jest를 이용하여 Genesis 클래스의 속성 값에 대한 테스트 코드를 작성했다.

## 3. hash를 만드는 과정 - TDD

블록체인의 데이터에 hash를 이용한 값들이 많다. 해시값을 만들기 위해서 라이브러리를 이용할 수 있다.
라이브러리의 타입을 정의해 놓은 패키지도 같이 설치해야 한다.

```sh
$ npm install crypto-js
$ nam install @types/crypto-js
```

테스트 주도 개발을 위해 테스트코드를 작성하면서 진행할 예정이다.
기본적으로 CryptoModule class를 생성한 후 진행한다.

```ts
class CryptoModule {}
```

### 3-1. SHA256함수를 이용해서 평문을 해시화하기

제네시스 블록안에 포함되어 있는 스트링타입의 data의 해시값을 구하기 위해서 data를 가지고 해시화하는 SHA256함수를 만든다.

TDD 방식을 위해서 'crypto.test.ts' 파일에 실패하는 코드를 작성하고 성공으로 바꾸면서 진행한다.
성공하는 함수는 'crypto.module.ts'에 작성하여 실제 구현에 사용할 수 있도록 한다.

#### crypto 1.png

#### crypto 1-1.png

SHA256함수가 없기 때문에 에러가 발생한다.

CryptoModule 안에 함수를 만들어 에러를 해결한다.
해시의 가장 큰 특징이 글자의 길이가 64글자로 이루어져 있는 문자열이기 때문에 이를 이용해서 판단하는 테스트 코드를 작성할 수 있다.

```ts
//crypto.test.ts
import CryptoModule from "@core/crypto/crypto.module"

describe("CrytoModule", () => {
    let cryptoModule: CryptoModule
    beforeEach(() => {
        cryptoModule = new CryptoModule()
    })
    describe("SHA256", () => {
        it("SHA256함수를 이용해서 평문을 해시화 하기", () => {
            const data = "123123"
            const result = cryptoModule.SHA256(data)
            expect(result).toHaveLength(64)
        })
    })
})
```

```ts
// crypto.module.ts
import { Hash } from "types/block"
import cryptojs from "crypto-js"

class CryptoModule {
    // Hash 데이터 타입은 위에서 정의한 내용이기 때문에 불러와서 지정해준다.
    SHA256(data: string): Hash {
        const hash = cryptojs.SHA256(data).toString()
        return hash
    }
}
export default CryptoModule
```

### 3-2. data값을 이용하여 merkleRoot 해시 값 구하기

merkleRoot는 data의 해시값을 이용하여 새로운 해시값을 구한다.
일반적인 블록에서 data는 여러 트랜잭션을 모아놓은 것이다.
트랜잭션을 2개씩 짝지어 토너먼트식으로 계산하고, 마지막에 남은 1개의 해시값이 머클루트의 값이 되는 것이다.

merkleroot를 구하는 방법을 하나하나 할 수 있지만 구현 되어 있는 라이브러리가 있다.

```sh
$ npm install merkle
$ npm install @types/merkle
```

이를 구하는 예시코드를 테스트 코드부터 작성을 하면

```ts
import { GENESIS } from "@constasnts/block.constants"
import CryptoModule from "@core/crypto/crypto.module"

describe("CrytoModule", () => {
    let cryptoModule: CryptoModule
    beforeEach(() => {
        cryptoModule = new CryptoModule()
    })
    describe("SHA256", () => {
        it("SHA256함수를 이용해서 평문을 해시화 하기", () => {
            const data = "123123"
            const result = cryptoModule.SHA256(data)
            expect(result).toHaveLength(64)
        })
    })
    describe("merkleRoot", () => {
        it("Genesis block의 data를 이용하여 merkleRoot 값 구하기", () => {
            const merkleroot = cryptoModule.merkleRoot(GENESIS.data)
            expect(merkleroot).toHaveLength(64)
        })
    })
})
```

merkleRoot()함수를 만들고 인자 값으로 Genesis 블록의 data 값을 넣어준다. 2번 과정에서 생성했던 Genesis블록의 data이기 때문에 불러와서 작성을 한다.

이렇게 테스트 코드를 작성하면 merkleRoot에 대한 오류가 발생한다.
crypto.module.ts로 이동하여 merkleRoot()를 만들고 완성하여 준다.

```ts
//crypto.module.ts

import { Hash } from "types/block"
import cryptojs from "crypto-js"
import { TransactionData, TransactionRow } from "@core/transaction/transaction.interface"
import merkle from "merkle"

class CryptoModule {
    SHA256(data: string): Hash {
        const hash = cryptojs.SHA256(data).toString()
        return hash
    }

    merkleRoot(data: TransactionData) {
        if (data instanceof TransactionRow) {
            //data:TransactionRow
        } else {
            //data:string
            return merkle("sha256").sync([data]).root()
        }
    }
}

export default CryptoModule
```

여기서 지금은 제네시스 블록의 속성들을 구현하고 있기 때문에, data값이 string타입으로 지정되어서 그 data를 가지고 해시를 진행하지만,
일반적인 블록에 대해서는 data가 트랜잭션의 모음이기 때문에 조건문을 이용하여 data의 데이터 타입 및 구조에 따른 서로 다른 로직을 구현한다.

merkle라이브러리에서 merkle 함수를 이용하여 merkleTree를 구하고 그중 최상위인 merkle root도 구할 수 있다.

이 구해진 merkleRoot는 이 블록의 머클루트이므로 Genesis 객체에 임의로 넣었던 0해시 값과 바꿔준다.

```ts
const GENESIS: IBlock = {
    version: "1.0.0",
    height: 1,
    timestamp: 1231006506,
    nonce: 0,
    difficulty: 0,
    hash: "0".repeat(64),
    merkleRoot: "DC24B19FB7508611ACD8AD17F401753670CFD8DD1BEBEF9C875125E98D82E3D8", // merkleRoot 값 추가
    previousHash: "0".repeat(64),
    data: "2009년 1월 3일 더 타임스, 은행들의 두번째 구제금융을 앞두고 있는 U.K 재무장관",
}
```

### 3-3. BlockInfo를 이용하여 blockHash 구하기

블록해시를 구하기 위해서는 블록의 헤더 정보를 가지고 구한다.
헤더 정보는 위의 GENESIS 객체를 가지고 알 수 있다.

블록해시를 구할 때, 중요한 점이 이 정보는 객체로 이루어져 있다는 점이다. 일반적으로 코드의 작동에 있어서 객체의 순서는 문제 없지만, 해시의 결과 값에는 영향을 크게 미치기 때문에 일관된 해시 값을 얻기 위해서 어떠한 기준을 정해서 정렬을 진행하고 해싱을 한다.

먼저 createblockHash라는 테스트를 작성한다.

```ts
//crypto.test.ts

import { GENESIS } from "@constasnts/block.constants"
import { BlockInfo } from "@core/block/block.interface"
import CryptoModule from "@core/crypto/crypto.module"

describe("CrytoModule", () => {
    let cryptoModule: CryptoModule
    beforeEach(() => {
        cryptoModule = new CryptoModule()
    })
    describe("SHA256", () => {
        it("SHA256함수를 이용해서 평문을 해시화 하기", () => {
            const data = "123123"
            const result = cryptoModule.SHA256(data)
            expect(result).toHaveLength(64)
        })
    })
    describe("merkleRoot", () => {
        it("Genesis block의 data를 이용하여 merkleRoot 값 구하기", () => {
            const merkleroot = cryptoModule.merkleRoot(GENESIS.data)
            expect(merkleroot).toHaveLength(64)
        })
    })
    describe("createBlockHash", () => {
        it("BlockInfo를 이용한 blockHash 값 구하기", () => {
            const blockInfo: BlockInfo = {
                version: GENESIS.version,
                height: GENESIS.height,
                timestamp: GENESIS.timestamp,
                previousHash: GENESIS.previousHash,
                merkleRoot: GENESIS.merkleRoot,
                nonce: GENESIS.nonce,
                difficulty: GENESIS.difficulty,
            }
            const hash = cryptoModule.createBlockHash(blockInfo)
            expect(hash).toHaveLength(64)
        })
    })
})
```

역시 해시 값을 판단하기 위해서 length를 이용한다.

테스트코드의 에러를 해결하면서 실행 코드를 작성한다.

```ts
import { Hash } from "types/block"
import cryptojs from "crypto-js"
import { TransactionData, TransactionRow } from "@core/transaction/transaction.interface"
import merkle from "merkle"
import { BlockInfo } from "@core/block/block.interface"

class CryptoModule {
    SHA256(data: string): Hash {
        const hash = cryptojs.SHA256(data).toString()
        return hash
    }

    merkleRoot(data: TransactionData) {
        if (data instanceof TransactionRow) {
            //data:TransactionRow
        } else {
            //data:string
            return merkle("sha256").sync([data]).root()
        }
    }
    createBlockHash(data: BlockInfo): Hash {
        const value = Object.values(data).sort().join("")
        return this.SHA256(value)
    }
}
export default CryptoModule
```

createBlockHash() 함수를 이용해서 블록의 정보를 가지고 해시를 진행하여 '블록해시'를 구하였다.

이렇게 구한 블록해시 값도 GENESIS 객체에 적어준다.

```ts
const GENESIS: IBlock = {
    version: "1.0.0",
    height: 1,
    timestamp: 1231006506,
    nonce: 0,
    difficulty: 0,
    hash: "63f276c89f94976122ea51f5826d8d45e336e332bd5259f6deedbc2c01be62a8", // blockHash 값 추가
    merkleRoot: "DC24B19FB7508611ACD8AD17F401753670CFD8DD1BEBEF9C875125E98D82E3D8",
    previousHash: "0".repeat(64),
    data: "2009년 1월 3일 더 타임스, 은행들의 두번째 구제금융을 앞두고 있는 U.K 재무장관",
}
```

### 3-4. 구한 Hash 값 검증하기

Hash 값을 검증하는 함수를 만든다.
이 함수는 hash의 값을 정규식을 이용해서 판단하고, false인 경우 'throw new Error'를 이용해서 에러를 발생하는 함수이다.

먼저 테스트 코드부터 작성을 한다.

```ts
import { GENESIS } from "@constasnts/block.constants"
import { BlockInfo } from "@core/block/block.interface"
import CryptoModule from "@core/crypto/crypto.module"

describe("CrytoModule", () => {
    let cryptoModule: CryptoModule
    beforeEach(() => {
        cryptoModule = new CryptoModule()
    })

    // 기존 코드...

    describe("isValidHash", () => {
        it("hash length가 64 미만인 경우", () => {
            const hash = "DC24B19FB7508611ACD8AD17F401753670CFD8DD1BEBEF9C875125E98D82E3D" // hash값이 틀려야 통과를 함.
            expect(() => {
                cryptoModule.isValidHash(hash)
            }).toThrowError()
        })
        it("hash 값이 64글자이지만 올바르지 않은 형식일경우 (마지막에 G 넣음)", () => {
            const hash = "DC24B19FB7508611ACD8AD17F401753670CFD8DD1BEBEF9C875125E98D82E3DG" // hash값이 틀려야 통과를 함.
            expect(() => {
                cryptoModule.isValidHash(hash)
            }).toThrowError()
        })
    })
})
```

구한 hash를 변수로 담아서 함수의 인자 값으로 전달하여 함수의 성공여부를 판단한다.

에러를 발생해야 test코드에서 pass가 되기 때문에
hash를 틀린 값으로 넣어야 확인이 가능하다.

```ts
import { Hash } from "types/block"
import cryptojs from "crypto-js"
import { TransactionData, TransactionRow } from "@core/transaction/transaction.interface"
import merkle from "merkle"
import { BlockInfo } from "@core/block/block.interface"

class CryptoModule {
    SHA256(data: string): Hash {
        const hash = cryptojs.SHA256(data).toString()
        return hash
    }

    merkleRoot(data: TransactionData) {
        if (data instanceof TransactionRow) {
            //data:TransactionRow
        } else {
            //data:string
            return merkle("sha256").sync([data]).root()
        }
    }
    createBlockHash(data: BlockInfo): Hash {
        const value = Object.values(data).sort().join("")
        return this.SHA256(value)
    }
    isValidHash(hash: Hash): void {
        const hexRegExp = /^[0-9a-fA-F]{64}$/
        if (!hexRegExp.test(hash)) {
            throw new Error(`Hash 값이 올바르지 않습니다. hash: ${hash}`)
        }
    }
}
export default CryptoModule
```

hash의 규칙은
0~9, a~f, A~F를 값으로 구성되어야하며, 총 64자리의 문자열인 값이여야 한다.

## 4. 정리

위의 과정들을 통해서 기본적인 비트코인의 제네시스 블럭의 구성과 제네시스 블럭의 요소들을 만드는 과정을 TDD 기법을 이용하여 작성했다. 기본적인 개념 및 해시화하는 작업을 연습해볼 수 있었다.
