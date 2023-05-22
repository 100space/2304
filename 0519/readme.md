# Ethereum 개발

이더리움을 개발하기 위해서 이해 해야할 몇 가지 중요한 개념이 있다.

-   1. Block : 트랜잭션 및 여러 데이터를 모아서 하나의 블록에 저장한다. 이더리움 기준으로 몇 초간격으로 새로운 블록이 생성되고 이더리움 네트워크에 추가된다. 만들어진 블록은 이더리움 네트워크 내 노드에 의해 검증 후 블록체인의 마지막에 추가되어 블록체인 형태를 유지한다.

-   2. Account : 이더리움에서의 계정은 EOA와 CA 두가지로 나뉜다. EOA는 privateKey를 이용해서 제어되는 외부 소유 어카운트이고, CA는 Contract Code에 의해서 제어되는 스마트 컨트렉트 어카운트이다 ( 프라이빗 키가 존재하지 않고 EOA에 의해서 활성화 된다.) 두 종류의 계정 모두 Eth 잔액을 가진다.

-   3. Message or Transaction : 트랜잭션은 메세지의 수신자, 이더 값, 보낼 데이터, nonce, 가스가격 그리고 가스 한도를 포함한다. 메세지는 트랜잭션에 의해서 생성되고, EOA 계정에 의해서 생성된다.

-   4. Fee(Gas) : 이더리움에서 트랜잭션은 연산을 위해서 자원이 필요하다. 이 자원을 수수료라고 하며 측정 단위가 Gas이다. 트랜잭션을 할 때, 가스 한도(사용할 가스의 최대량)와 가스가격(가스 단위당 지불할 Eth의 양)을 작성해야 한다. 총 트랜잭션의 수수료는 "트랜잭션에 사용된 가스 X 가스 가격"이다.

-   5. 이더(ETH) : 이더리움 생태계에서 사용하는 기본 암호화폐의 단위이자, 네트워크에서 계산을 수행하고, 보상수단으로 사용한다.

# Ethereum 개발을 위한 툴

-   1. Geth : Go언어로 작성된 Ethereum 클라이언트이다. Ethereum 네트워크에 참여할 수 있고, 스마트 컨트랙트를 배포하고 실행할 수 있다. Geth를 이용해서 이더리움 네트워크의 chainId를 확인할 수 있다.
       chainId는 현재 연결되어있는 블록체인의 고유 식별자이고 이를 이용해서 메인넷, 테스트넷을 구분할 수 있다.

-   2. Ganache : Ganache는 로컬 개발 및 테스트를 할 수 있는 테스트용 Ethereum 네트워크이다.

    -   ganache로 테스트한 후, testnet에서 테스트 한다. 이후에 mainnet에 올리는 순서로 개발을 한다.
    -   ganache, testnet, mainnet 모두 같은 코드로 진행된다.
    -   mainnet에 올리면 수정이 불가하기 때문에 충분한 테스트가 중요하다.

-   3. Metamask : 메타마스크는 Ethereum 지갑 및 브라우저 확장 프로그램으로 웹 어플리케이션에서 이더리움 스마트 컨트랙트와 상호 작용할 수 있도록 한다. Metamask에서 개인 키 관리, 트랜잭션 서명 및 네트워크 연결을 할 수 있다.

-   4. Web3.js, Ethers.js : JS라이브러리로, 웹어플리케이션에서 Ethereum 블록체인과 상호 작용을 하기 위해서 노드에게 요청하는 API를 지정해 놓았다.

-   5. Truffle, Hardhat : 스마트 컨트랙트 개발, 테스트, 배포를 쉽게 할 수 있도록 도와주는 프레임워크이다.

# Ganache

Ganache는 local PC에서 개발 및 테스트를 진행하기 위한 도구이다.
GUI와 CLI 환경으로 작동할 수 있지만 CLI 환경으로 작업하는 방법으로 작성한다.

```sh
$ npm install -g ganache-cli
$ npx ganache-cli

# window
$ npx ganache-cli -h 0.0.0.0
```

# RPC (Remote Procedure Call)

별도의 원격 제어를 위한 코딩 없이 다른 주소 공간에서 함수나 프로시저를 실행할 수 있게하는 프로세스 간 통신 기술이다.

즉 별도로 코드를 작성하지 않아도 함수를 호출하는 명령어를 작성하면 지정되어 있는 함수를 실행하거나, 어떠한 구현되어있는 로직이 순차적으로 실행이 될 수 있도록 client와 server간 통신을 할 수 있다.

RPC를 통해서 ethereum 네트워크에서 스마트 컨트랙트 배포 및 원격으로 함수를 호출 할 수 있다. ganache-cli를 이용해서 로컬 이더리움 블록체인 네트워크를 실행하고, RPC를 이용해서 상호작용을 할 수 있도록 해준다.

클라이언트가 서버에게 원하는 함수를 호출하는 요청을 보내고, 서버는 해당 함수를 실행한 후 결과를 클라이언트에게 반환한다.

