# **사과 가게**

## **1. 목표**

-   1ETH를 이용해서 사과 1개를 산다.
-   내 계정이 가지고 있는 사과의 개수를 보여준다.
-   내가 가진 모든 사과를 한번에 환불할 수 있다. (CA의 값이 줄고 EOA의 값이 늘어난다.)

<br/><br/><br/>

## **2. 관련 패키지**

-   react
-   ganache-cli
-   truffle
-   web3

<br/><br/><br/>

## **3. truffle 설치 및 세팅**

```sh
$ npx truffle init
```

<br/>

### **truffle-config.js**

ganache-cli를 이용해서 로컬환경에서 테스트를 진행하기 위해서 development 주석을 해제한다.

<br/><br/><br/>

## **4. 화면 그리기**

```sh
$ npx create-react-app front
```

### **4-1.App.jsx**

```js
import useWeb3 from "./hooks/useWeb3"
import AppleShop from "./pages/appleShop"

const App = () => {
    const [account, web3] = useWeb3()
    if (!account || !web3) return <> 메타마스크와 연결 후 사용해주세요!</>
    return (
        <>
            <h1> 사과가게 </h1>
            <AppleShop web3={web3} account={account} />
        </>
    )
}
export default App
```

<br/><br/>

### **4-2.hooks/useWeb3.js**

```js
import { useEffect, useState } from "react"
import Web3 from "web3"

const useWeb3 = () => {
    const [account, setAccount] = useState(null)
    const [web3, setWeb3] = useState(null)
    const init = async () => {
        try {
            const [account] = await window.ethereum.request({ method: "eth_requestAccounts" })
            const web3 = new Web3(window.ethereum)
            setAccount(account)
            setWeb3(web3)
        } catch (e) {
            setAccount(null)
            setWeb3(null)
        }
    }
    useEffect(() => {
        if (!window.ethereum) return
        init()
    }, [])
    return [account, web3]
}

export default useWeb3
```

사용자에게 직접 서명을 얻는 것이 아닌 메타마스크에 저장되어있는 개인키로 서명을 하는 과정을 위해서 브라우저에서 메타마스크에 연동하여 web3를 이용해서 네트워크에 요청한다.

<br/><br/>

### **4-3.contract/appleShop.sol**

```sol
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AppleShop {
    mapping (address=>uint256) public myApple;

    function buy() public payable {
        myApple[msg.sender] += 1;
    }

    function get() public view returns(uint256){
        return myApple[msg.sender];
    }

    //전체 환불
    function sell() public payable {
        uint256 refund = myApple[msg.sender] * 10 ** 18; //1
        myApple[msg.sender] = 0;
        payable(msg.sender).transfer(refund);
    }
}
```

상태변수 myApple은 어떤 계정이 얼마의 사과를 가지고 있는지 확실하게 알기 위해서 키-값형태로로 관리하는 것이 좋다.

<br/>

### **payable**

스마트 컨트랙트를 작성할 때 함수 부분에 payable 키워드를 작성하게 되면 해당 함수가 'ETH'를 받을 수 있다는 것을 의미한다.

```sol
function A () public payable {
    // 함수에서 이더를 받을 수 있다.
}
```

CA계정에서 EOA로 이더를 보낼 때 payable을 작성하여 해당 주소로 이더를 보내줄 수 있다.

```sol
payable(msg.sender).transfer(/* 주소가 받을 이더의 양*/)
```

transfer()함수는 호출을 하는 CA의 ETH를 msg.sender에게 보내준다.

<br/><br/>

### **4-4.migrations/1_deploy_appleShop.js**

배포를 위해서 마이그래션 파일을 작성한다.

```js
const AppleShop = artifacts.require("appleShop")

module.exports = (deployer) => {
    deployer.deploy(AppleShop)
}
```

```sh
$ npx truffle migrate
```

생성된 json파일을 **src/contract/AppleShop.json** 디렉토리 생성 후 추가 해준다.

<br/><br/>

### **4-5.pages/appleShop.jsx**

