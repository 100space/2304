# **1. TestNet**

이더리움 테스트넷은 이더리움의 메인넷과 전체적으로 비슷하지만 chainId가 다르다.
chainId가 다르면 서로 다른 네트워크라고 인식하기 때문에,
실제 ETH를 사용하거나 실제 이더리움 메인넷과 상호 작용을 하지 않고 스마트 컨트랙트를 테스트 할 수 있다.

블록체인은 데이터가 블록에 포함되면 수정, 삭제가 불가능하다. 그래서 chainId만 다르고 기본적인 것이 모두 똑같은 테스트넷을 이용해서 충분한 테스트 및 검증을 한 후에 메인넷에 배포를 한다.
즉, 테스트넷과 메인넷에 들어가는 스마트 컨트랙트의 코드는 같다. 배포하는 네트워크만 다른 것이다.

chainId만 다른 것이기 때문에 블록에 포함되는 시간도 메인넷과 비슷하다. 그래서 Ganache를 이용해서 로컬로 배포했을 때와는 다르게 트랜잭션을 생성하여 노드에 전송을 하더라도 블록에 포함되어 데이터가 반영되는 시점까진 약간의 시간이 필요하다.

<br/>

## **1-1. TestNet 연결을 위한 사전 준비**

우리는 메인넷이나, 테스트넷을 구성하고 있는 노드의 RPC URL을 알 수 없기 때문에 메인넷과 테스트넷의 노드에 직접적으로 연결하여 데이터를 주고 받을 수 없다.

직접 네트워크에 구성되어 URL을 이용한 통신을 하기 위해서 내 컴퓨터 1대를 노드로 만들어서 근처 노드와 피어를 맺는 방법이 있다. 이렇게 하면 네트워크 내에 있는 블록들의 정보를 받아서 내가 사용할 수 있는 노드를 구성할 수 있다.
하지만 이 방법의 **가장 큰 문제는 비용**이다. 네트워크에 구성되어있는 블록들의 양이 매우 많기 때문에 동기화하는데 걸리는 시간과 용량이 많이 필요하기 때문에 비용이 많이 든다.

그래서 Node Provider을 이용해서 API로 요청을 한다. Node Provider는 블록체인 노드에 대한 접근을 제공해서 개발자가 블록체인 네트워크와 상호작용할 수 있도록 도와준다.
대표적으로 Infura와 Alchemy가 있다.

<br/>

## **1-2. Infura API key 및 PROJECT_ID**

인프라 node provider을 사용하기 위해서 회원가입 및 API key를 발급 받아야 한다.

**https://app.infura.io/login**

**1. infura 홈페이지에서 회원가입을 진행한다.**
**2. infura 로그인 한다.**
**3. CREATE NEW API KEY 버튼을 눌러서 API KEY를 받는다.**
**4. API KEY 이름을 지정한다.**
**5. 해당 API KEY 페이지에서 이더리움 테스트 네트워크(Goerli) URL을 얻는다.**
**6. URL을 메모장에 잠시 적어둔다.**

<br/>

## **1-3. truffle-config 설정**

truffle을 설정한다.

MNEMONIC는 개인키, PROJECT_ID 는 위에 6단계에서 "v3/" 이후 부분을 나타낸다.
"https://goerli.infura.io/v3/fe6fb1e9~~ ... "v3/" 이후 내용"

```js
require("dotenv").config()
const { MNEMONIC, PROJECT_ID } = process.env
const HDWalletProvider = require("@truffle/hdwallet-provider")

module.exports = {
    goerli: {
        provider: () => new HDWalletProvider(MNEMONIC, `https://goerli.infura.io/v3/${PROJECT_ID}`),
        network_id: 5, // Goerli's id
        confirmations: 2, // # of confirmations to wait between deployments. (default: 0)
        timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
        skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
}
```

두 군데에 주석을 해제하여 활성화 시켜준다.

Ganache를 사용할 때는 development의 주석을 활성화 했지만, 지금은 goerli 테스트넷을 이용할 예정이므로, 객체중에 goerli를 찾아서 주석을 지워준다.

dotenv을 이용해서 설정하고 정보를 가져와서 사용할 것이기 때문에 '.env'파일을 만들어준다.

```bash
# .env 파일
MNEMONIC=43d4e~~개인키
PROJECT_ID=fe6fb1e9~~ "v3/" 이후 내용
```

dotenv와 HDwalletProvider을 설치해준다.

```bash
$ npm install dotenv @truffle/hdwallet-provider
```

<br/>

## **1-4. 솔리디티 코드 및 마이그레이션 파일 작성**

어제의 코드와 비슷하기 때문에 생략

<br/>

## **1-5. migration**

마이그레이션을 이용해서 배포를 진행할 때 옵션을 이용해서 원하는 네트워크에 배포할 수 있다.

```bash
$ npx truffle migrate --network goerli
```

goerli 네트워크에 배포를 진행하기 위해서 --network 옵션을 이용해서 goerli에 배포를 진행할 수 있다.
여기서 중요한 것은 배포를 진행하기 전에 계정에 수수료가 발생하기 때문에 goerliETH가 있어야 한다.

https://goerlifaucet.com/을 이용해서 goerliETH를 무료로 얻을 수 있다.
goerliETH는 테스트넷용 이더라고 생각하면 된다. 수수료가 발생하지만 실제 이더를 이용해서 진행하는 것이 아니기 때문에 Goerli전용 Eth가 있어야 한다.

<br/>

## **1-6. 배포된 스마트 컨트랙트와 상호작용**

테스트넷을 이용해서 다른 사람이 배포했던 스마트 컨트랙트와 상호작용을 할 수 있는데,
다른 사람이 배포했던 컨트랙트에 접근하기 위해서 배포된 스마트 컨트랙트의 CA를 알아야한다.

그 CA를 이용해서 인스턴스를 생성하는 코드를 작성하고 그 인스턴스로 카운터를 조작한다.

```js
// counter.jsx

