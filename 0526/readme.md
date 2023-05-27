# **1. ERC**

ERC는 Ethereum Request for Comment의 약자로 이더리움 블록체인 네트워크에서 토큰을 구현하기 위한 기술적인 표준을 말한다.
많은 종류의 토큰이 있을 때 서로 호환을 하고 상호 작용을 같은 코드를 이용해서 하기 위해서 변수명이나 함수명을 지정해서 개발자들이 따를 수 있는 규칙, 가이드라인을 정해둔 것을 말한다.
대표적인 **ERC 표준으로 ERC20, ERC721, ERC1155등이 있다.**
각 숫자는 표준 제안의 순서를 식별하기 위한 숫자로 큰 의미가 있는 것은 아니다.

<br/>

**코인과 토큰의 차이점**
코인과 토큰의 가장 큰 차이점은 메인넷 유무의 차이이다. 코인은 본인의 메인넷이 있지만 토큰은 다른 네트워크 안에 포함되어 있기 때문에 토큰자체의 메인넷이 구현되어있지 않다.

<br/>

## **1-1. ERC20**

ERC20은 이더리움 블록체인에서 가장 널리 사용되는 토큰 표준이다. ERC-20 표준은 기본적인 상호 교환 가능한 토큰의 기능을 정의한다.
ERC20 표준으로 만든 토큰은 상호 교환이 가능하다. 이 표준은 **토큰의 전송 , 잔액조회, 토큰의 소유주 관리 등을 위한 메서드와 이벤트를 정의**한다. ICO 및 탈중앙화 된 금융(DeFi)에서 사용된다.

<br/>

## **1-2. ERC721**

ERC721은 이더리움 블록체인에서 사용되는 토큰 표준들 중에 하나로 NFT(대체 불가능한 토큰)를 나타낸다.
ERC721 토큰은 각각 고유한 특성과 소유권을 가지며 이를 이용해서 게임 캐릭터, 디지털 예술품, 가상 부동산 등의 소유권을 나타낼 수 있다.
ERC721 표준은 **토큰의 소유권 이전, 토큰 메타데이터 조회, 토큰 간의 상호작용을 위한 메서드와 이벤트를 정의**한다.

<br/>

## **1-3. ERC1155**

ERC1155는 이더리움 블록체인에서 여러 종류의 토큰을 단일 계약 내에서 관리하기 위한 표준이다.
ERC1155는 **일반적인 토큰(ERC20)과 NFT(ERC721)**를 모두 지원하는 토큰이다. 이를 통해서 단일 계약내에서 다양한 토큰 타입을 생성하고 관리할 수 있기 때문에 효율적인 스마트 컨트렉트를 작성할 수 있다.
ERC1155 표준은 한 트랜잭션에 여러 개의 토큰을 여러 주소로 동시에 전송할 수 있는 **a멀티 전송** 기능과, ERC1155 토큰끼리의 하나의 트랜잭션에 한 번에 실행되어 중간 중개자 없이 양쪽의 토큰 전송이 동시에 이루어 질 수 있다 **(아토믹 스왑)**

<br/><br/><br/>

# **2. 토큰 표준 이해하기**

토큰 표준을 정한 가장 큰 이유는 개발자들이 토큰을 구현하고 상호작용할 수 있는 인터페이스와 규칙을 제공하므로써 개발자들은 같은 표준을 쓰는 모든 토큰에 대해서 일관된 방식으로 토큰을 다루고 관리할 수 있기 때문이다.

ERC20에 대한 정보를 코드로 간단하게 TS을 이용해서 표현하자면 아래와 같다.

```ts
interface Balance {
    address :string
    amount : number
}
interface Token{
    name : string
    balance : Balance[]
    transfer(to, value){} // 토큰을 전송하기 위해서 사용하는 메서드
}

const IngToken:Token = {
    name : "ingToken",
    balances: [
        {
            address : "A"
            amount : 50,
        },
        {
            address : "B"
            amount : 10,
        }
    ]
}

ingToken.transfer(B,50)
```

ERC20 토큰 표준은 상태변수의 이름, 메서드를 통일해서 토큰의 표준(일관된 인터페이스)을 만든다.
여러 기능은 추가 될 수 있지만 기본적인 가이드라인이 존재하며 이로인해 ABI파일의 기본 인터페이스가 같다.