**요청을 할 수 있는 공간 어디서든 RPC 통신방식을 이용하여 블록체인의 정보를 가지고 올 수 있다.**

## RPC를 이용해서 함수 호출하기

POST http://127.0.0.1:8545를 이용해서 요청을 하면 원격으로 함수를 호출 할 수 있다. POST 요청을 할 때 body에 값을 넣어주어야 한다.

```json
{
    "jsonrpc": "2.0", //JSON-RPC 버전 2.0
    "method": "web3_clientVersion", // 메서드
    "params": [] // 메서드에 전달될 인자값
}
```

"web3_clientVersion"라고 지정된 함수를 실행하기 위해서 위와 같이 작성을 한다.

POSTMAN을 이용하는 방법이 아닌 cli환경에서 curl 명령어를 이용하여 똑같이 함수를 실행할 수 있다.

```sh
$ curl -X POST -d '{"jsonrpc":"2.0", "method":"web3_clientVersion", "params":[]}' http://127.0.0.1:8545
```

같은 코드를 이용해서 ganache를 이용해서 테스트 네트워크와 이더리움 네트워크에 똑같이 사용할 수 있다.

## getBalance 구하기

```json
{
    "jsonrpc": "2.0",
    "method": "eth_getBalance",
    "params": ["0x68ff7899d99d607c1e323a8a341ceeab42395ded"]
}
```

Balance를 구하기 위해서는 getBalance 함수가 필요하며 인자값 1개가 필요하다. 인자값으로 account값을 지정해야한다.

## getBalance 반환값

getBalance 함수를 실행하여 얻은 반환 값은 아래와 같으며 result가 잔액을 말한다.

```json
{
    "jsonrpc": "2.0",
    "result": "0x56bc75e2d63100000"
}
```

result의 값을 보면 "0x56bc75e2d63100000" 이렇게 값이 나오는데,
10진수로 변환하면 100000000000000000000로 값이 나온다.
1ETH === 100 X 10e18 wei이다.

## sendTransaction

sendTransaction 메서드를 이용해서 트랜잭션을 생성할 때, 필요한 값이 3가지가 있다. 보내는사람, 받는 사람, 보낼 값(wei)이다. 이 내용을 params안에 객체형태로 작성한다.

```json
{
    "jsonrpc": "2.0",
    "method": "eth_sendTransaction",
    "params": [
        {
            "from": "0x68ff7899d99D607C1e323a8a341ceEAb42395Ded",
            "to": "0xd521B59D3E38a35a0e38Df1c6ad658736eC29392",
            "value": "1000000000000000000"
        }
    ]
}
```

위의 트랜잭션 정보에서 보내는 사람과 받는 사람에 대한 계정은 개인키를 이용해서 생성한 계정이다. 이 계정은 EOA 형태의 일반적인 사용자의 계정이다.

# Web3.js

Ethereum 블록체인과 상호 작용을 하기 위해서 노드에게 요청하는 API를 지정해 놓은 JS 라이브러리이다.
간단하게 사용해보기 위해서 html,javascript를 이용해서 코드를 작성할 것이다.

web3.js CDN 방식을 위해서 html의 head 부분에 script를 작성한다.

```html
<!-- CDN방식 -->
<script src="https://cdn.jsdelivr.net/npm/web3@1.10.0/dist/web3.min.js"></script>
```

그리고 body에 javascript를 작성하여 사용한다.(간단하게 쓰기 위해서 body영역에 html에 같이 적었지만 당연히 따로 분리할 수 있다.)

포스트맨으로 요청 보냈을 때 "method"에 "eth_accounts"로 적었는데, web3에서는 eth.accounts로 작성하면 된다. 대부분 비슷한 형태로 되어있다.

```html
<body>
    <script type="text/javascript">
        // 어디 네트워크로 요청하는지 지정한다. axios.create()같은 역할...
        const web3 = new Web3("http://127.0.0.1:8545")

        web3.eth.getAccounts().then(console.log)
        web3.eth.getBalance("0xd521B59D3E38a35a0e38Df1c6ad658736eC29392").then((data) => {
            // 10진수로 보여준다. 10**18
            console.log(data)
            const value = web3.utils.fromWei(data)
            console.log(value)
        })
        web3.eth
            .sendTransac₩ion({
                from: "0x68ff7899d99D607C1e323a8a341ceEAb42395Ded",
                to: "0xd521B59D3E38a35a0e38Df1c6ad658736eC29392",
                value: web3.utils.toWei("5", "ether"),
            })
            .then(console.log)
    </script>
</body>
```

포스트맨을 이용해서 요청을 보냈을 때는

