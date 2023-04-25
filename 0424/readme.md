# TDD

TDD는 Test-Driven Development로 소프트웨어 개발방법론 중 하나로 실제 코드를 작성하기 전에 테스트를 먼저 작성하는 방법이다.
테스트 코드를 통한 실패하는 코드(에러코드)를 작성하고 하나씩 고쳐나가면서 개발하는 과정을 거친다.

테스트는 메서드 또는 class처럼 작은 단위로 진행한다.
테스트에 통과되는 코드만 실제 코드로 작성한다.

TDD를 이용하여 개발을 진행하게 되면 오류나 문제점을 미리 예방할 수 있어 프로젝트의 안정성과 신뢰성을 높일 수 있다. 작은 단위로 진행하면서 작성하기 때문에 코드의 유지보수가 용이해진다.

하지만 TDD도 단점이 있는데, 작은 단위로 하나씩 테스트 후 실제 개발코드로 작성하다보니 초기 개발속도가 느려질 수 있고, 프로젝트 규모가 커지면서 테스트 해야하는 케이스가 많아질 경우 코드 작성하는 시간도 늘어난다.

# JEST

Jest는 JS의 대표적인 테스트를 위한 프레임워크이다. React를 개발한 메타(구 facebook)에서 만들어졌다.
TS와 Jest를 함께 사용하기 위해서 @types/jest와 ts-jest라는 라이브러리를 이용하여 TS코드를 컴파일하고 테스트 한다.

## @types/~~ 라이브러리

'@types/'로 시작하는 라이브러리는 JS 라이브러리를 이용할 때, 해당 라이브러리에 대한 타입을 모르기 때문에 타입을 따로 지정해 놓은 라이브러리이다.

# Jest 사용하기

-   jest는 프레임워크이자, 실행을 할 때 사용하는 실행기이다.
-   명령어를 이용해서 실행해야 한다.

## 1. 명령어를 입력하여 사용하기

Jest를 실행할 때, 터미널에

```sh
$ npx jest
```

를 이용하여 jest를 실행시킬 수 잇다.

### 1-1. 옵션 지정하기

기본적인 명령어를 통해 실행할 수 있긴 하지만,
원하는 값을 얻기 위하여 옵션을 이용하여 실행시킬 수 있다.

-   기본적으로 를 이용해서 루트 디렉토리 하위에 있는 ["파일이름"].test.["확장자"]로 지정된 파일과, '\_\_test\_\_' 디렉토리를 추적한다.
-   실행을 하게되면 Jest는 기본적으로 JS를 추적하기 때문에
    TS코드에 대한 문법 오류가 발생하는데, 이를 해결하기 위해서 설정을 할 수 있다.

```sh
$ npx --testEnvironment node
```

를 이용하여, jest가 테스트 실행을 위해 node.js환경을 한다는 것을 지정한다.

그리고 "preset" : "ts-jest" 속성을 이용하여 ts-jest를 사용한다고 지정한다.

```sh
$ npx --preset ts-jest --testEnvironment node
```

## 2. jest.config.json파일

1-1처럼 명령어르 한 줄로 적어서 할 수 있지만 지정해 줄 속성이 많아지면서 매번 test를 진행할 때 마다 명렁어를 직접적어서 실행하는 것은 번거롭고, 불편하므로,
test파일을 이용하여 기본 속성을 지정한 후 package.json script에 지정 후 사용할 수 있다.

```json
//jest.config.json

{
    "preset": "ts-jest",
    "testEnvironment": "node"
}


//package.json
{
    "scripts": {
        "test": "jest"
    }
}
```

## 3. package.json

jest는 json파일이 아닌 package.json에 jest 속성을 이용해서 옵션을 지정할 수 있다.

```json
{
    "jest": {
        "preset": "ts-jest",
        "testEnvironment": "node",
        "moduleNameMapper": {
            "^@(board|comment|core)/(.+)$": "<rootDir>/src/$1/$2"
        }
    }
}
```

### 옵션 설명

-   1. preset : jest가 "ts-jest`프리셋을 사용해야 한다고 지정하는 것이다. ts-jest 프리셋을 이용하면 TS 코드를 처리할 수 있고, 타입 체크를 할 수 있다.
-   2. testEnvironment : jest가 테스트를 실행하기 위해서 Node.js환경을 사용한다는 것을 의미한다. Node.js 런타임 환경에서 실행된다.
-   3. moduleNameMappper : import를 사용할 때 별칭을 사용하게 되면, 이 별칭에 대한 매핑을 jest도 알 수 있도록 지정해주는데, 이를 정규식으로 표현한 것이다.
    -   ex : @board/ , @comment/, @core/ 로 시작하는 모듈을 각각 src/board, src/comment, src/core 디렉토리에서 찾도록 지정하는 것이다.