<br/><br/><br/>

# **3. 스마트 컨트랙트의 인스턴스 생성과 생성자함수**

스마트 컨트랙트가 배포된 후에 EVM에서 해당 코드를 실행하면서 인스턴스가 생성된다.
이 때, 스마트 컨트랙트의 생성자 함수가 호출되어 초기값을 설정한다. 객체 지향 프로그래밍에서의 클래스 인스턴스화와 유사한 개념이다.

```sol
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0 ;

contract SimpleStore {
    uint256 public value;
    address public owner;

    constructor( uint256 _value){
        value = _value;
        owner = msg.sender;
    }
}
```

위의 solidity 코드가 배포되면서, 인스턴스가 생성될 때 생성자함수가 실행 되는데, 이 때 인자값을 전달해주어야 한다. 그래서 Migration 디렉토리 내에 마이그레이션 파일을 작성할 때 전달할 값을 넣어준다.

마이그레이션 파일에서 deploy()를 이용해서 배포할 때, 첫번 째 인자값으로 배포될 스마트컨트랙트 객체, 두번 째 인자값으로 생성자 함수 전달될 값을 넣어준다.

```js
// 예시
deployer.deploy([contract], arg1, arg2)
```

simpleStore의 배포를 위한 마이그래션 파일을 작성하면 아래와 같다.

```js
//1_deploy_simplStore.js
const SimpleStore = artifacts.require("SimpleStore")

module.exports = (deployer) => {
    deployer.deploy(SimpleStore, 15)
}
```

<br/>

## **3-1. 스마트 컨트랙트 오너**

스마트 컨트랙트를 배포한 사람을 Owner 변수에 할당하여 최초 배포자를 관리할 수 있다.

위의 솔리디티 코드에서 owner라는 변수를 생성자함수에서 msg.sender로 대입하여 주었는데,
msg.sender는 트랜잭션을 생성한 사람을 의미하고, 솔리디티 코드가 배포되었을 때 생성자 함수가 최소 한번만 싫행되기 때문에, owner은 이후에 사용하더라도 값이 변하지 않고 msg.sender로 고정되어 있기 때문에 최초의 배포자를 알 수 있고, 이를 이용해서 owner에 대한 코드를 이용해서 owner만 사용할 수 있는 메서드는 만들어서 사용할 수 있다.

```sol
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStore {
    uint256 public value;
    address public owner;

    constructor( uint256 _value){
        value = _value;
        owner = msg.sender;
    }

    function ownerOnlyFunction() public {
        require(msg.sender === owner, "You are not the owner!");
        // 오너만 사용할 수 있는 로직
    }
}
```

solidity에서의 require는 매개변수에 true가 되어야 다음 로직이 진행된다.
일종의 if문이다.

위으이 코드는 배포할 당시 인스턴스가 만들어지면서 생성자함수에 배포자를 owner로 지정해둔다. 그리고 ownerOnlyFunction에서 require()를 만나 msg.sender와 owner의 값이 같으면 다음 로직을 실행하는 코드를 이용해 오너만 사용하는 메서드를 만들 수 있다.

<br/><br/><br/>

# **4. mapping**

스마트 컨트랙트를 작성할 때 가장 많이 쓰이는 방식으로 키-값 쌍을 저장할 때 사용한다.
정확한 표현은 아니지만 Javascript의 객체와 유사하다.

배열로 데이터를 받을 때, const A = ["a", "b","c"]라고 한다면
b를 호출하고 싶을 때 A[1] 를 이용해서 b에 접근 할 수 있다.
key는 Index인 1이며, 그 값이 "b"이다. 이를 mapping을 이용해서 솔리디티로 작성하게 된다면 아래와 같이 작성할 수 있다.

```sol
mapping (uint256=>string) public  A
```

mapping은 일종의 데이터 타입으로 하나의 데이터에 여러 데이터를 관리하기 위해서 key-value로 mapping하여 관리한다.

```sol
mapping (number=>string) public A // string[] 으로 치환해서 생각하면 이해하기 쉽다.

```

mapping을 아래와 같이 여러번 중첩해서 사용할 수도 있다.

```sol
mapping (address => mapping(uint256 => uint256) public B) public C

// {
//     0xbDEe92a85377C1d7b3bd6e2211A40fe82A41c227 : {
//         0:1234
//     }
// }
```