```json
// eth_accounts 메서드 요청
{
    "jsonrpc": "2.0",
    "result": [
        "0x3325adeecb11793663bfbf6a827e8a6e0771c0a3",
        "0xa726ff9c48243603646855cd805b3ab59e501cc1",
        "0x60479742947ce0c4d6af3ba7844f439d52853f12",
        "0x9d5c87e1c4669d912c3ad808a689ef525c9974d9",
        "0xe3616f2f5e706cac444bae51dc872b8706034cb0",
        "0x6baa09aa2da74bd1c698057190b21ab9d435bc04",
        "0x1039b6263649146846e937c51ca7e6d565b7d899",
        "0xed4b33e6c88c192a0a7a70dbcf24d66471573baf",
        "0xe2cbae1dac0cab2b2305d2f841fe9a3323b570cb",
        "0x1df2212ac4c44263083ec4e88eb98574720611f7"
    ]
}
```

위와 같이 rpc버전과 result로 결과값을 던져주는데, web3.ethe.메서드()의 코드를 작성하면 반환값으로 result만 출력된다.

# Smart Contract

로컬에서 이더리움 네트워크에 요청을 하고, 요청하는 메세지를 이용해서 스마트 컨트랙트를 배포하면서 Account가 생성되는데, 이 계정이 Contract Account (CA)이다.
배포된 컨트랙트는 블록체인에 영구적으로 저장되며, 이를 통해 스마트 컨트랙트의 기능을 활용할 수 있게 된다.

## 스마트 컨트랙트 배포 프로세스

-   1. 소스코드 작성 : Solidity 언어를 이용하여 코드를 작성한다.
-   2. 컴파일 : Solidity 언어로 작성된 코드를 컴파일하여, EVM이 이해하고 실행할 수 있는 형식 (바이트코드)으로 변환한다.
-   3. 배포 트랜잭션 생성 및 전송 : 변환된 바이트코드와 추가적인 정보를 포함한 트랜잭션을 생성하고, 이를 이더리움 네트워크에 전송한다. 네트워크에서 트랜잭션 풀에 담겨 있다가 블록이 생성되면서 데이터로 포함되게 될 떄, 이 스마트 컨트랙트가 배포된다.

### 소스코드 작성

Solidity 언어를 이용한 코드를 작성한다. 확장자는 ".sol"을 사용한다.
예를 들어 counter를 만들게 된다면, 아래와 같다.

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter{
    uint256 value;

    constructor(){}

    function setValue(uint256 _value) public {
        value = _value;
    }

    function getValue() public view returns(uint256) {
        // 상태변수를 변화시키지 않고 바로 출력하기 위해서 view를 쓴다.
        return value;
    }

}
```

"// SPDX-License-Identifier: MIT" 주석은 solidity로 작성되는 소스 코드의 최상단에 작성되며, 라이선스 식별자를 지정하는 내용이다.

MIT는 MIT 라이센스를 나타내며, 소스 코드가 MIT 라이센스에 따라 배포되고 사용될 수 있음을 나타낸다.
MIT 라이센스는 오픈 소스 소프트웨어의 자유로운 사용, 수정, 복제, 배포를 허용하는 라이센스이다.

"pragma solidity ^0.8.0;" 는 컴파일러 버전을 지정하는 내용이다.

### 컴파일하기

solc 명령어를 이용하여 컴파일을 한다.

```sh
$ npx solc --bin --abi ./counter.sol
```

counter.sol파일을 .bin, .abi 파일로 컴파일한다는 내용의 명령어이다.
bin파일은 컴파일된 스마트 컨트랙트의 바이트코드이고, abi는 컴파일된 스마트 컨트랙트의 ABI(application Binary Interface)이다.

### 배포하기

컴파일한 내용을 Web3.js를 이용해서 배포를 진행할 수 있다.

```js
const Web3 = require("web3")
const web3 = new Web3("http://127.0.0.1:8545")

web3.eth
    .sendTransaction({
        from: "0xC6c386d2b6cd13C28a93388C4e60F3103Ec6b363",
        gas: "3000000", // 6721975
        data: "60806040526000600060005090905534801561001b5760006000fd5b50610021565b61016b806100306000396000f3fe60806040523480156100115760006000fd5b506004361061003b5760003560e01c80632096525514610041578063552410771461005f5761003b565b60006000fd5b61004961007b565b60405161005691906100f2565b60405180910390f35b610079600480360381019061007491906100b7565b61008d565b005b6000600060005054905061008a565b90565b8060006000508190909055505b5056610134565b6000813590506100b081610119565b5b92915050565b6000602082840312156100ca5760006000fd5b60006100d8848285016100a1565b9150505b92915050565b6100eb8161010e565b82525b5050565b600060208201905061010760008301846100e2565b5b92915050565b60008190505b919050565b6101228161010e565b811415156101305760006000fd5b5b50565bfea264697066735822122089a7c2d2e0eee51c087624220b19efdb25e5691e853a4f81acdce369f653da8064736f6c63430008000033",
    })
    .then(console.log)
```

data에는 .bin파일에 있는 내용으로 컨트랙트의 바이트코드를 작성해주면 된다.