```js
import { useEffect, useState } from "react"
import AppleShopContract from "../contract/AppleShop.json"

const AppleShop = ({ web3, account }) => {
    const [deployed, setDeployed] = useState(null)
    const [apple, setApple] = useState(0)

    const buy = async () => {
        await deployed.methods.buy().send({
            from: account,
            value: web3.utils.toWei("1", "ether"),
        })
        get()
    }

    const sell = async () => {
        await deployed.methods.sell().send({
            from: account,
        })
        get()
    }

    const get = async () => {
        if (!deployed) return
        try {
            const apple = await deployed.methods.get().call()
            setApple(apple)
        } catch (e) {
            console.log(e.message)
        }
    }

    useEffect(() => {
        get()
    }, [deployed])

    useEffect(() => {
        //CALL
        if (!web3) return
        const instance = new web3.eth.Contract(AppleShopContract.abi, "0x597d8e20f66c89c1d2b38817f1af3588c7156d8c")
        setDeployed(instance)
    }, [])

    return (
        <>
            <h2>사과 가격 : 1ETH</h2>
            <div>
                내가 가진 사과 개수 : {apple}
                <button onClick={buy}>사과 구매</button>
            </div>
            <div>
                총 사과 판매 가격 : 1ETH <button onClick={sell}>사과 판매</button>
            </div>
        </>
    )
}

export default AppleShop
```

<br/><br/>

/
/
/
/
/
/
/

<br/><br/>

# **Layer2**

블록체인은 트렐레마 문제가 있다. 확장성, 보안성, 탈중앙화 세가지 요소의 트렐레마로 무언가 하나의 성능을 좋게 하면 다른 하나의 성능이 줄어든다는 개념이다. 이 트렐레마를 해결하기 위해서 레이어2 블록체인이라는 개념을 이용하여 해결 할 수 있다는 방법이 제안되었다.

Layer2는 메인 블록체인 위에 추가적인 프로토콜 레이어를 구축하여 트랜잭션을 처리하거나 저장하는 방식을 변경하므로써 네트워크의 성능을 향상시킬 수 있는 것이다.

쉽게 설명하면 레이어2(layer2)란 기존의 블록체인이 아닌 별도의 레이어에서 연산을 수행하고, 기록, 검증한 후에 결과값을 기존의 블록체인으로 전달하여 블록에 포함시킨다.

Layer2를 활용하게 되면서 더 많은 양의 트랜잭션을 처리할 수 있게 된다. 또, 기존의 블록체인 네트워크에서는 gasPrice의 기본값이 20Gwei로 하나의 트랜잭션을 처리하기 위하여 비싼 수수료를 지불하여야한다. 하지만, layer2에서는 20wei를 기본값으로 처리하기 때문에 더 적은 수수료로 처리할 수 있게 된다.

그러므로 layer2를 이용하게 되면, 더 많은 트랜잭션(거래속도 증가)을 더 적은 가스량(비용감소)을 소모하여 블록에 포함시킬 수 있다.

<br/>

# **Layer2의 종류**

layer2는 크게 5종류로 나뉜다.

-   1. 사이드체인 : 메인 블록체인과 독립적으로 동작하는 블록체인으로 메인 블록체인의 부하를 분산시킬 수 있다.

-   2. 스테이트 채널 : 원하는 유저끼리 채널을 마련해서 디지털 자산을 거래하는 방식, 채널이 생성된 후에는 무한정 트랜잭션이 가능하다. 건마다 수수료를 지불하지 않는다.

-   3. 롤업 : 블록체인의 상태 및 거래정보를 압축하여 메인체인에 저장한다.

    -   3-1. 옵티미스틱 롤업
    -   3-2. 영자식 증명 롤업(ZK)

-   4. 플라즈마 : 사이드체인의 일종이다. 사이드 체인과의 차이점은 문제에 대한 대처 방식이다. 사이드 체인은 문제가 발생하면 자금 회 수가 어렵지만 플라즈마 체인에서는 자금을 메인넷으로 안전하게 이동 시킬 수 있다. 하지만 유예기간이 있어서 시간이 필요하다.

-   5. 발리디움 : 거래 기록을 블록체인 시스템이 아닌 곳에 저장하는 오프체인 방식

<br/>
