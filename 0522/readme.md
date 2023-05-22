# Contract 실행

스마트 컨트랙트에서 저장을 할 수 있는 영역이 있는데, 이 공간은 데이터를 영구적으로 저장할 수 있는 contract storage를 말한다.

이 storage에 상태를 담아 유지하고 저장할 수 있도록 하는 것이 블록체인 기반 스마트 컨트랙트의 핵심 기능이다.

배포된 각 스마트 계약과 관련된 전용 저장 공간이며, 이 저장 공간은 영구적이다. 즉, 여기에 저장된 데이터는 컨트랙트 실행이 완료된 후에도 그대로 유지된다.

일반적인 JS의 클래스 문법이랑 Solidity의 문법은 매우 유사하다.

```js
class Counter {
    value
    constructor() {}

    setValue() {}
    getValue() {}
}
```

```sol
// SPDX-License-Identifier:MIT

prama solidity ^0.8.0;

contract Counter{
    uint256 value;

    constructor(){}

    function setValue public(){}
    function getValue public(){}
}
```

일반적인 JS의 클래스에 작성되어있는 메서드,변수에 접근하기 위해서는 인스턴스 생성을 하는 과정이 필요하다. 만약 여러군데에서 사용하기 위해서는 위치마다 인스턴스를 생성해서 사용해야 하는데, 생성된 여러개의 인스턴스는 서로 다른 메모리 주소를 참조하기 때문에 동일한 값이 아니다.

solidity는 EVM에서 코드가 실행되면서 CA가 생성되는 시점에 인스턴스가 한번만 생성되어 컨트랙트에 접근해서 사용하는 모든 데이터가 같은 데이터를 참조하게 된다. (싱글톤 패턴 방식으로 하나의 인스턴스만 생성하여 어디서든 해당 인스턴스만 참조한다는 의미의 디자인패턴)
하지만, solidity의 경우에도 같은 코드를 재배포하게 되면 다른 블록에 포함되기 때문에 각각 고유한 인스턴스가 생긴다.

기본적인 스마트 컨트랙트의 프로세스는 "Code 작성" -> "Code Compile" -> "스마트 컨트랙트 배포(Transaction)" -> "Node에 전송" -> "블록이 생성되면서 Account(CA) 생성" -> "EVM에서 Solidity를 실행해서 인스턴스 생성" -> "storage에 데이터 저장"

# Getter / Setter

```js
class Counter {
    value
    constructor() {}

    //setter
    setValue(_value) {
        this.value = _value
    }

    //getter
    getValue() {
        return this.value
    }
}

const counter = new Counter()

Counter.setValue(1)
```

```sol
// SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

contract Counter{
    uint256 value;

    constructor(){}

    //setter
    function setValue(uint256 _value) public {
        value = _value;
    }

    //getter
    function getValue() public view returns(uint256){
        return value;
    }
}
```

JS에서의 Counter를 만들 때, setter, getter에 해당하는 함수를 선언하였다. setter은 데이터를 조작 및 수정하고, getter은 가지고 있는 값을 그냥 불러오는 역할을 한다.

setter은 가지고 있는 값을 변화시키는 것이 목표이기 때문에 함수의 return 값이 없어도 함수를 실행하는데 문제가 없다. 하지만 getter의 경우 함수를 호출시 가지고 있는 값을 반환하기 때문에 return 값이 필요하다.

스마트 컨트랙트가 실행될 때 EVM에서 연산을 기준으로 일종의 수수료인 가스가 측정되어 해당 수량만큼 가스를 소비한다.

getter의 경우 가지고 있는 상태변수의 값을 가져오는 함수이므로 연산을 하는 과정이 없기 때문에 가스를 소비하지 않는다.
하지만 setter에 경우 상태변수의 값을 변경하기 때문에 일정한 가스가 소비된다.

연산하는 과정에서 무한루프를 연산하게 될 시, gasLimit가 넘어서 랜잭션이 블록에 담길 수 없게 된다. 그래서 연산을 다 했을 때 가스 소비량이 gasLimit보다 작아야 한다.

# Call / Send