useEffect(() => {
    if (!deployed) setDeployed(new web3.eth.Contract(CounterContract.abi, "0x2Bd ... CA값"))
    get()
}, [])
```

스마트 컨트랙트의 인스턴스를 생성해서 인스턴스 안에 있는 메서드를 접근하면서 화면을 조작할 수 있게 된다.

<br/>

## **1-7. 콘솔을 이용하여 인스턴스 확인하기**

```bash
# 고얼리 네트워크에 콘솔로 확인하기
$ npx truffle console --network goerli
```

현재 Goerli 테스트넷을 이용해서 배포를 진행했기 때문에 Goerli 네트워크에 연결해야 한다.

```js
// 네트워크에 보낸 트렌젝션에 대한 정보
web3.eth.getTransaction("트랜잭션 해시값")

// 실제 블록에 포함된 트랜잭션 영수증에 대한 정보
web3.eth.getTransactionReceipt("트랜잭션 해시값")
```

블록이 생성된 후에 getTransactionReceipt()함수를 이용해서 트랜잭션 영수증에 대한 정보를 얻을 수 있는데 그 정보는 아래와 같다. 트랜잭션 영수증에는 로그(logs)를 포함하여 여러 정보를 담고 있다.

트랜잭션 영수증의 로그는 트랜잭션이 실행되는 동안 발생하는 이벤트에 대한 데이터이다.

<br/><br/><br/>

# **2. 스마트 컨트랙트 이벤트**

스마트 컨트랙트 이벤트는 A,B,C라는 사용자가 같은 네트워크 환경을 바라보고 있을 때,
A사용자가 네트워크 내의 상태를 변경하게 되면 변한 상태값을 A뿐 아니라 같은 네트워크 환경에 있는 모든 사용자에게 바뀐 상태 및 정보를 다른 사용자들에게 알린다.

이 이벤트가 발생하면 블록체인에 기록(logs)이 되고, 네트워크 내에 사용자들은 스마트 컨트랙트 이벤트를 구독하여 이벤트가 발생할 때마다 이벤트데이터에 접근할 수 있도록 한다.

<br/>

## **2-1. 컨트랙트 코드에 이벤트 작성하기**

```sol
event Count(uint256 value);

function increment() public{
    value += 1;
    emit Count(value);
}

function decrement() public{
    value -= 1;
    emit Count(value);
}
```

스마트 컨트랙트 이벤트를 등록하기 위해서 event 예약어를 사용해서 작성할 수 있다.
그리고 send()함수를 이용하여 상태가 변했을 때 emit을 이용해서 다른 사용자들에게 상태 변경에 대해서 알리고 변경 데이터를 제공할 수 있다.

이벤트를 등록할 때 : "event [이벤트명](타입을 포함한 상태변수)"
이벤트를 전달할 때 : "emit [이벤트명](상태변수)

컨트랙트 코드를 작성한 후 마이그레이션을 진행한다.

<br/>

## **2-2. 스마트 컨트랙트의 이벤트 로그 구독하기**

스마트 컨트랙트에서 발생하는 이벤트 로그를 구독하여 변화를 감지하기 위해서 CA를 이용한다.

```js
web3.eth.subscribe("logs", { address: "0x2BD2Ddf7b294cAB58D94b1A1e4fe4bF0EFA09ab4" }).on("data", (log) => {
    const params = [
        {
            indexed: false,
            internalType: "uint256",
            name: "count",
            type: "uint256",
        },
    ]
    const value = web3.eth.abi.decodeLog(params, log.data)
    console.log(value.count)
    setLoading(false)
    setCount(value.count)
})
```

subscribe()를 이용해서 구독을 하는데,
인자값으로 이벤트 유형과 필터옵션을 받는다.
이벤트 옵션은 내가 구독할 이벤트에 유형을 지정하는데, 우리는 logs를 추적하기 때문에 logs를 적는다.
두번 째 인자값으로 필터 옵션을 설정하는데, 블록체인에 여러 logs중에서 2번째 인자값에 대한 값으로 필터를 해서 범위를 줄인다. ( CA값을 이용해서 해당 CA로 추릴 수 있다.)

web3.eth.abi.decodeLog(params, log.data)는 제공된 params를 사용하여 log.data를 디코딩한다. 정의된 매개 변수를 기반으로 이벤트 로그 데이터에서 "count" 값을 얻어서 count의 상태를 바꾸면서 보여지는 count값이 바뀐다.

# **3. DApps**

탈중앙화인 어플리케이션을 뜻하는 디앱에서 데이터를 저장하고 관리하는 것을 블록체인의 블록들에게서 할 수 있다.
스마트 컨트렉트로 기본적인 앱을 구성하는 요소들의 데이터를 저장하고 노드를 통해서 데이터를 얻을 수 있다.
그렇기 때문에 디앱은 백엔드를 구성할 필요가 없다고 느낄 수 있다. (실제로 카운터를 구현할 때, 기본적으로 카운터의 값을 컨트랙트 코드의 상태변수에서 가져왔다.)

하지만 이더리움은 가스(수수료)의 개념이 있다. 간단한 정보조차 스마트 컨트랙트를 이용해서 관리를 하게 되면
매번 비용이 발생하기 때문에 간단한 정보 및 상태는 백엔드 서버를 구현하여서 진행을 한다.

# **4. 트랜잭션 생성시 서명하는 방식 3가지**
