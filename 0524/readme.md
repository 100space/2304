# Truffle을 이용한 Smart Contract(스마트 컨트랙트) 배포 및 활용

이더리움 개발을 위한 툴 중에 하나로 DApps을 쉽게 개발할 수 있도록 도와주는 블록체인 프레임워크이다.
스마트 컨트랙트 컴파일 및 배포와 테스트를 위한 기능을 쉽게 할 수 있도록 도와준다.

Truffle을 사용하지 않았을 때, 컨트랙트 소스코드를 작성하고 solc를 이용한 컴파일을 진행하고, sendTransaction을 이용하여 배포를 진행하고 배포가 되면서 생긴 CA를 따로 관리하고 CA를 이용하여 메서드를 사용하는 여러 단계의 복잡하고, 번거로운 작업을 거쳐야 했지만 Truffle 프레임워크를 이용하면 위의 과정들을 간단하게 사용할 수 있도록 구현되어 있다.

어제 만들었던 카운터를 truffle을 이용해서 구현하는 과정을 단계별로 작성하였다.

<br/><br/><br/>

## **1. 시작하기**

리액트를 이용해서 브라우저 환경에서 이더리움과 통신을 목표로 한다.

```bash
$ npx create-react-app front
```

truffle은 프레임워크이기 때문에 디렉토리 구조를 가지고 있다.
npx 명령어를 이용해서 truffle을 실행하여 환경을 구축한다.

```bash
$ cd front
$ npx truffle init
```

기본적으로 3개의 디렉토리가 생긴다.

-   contracts

    -   solidity 소스코드를 작성하는 디렉토리로, 컴파일을 진행했을 때 해당 디렉토리에 있는 ".sol"파일을 추적하여 컴파일을 진행한다.

-   migrations

    -   배포를 위한 스크립트를 저장하는 곳이다. 마이그레이션은 이더리움 네트워크에 배포할 떄 필요한 JS파일이다.

-   test
    -   테스트 파일을 작성하는 곳이다. Truffle은 Mocha 및 Chai로 자동 테스트를 지원합니다.

<br/><br/><br/>

## **2. truffle 세팅하기**

truffle-config.js 파일을 이용해 기본적인 환경을 설정해준다.

<br/>

### **2-1. 컴파일러 버전 수정**

컴파일러의 버전을 0.8.20으로 되어있는 것을 0.8.18로 수정한다.
컴파일하고 배포하는 과정에서 invalid opcode error가 발생했었다.
**vm exception while processing transaction: invalid opcode** 오류가 발생하는 경우가 있는데,
이 때, 컴파일러의 버전을 낮춰주니 문제가 해결되었다. ("pragma solidity ^0.8.0"로 작성했다.)

컴파일러 버전이 안맞아서 생기는 오류인 것은 확인했으나 어떤 과정에서 어떻게 생기는 오류인지에 대한 이유를 찾지 못했다.

```js
compilers: {
    solc: {
        version: "0.8.18",
    },
},
```

<br/>

### **2-2. 로컬 개발 환경 구성**

ganache 네트워크를 이용해서 로컬에서 개발을 진행중이기 때문에 배포되는 환경을 ganache 네트워크로 지정해줘야 한다. 그래서 truffle-config.js의 주석되어있는 항목들 중에서

```js
development: {
    host: "127.0.0.1",
    port: 8545,
    network_id: "*",
},
```

development 객체의 주석을 제거하여 truffle 명령을 실행할 때마다 Ganache에서 제공하는 로컬 개발 환경을 사용하도록 설정한다.

<br/>

### **2-3. compile된 파일 저장 위치 지정**

solidity로 작성된 컨트랙트 코드를 이더리움 네트워크에서 이해할 수 있는 형식으로 변환하기 위해서 컴파일과정을 거치는데, 이 때, truffle로 컴파일을 하게되면 ".json" 파일이 생성된다.
이 파일 내 정보를 이용해서 프론트엔드 DApp 코드는 컨트랙트와 통신하기 때문에 src 디렉토리 하위에서 파일을 관리를 하게 되면 리액트에서 접근을 쉽게 할 수 있다.

```js
contracts_build_directory: "./src/contracts",
```

<br/><br/><br/>

## **3. 컴파일 하기**

Solidity로 작성된 컨트랙트 코드를 컴파일한다.
이전에 했던 "solc" 명령어를 사용해서 bin파일과, abi파일을 생성하는 과정 truffle에서는 명령어로 쉽게 컴파일을 진행할 수 있다.

```bash
$ npx truffle compile
```

truffle 내부적으로 compile 명령어를 통해 쉽게 컴파일을 진행해준다.

<br/><br/><br/>

## **4. 배포 하기**

컴파일을 진행한 후 작성한 컨트랙트 코드를 이더리움 네트워크에 배포해야 한다. 지금은 ganache을 이용해서 로컬 환경에서의 네트워크에 배포하지만 테스트넷을 이용하는 경우도 있다.

테스트넷은 이더리움 네트워크와 같은 네트워크이지만 chainId가 다르다. 그렇기 때문에 실제 이더리움 네트워크가 아닌 테스트 네트워크에 배포가 된다.