getter와 같이 함수를 실행해서 값을 가져오는 역할을 하는 함수를 Call함수라 하고, setter와 같이 함수를 실행했을 때 기존의 값을 어떠한 연산을 통해서 변화시켜주는 함수를 Send함수라고 한다.

Call함수는 읽기 전용 작업이므로 가스를 소비하지 않는다. 컨트랙트를 수정하지 않는 getter함수를 실행하는데 사용한다.(모든 getter가 연산을 하지 않는 것은 아니다.)

Send함수는 컨트랙트를 실행할 떄 상태를 수정하는 기능을 실행하기 위해서 사용되며, Send함수를 실행할 떄, 연산으로 인해 가스의 소비가 있기 때문에, ETH를 가지고 있는 계정에서만 Send함수를 실행할 수 있다.

## Call / Send 함수 이용하기

작성한 컨트랙트 코드에서 함수를 이용해서 CA의 storage에 있는 value값을 가져올 때, bin파일이였던 바이트코드를 이용해서 함수를 직접적으로 불러올 수 없다.
스마트 컨트랙트의 컴파일된 버전이기 때문에 코드에 대한 모든 로직이 포함되어 있지만 사람이 읽을 수 없고, 해당 형식으로 직접 호출 할 수 없다.

호출하기 위하여 web3.js와 같은 소프트웨어 라이브러리를 통해 호출 할 수 있고, ABI파일의 내용과 CA를 이용하여 JS코드로 컨트랙트 인스턴스를 생성할 수 있다.

```js
//Call 예시코드
//배포해서 얻은 CA : 0x670D634d285e34f8bE6af5b44c126BD3cB4E67AC

const Web3 = require("web3")
const web3 = new Web3("http://127.0.0.1:8545")

const abi = [
    [
        {
            inputs: [],
            name: "getValue",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [{ internalType: "uint256", name: "_value", type: "uint256" }],
            name: "setValue",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
    ],
]

//인자값 1 : getter 함수, 인자값 2: 함수의 매개변수
const dataCode = web3.eth.abi.encodeFunctionCall(
    {
        inputs: [],
        name: "getValue",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    []
)

web3.eth
    .call({
        // call Method는 가스가 소비되지 않는다.
        to: "0x670D634d285e34f8bE6af5b44c126BD3cB4E67AC",
        data: dataCode,
    })
    .then((data) => {
        //16진수로 나오기 때문에 변환하면 10진수로 변환한다.
        const result = web3.utils.toBN(data).toString(10)
        console.log(result)
    })
```

Send 함수의 경우 일반적인 트랜잭션을 생성하는 것과 같다.
Send 함수를 이용해서 데이터의 값을 변경한 다음 Call을 하게 되면, 변경된 값이 출력된다.
단일 인스턴스이기 때문에 하나의 변수를 변경하고, 호출하는 것이다.

```js
//Send 예시코드

const Web3 = require("web3")
const web3 = new Web3("http://127.0.0.1:8545")

const abi = [
    [
        {
            inputs: [],
            name: "getValue",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [{ internalType: "uint256", name: "_value", type: "uint256" }],
            name: "setValue",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
    ],
]

const dataCode = web3.eth.abi.encodeFunctionCall(
    {
        inputs: [{ internalType: "uint256", name: "_value", type: "uint256" }],
        name: "setValue",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    [10]
) //0x55241077000000000000000000000000000000000000000000000000000000000000000a : 0들은 의미없는 숫자이고, 구분자의 역할이다. 함수...000000...value

console.log(dataCode)
const tx = {
    from: "0xbA8136c2A5F91b2fb077768E6701dB77A40eCE06", // 실행할 사람 (가스를 소비할 사람)
    to: "0x670D634d285e34f8bE6af5b44c126BD3cB4E67AC", // CA값
    data: dataCode,
    gas: 500000,
    gasPrice: 20000000000,
}
web3.eth.sendTransaction(tx).then(console.log)
```

스마트 컨트랙트는 데이터를 저장하고 관리하는 점에서 데이터베이스와 유사한 점이 있다. 하지만 일반적으로 내 데이터베이스는 나만 접속할 수 있지만, 스마트 컨트랙트의 변수에는 다른 사람이 접속할 수 있다는 점이 다르다.