# Jest syntax

["파일이름"].test.["확장자"]로 지정된 파일을 실행하기 때문에 파일이름을 맞춰서 지정해주어야 한다.

## 1. 기본 문법

```ts
// sample.test.ts
describe("Test 1", () => {
    it("Test 1-1", () => {
        const a = 1 + 1
        expect(1).toEqual(a)
    })
    test("Test 1-2", () => {
        const a = 1 + 1
        expect(2).toEqual(a)
    })
})
```

위와 같이 describe()을 이용하여 관련 테스트를 그룹화한다.
describe()의 두 번째 매개변수로 콜백함수를 이용하여 실제 테스트 케이스인 it() 또는 test()를 작성한다.
it, test 두가지는 같은 역할을 한다.

## 2. expect(), matcher()

jest에서 주어진 코드가 예상대로 작동하는지 여부를 판단하는 핵심적인 함수이다.
expect()함수의 인자 값은 함수의 결과값이나 반환되는 값을 지정한다.
matcher()함수의 인자값은 비교할 값을 지정한다.

쉽게 풀어쓰면

```js
expect(1 + 1).toEqual(2) // 1+1은 2와 같니?
```

라는 것과 같다.
여러가지 많이 쓰이는 matcher()에 대한 예시로

```js
// 엄격한 동등성을 확인( '===' )
toBe()
// 단순 값을 비교
toEqual()
// 함수가 사용 됐는지 확인
toBeCalled()
// 인자값으로 a를 사용했는지 확인
toBeCalledWith(a)
```

toBe()와 toEqual()을 비교하는 예시이다.

```js
describe("exam1", () => {
    const objA = { name: "a" }
    const objB = { name: "a" }
    it("tobe()", () => {
        expect(objA).not.toBe(objB)
    })
    it("toEqual()", () => {
        expect(objA).toEqual(objB)
    })
})
```

objA 와 objB는 다른 메모리를 참조하고 있기 때문에 엄격한 동등성을 비교할 때 같지 않기 때문에 fail이지만 값이 {name:a}로 같은 객체의 내용을 갖기 때문에 toEqual()은 pass이다.

## 3. 중복되는 코드제거

위의 기본문법 예시에서

```ts
const a = 1 + 1
```

가 중복으로 작성되어 있다.
이를 beforeEach()를 이용하여 제거할 수 있다.

```ts
describe("Test 1", () => {
    let a
    beforeEach(() => {
        a = 1 + 1
    })
    it("Test 1-1", () => {
        expect(1).toEqual(a) //fail
    })
    test("Test 1-2", () => {
        expect(2).toEqual(a) //pass
    })
})
```

비슷한 역할을 하는 함수들로는

```js
afterAll(() => {}) // 실행 된 후 한번만
afterEach(() => {}) // 매 케이스가 실행 된 후
beforeAll(() => {}) // 실행 되기 전 한번만
beforeEach(() => {}) // 매 케이스가 실행되기 전
```

4가지가 있는데, beforeAll, beforeEach가 제일 많이 쓰인다.

# Mock Function

단위 테스트를 작성할 때, 테스트하는 코드가 의존하는 코드의 일부를 가짜(mock)로 바꾸는 기법이다.

## 사용하는 이유

mock 함수는 다른 함수, 구성 요소 등 의존하는 부분을 대체하여,
테스트 하는 코드를 분리하고, 동작을 제어하기 위해서 사용 사용된다.

## 사용하는 방법

jest는 mock 함수를 만들기 위해 jest.fn()이라는 내장 메서드가 있다.

```js
// mock 리턴값 지정하기
jest.fn().mockReturnValue("hello") // hello

// 비동기 함수에서 resolve 값 얻기
const mockResolve = jest.fn().mockResolvedValue("aa")
await asyncMock() // aa

// 비동기 함수에서 reject 값 얻기
const mockReject = jest.fn().mockRejectedValue(new Error("error"))
await mockReject() // error : error
```

mockReturnValue()를 이용해서 mock함수가 항상 지정된 값으로 반환하도록 설정함

mockResolvedValue()와 mockRejectedValue()는 Promise의 반환값으로 지정된다.
mockResolvedValue()는 Promise가 성공했을 때, mockRejectedValue()는 실패했을 때 반환된 값을 지정한다.