그리고 실제 이더리움 네트워크에 배포를 하기 위해서 이더리움 네트워크와 직접적으로 연결되어 있는 노드를 가지고 있어야 하지만, 우리는 직접적으로 노드를 관리하고 있지 않기 때문에 프록시 서버의 역할을 하는 인프라라는 서비스를 이용한다.

인프라는 이더리움 네트워크와 사용자간에 중개자 역할을 하여 사용자를 대신해서 노드를 관리한다. 이를 통해 사용자는 직접 노드를 관리하지 않고 네트워크와 상호작용을 할 수 있다. 인프라 자체가 네트워크를 뜻하는 것이아니고 이더리움 네트워크에 대신 요청을 해주는 것이라는 점을 알고 있어야한다.

<br/>

### **4-1. 배포를 위한 migration 파일 만들기**

migration 디렉토리 안에 배포를 위한 '1_deploy_Counter.js' 파일을 만든다.

migration 디렉토리에 배포 관련 코드를 작성할 때 파일명을 "[번호]_[내용]_[컨트랙트이름].js" 형식으로 생성한다.

```js
// migration/1_deploy_Counter.js

//Counter.json 안에 있는 bytecode를 사용하기 위해서 불러온다.
const Counter = artifacts.require("Counter")

module.exports = (deployer) => {
    deployer.deploy(Counter)
}
```

<br/>

### **4-2. migration 명령어를 이용하여 배포하기**

```bash
$ npx truffle migrate
```

위의 명령어를 작성하면 디렉토리 안에 파일들이 번호 순서대로 배포가 진행된다.
배포가 진행되면서 트랜잭션 풀에 담긴 상황이 되고, 블럭이 마이닝되면서 data에 포함되어 블록이 생성되면 배포가 완벽하게 끝나게 된다.

truffle은 동일한 마이그레이션을 다시 실행하지 않도록 실행된 마이그래이션을 추적한다.
만약 재배포를 하고 싶은 상황에선 --reset을 명령어에 추가하여 작성하면 된다.

```bash
$ npx truffle migrate --reset
```

<br/><br/><br/>

## **5. 배포 확인**

작성한 스마트 컨트랙트가 배포가 제대로 되었는지 확인하기 위해서 CA를 이용해서 확인할 수 있다.
스마트 컨트랙트의 배포에 문제가 없다면 CA가 생성되기 때문에 컨트랙트에 접근하여 확인할 수 있다.

```bash
$ npx truffle console

# "truffle(development)> "가 출력되면
$ Counter.address
```

Counter은 contracts 디렉토리에 작성 했던 컨트렉트의 이름이다.

```sol
contract Counter{
    uint256 value;
    constructor(){

    }
    function getValue () public view returns(uint256){
        return value;
    }
    function increment() public {
        value += 1;
    }
    function decrement() public {
        value -= 1;
    }
}
```

<br/><br/><br/>

## **6. 배포된 스마트 컨트랙트에 접근하기**

배포된 스마트 컨트랙트에 접근해서 public으로 만든 함수를 사용할 수 있다.
Counter로 접근했었던 것을 변수에 할당에서 쉽게 접근할 수 있도록 만들어준다.

```bash
# truffle.console 상태에서
Counter.deployed().then((instance)=>(counter = instance))
```

counter에 Counter 스마트 컨트랙트의 인스턴스를 할당하는 과정이라고 생각하면 된다.
이후에 'counter.~~'를 이용하여 instance에 접근이 가능하다.

<br/>

### **6-1. call함수 사용하기**

Counter 인스턴스를 counter에 할당을 하게되면 counter에는 getValue()라는 Call함수가 존재하게 된다.
그래서 아래의 명령어로 getValue()에 접근할 수 있다.

```bash
counter.getValue()
```

<br/><br/><br/>

## **7. 테스트 진행하기**

truffle은 Chai 어설션 라이브러리와 Mocha 테스트 프레임워크를 이용하여 스마트 컨트렉트엥 대한 테스트 작성을 할 수 있도록 도와준다.

```js
const Counter = artifacts.require("Counter")

// contract는 테스트 케이스를 정의하기 위한 최상위 구조
contract("Counter", (account) => {
    console.log(account)
    // describe 그룹 관련 테스트
    describe("", () => {
        //it 개별 테스트
        it("", () => {})
    })
})
```

<br/>

### **7-1. 명령어**

```sh
$ npx truffle test
```

테스트 진행할 때는, 만들어져 있는 인스턴스를 이용해서 테스트를 진행하는 것이 아닌 새로운 인스턴스를 가져오기 때문에 테스트의 상태변경은 다른 테스트에 영향을 미치지 않는다. 테스트가 실행되면서 트랜잭션이 생성되기 때문에 블록체인에 새로운 블록이 추가가 된다.

이더리움 블록체인에 배포된 컨트랙트는 수정 및 삭제가 불가하므로 스마트 컨트랙트를 개발하는 과정에서 테스트는 반드시 진행되어야 한다.
