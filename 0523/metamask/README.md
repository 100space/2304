# 브라우저에서 이더리움 블록체인 네트워크와 상호작용

브라우저에서도 요청을 할 수 있기 때문에 노드에게 요청을 할 수 있다.
하지만 요청을 할 때, 서명이 필요한 메서드들이 있다. 이 메서드를 사용할 때마다 사용자에게 개인키를 같이 전달해달라는 요청을 할 수 없다. 그렇기 때문에 브라우저에서 직접 노드에게 요청하는 것이 아닌 월렛프로그램을 이용해서 월렛프로그램에 있는 개인키로 만든 서명을 포함해서 노드에 전송하는 과정을 거쳐야한다.

즉, 브라우저는 월렛 프로그램에 데이터를 전달해주고, 월렛 프로그램에서 노드로 요청을 하는 과정을 거쳐야 한다는 것이다.

이런 과정을 통해서 개인키를 안전하게 보관함과 동시에 간단한 정보를 이용해서 transaction에 서명을 하고,이더리움 네트워크와 상호 작용을 할 수 있다.

# 탈중앙화된 애플리케이션에서의 로그인 처리방식

탈중앙화된 환경의 애플리케이션(DApps)의 로그인을 할 때, 사용자의 정보를 받지 않고 로그인 처리를 하는 것이 기본적이다. 대신 로그인 처리를하기 위해서 사용자는 개인키를 알고 있어야 한다.
서비스를 운영하는 서버에서는 로그인에 필요한 개인키를 저장하는 것이 아닌 사용자가 개인키를 이용해서 계정을 생성하고, 이 계정을 이용해서 로그인 유무를 확인하는 것이다. 내가 나인지 검증하는 과정이 없이 계정을 이용해서 로그인 처리를 하는 것이 DApps의 장점이라고 할 수 있다.

사용자는 개인키를 직접 입력하지 않고 관리하는 지갑프로그램과 연동하여 지갑프로그램과 브라우저가 연결되어 계정의 정보를 가져와서 로그인 처리를 한다.

지갑프로그램과 브라우저 화면에서 보이는 영역은 같은 화면에서 보인다고 해도 둘은 다른 환경에서 돌아간다.
예를들면 일반적인 브라우저 화면을 보는 상태에서 메타마스크의 확장프로그램을 팝업형태로 열어도 두 가지는 다른 환경에서 각자 구동되는 것이다.

브라우저화면과 지갑프로그램이 연동하기 위해서는 통신을 주고받는 과정을 통해서 할 수 있다.

## React를 이용하여 로그인하기

```sh
npx create-reate-app metamask
```

metamask를 설치한다. metamask가 있다면 브라우저 콘솔 탭에서 window.ethereum 입력시 값이 출력이 된다.

```js
import { useEffect, useState } from "react"

const App = () => {
    const [account, setAccount] = useState(null)
    const [web3, setWeb3] = useState(null)

    useEffect(() => {
        ;(async () => {
            const [data] = await window.ethereum.request({
                method: "eth_requestAccounts",
            })
            console.log(data)
            setWeb3(new Web3(window.ethereum)) // 브라우저에서 월렛으로 요청하기 위해서 매핑을 한다.
            setAccount(data)
        })()
    }, [])

    return <>{account || "로그인 전 입니다.."}</>
}

export default App
```

request 메서드로 요청을 하게 되면 메타마스크에 연결을 위한 요청이 온다.
원하는 계좌를 선택해서 커넥트를 맺을 수 있다.
계좌는 배열로 들어오기 때문에 구조 분해 할당으로 처리해준다.

얻어온 account 값을 상태로 관리하여 로그인 유무를 처리해서 로그인상태인지 아닌지를 확인할 수 있다.

## React를 이용해서 sendTransaction 구현하기

```js
import { useEffect, useState } from "react"
import Web3 from "web3"

const App = () => {
    const [account, setAccount] = useState(null)
    const [web3, setWeb3] = useState(null)

    useEffect(() => {
        ;(async () => {
            const [data] = await window.ethereum.request({
                method: "eth_requestAccounts",
            })
            console.log(data)
            setWeb3(new Web3(window.ethereum))
            setAccount(data)
        })()
    }, [])
    const handleClick = () => {
        web3.eth.getBalance(account).then(console.log)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const to = e.target.received.value
        const value = web3.utils.toWei(e.target.amount.value)
        const tx = {
            from: account,
            to,
            value,
        }
        web3.eth.sendTransaction(tx).then(console.log)
    }

    return (
        <>
            {account || "로그인 전 입니다.."}
            <button onClick={handleClick}>Balance</button>
            <br />
            <form onSubmit={handleSubmit}>
                <input type="text" id="received" placeholder="받을 계정" />
                <input type="text" id="amount" placeholder="보낼 금액" />
                <button type="submit">전송</button>
            </form>
        </>
    )
}

export default App
```

전송 버튼을 누르면 Web3 인스턴스에 의해 브라우저에서 월렛으로 데이터가 전달되고, 월렛에서 승인을 하면 서명을 담아서 transaction을 노드로 보내고, 노드에서 블록이 생성될 때, data에 트랜잭션이 담겨 블록체인에 저장된다.

# 스마트 컨트랙트 (Counter 기능)

Counter 기능을 하는 컨트랙트 코드를 작성하고 Remix를 이용하여 배포한다.

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter{
    uint256 value = 0;

    function getValue() public view returns(uint256) {
        // 상태변수를 변화시키지 않고 바로 출력하기 위해서 view를 쓴다.
        return value;
    }

    function increment () public  {
        value += 1;
    }
    function decrement () public  {
        value -= 1;
    }
}
```

remix에 코드를 기입하고 컴파일러 버전을 맞춘 후 컴파일을 진행한다.
컴파일 후에 abi 파일을 따로 관리한다.

```json
//   /src/abi/counter.json
[
    {
        "inputs": [],
        "name": "decrement",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getValue",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "increment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
```

이후 배포 탭에서 개발환경을 설정 후 배포를 진행한다.
배포를 진행하면 하단에 CA가 생성된다. 이 CA를 react에서 요청 할 때 사용할 것이다.

## App.jsx

```js
import { useEffect, useState } from "react"
import useWeb3 from "./hooks/web3.hook"
import abi from "./abi/counter.json"

const App2 = () => {
    const { user, web3 } = useWeb3()
    const [count, setCount] = useState(0)

    const getCount = () => {
        if (web3 === null) return
        const getValueData = abi.find((data) => data?.name === "getValue")
        const data = web3.eth.abi.encodeFunctionCall(getValueData, [])
        web3.eth
            .call({
                to: "0x1E9BE4ab1aBC0B7D1ED7bA2b59189e884D660A2c",
                data,
            })
            .then((data) => {
                const result = web3.utils.toBN(data).toString(10)
                setCount(result)
            })
    }
    const increment = async () => {
        const incrementData = abi.find((data) => data.name === "increment")
        const data = web3.eth.abi.encodeFunctionCall(incrementData, [])

        const from = user.account
        const to = "0x1E9BE4ab1aBC0B7D1ED7bA2b59189e884D660A2c"

        const tx = {
            from,
            to,
            data,
        }
        await web3.eth.sendTransaction(tx).then((data) => {
            getCount()
        })
    }
    const decrement = async () => {
        const decrementData = abi.find((data) => data.name === "decrement")
        const data = web3.eth.abi.encodeFunctionCall(decrementData, [])

        const from = user.account
        const to = "0x1E9BE4ab1aBC0B7D1ED7bA2b59189e884D660A2c"

        const tx = {
            from,
            to,
            data,
        }
        await web3.eth.sendTransaction(tx).then((data) => {
            getCount()
        })
    }

    useEffect(() => {
        if (web3 !== null) getCount()
    }, [web3])

    if (user.account === null) return "값이 존재하지 않는다."
    return (
        <>
            <div>
                <h2>카운터 : {count}</h2>
                <button onClick={increment}> 증가 </button>
                <button onClick={decrement}> 감소 </button>
            </div>
        </>
    )
}

export default App2
```

web3 인스턴스를 생성하는 것과, web3를 이용해서 로그인정보를 가져오기 위해서 커스텀 훅 (useWeb3)을 만들어서 확장성 및 가독성을 늘렸다.

```js
import { useEffect, useState } from "react"
import Web3 from "web3"
const useWeb3 = () => {
    const [user, setUser] = useState({
        account: "",
        balance: "",
    })
    const [web3, setWeb3] = useState(null)

    useEffect(() => {
        if (window.ethereum) {
            //login logic
            window.ethereum
                .request({
                    method: "eth_requestAccounts",
                })
                .then(async ([data]) => {
                    const web3Provider = new Web3(window.ethereum)
                    setWeb3(web3Provider)
                    setUser({
                        ...user,
                        account: data,
                        balance: web3Provider.utils.toWei(await web3Provider.eth.getBalance(data), "ether"),
                    })
                })
                .catch(console.log)
        } else {
            alert("Metamask 확장프로그램을 설치해주세요.")
        }
    }, [])

    return {
        user,
        web3,
    }
}

export default useWeb3
```

useEffect로 마운트 되었을 때, window.ethereum 객체를 사용할 수 있는지 확인하여 메타마스크 확장프로그램이 설치되었는지 확인한다.
메타마스크가 있으면 eth_requestAccounts 메서드를 사용하여 사용자 계정을 검색하는 요청을 보낸다.
계정 데이터를 받으면 Web3 인스턴스를 생성하고, web3 및 계정 주소와 잔액을 포함한 사용자 정보는 setWeb3 및 setUser 기능을 사용하여 상태가 업데이트된다.

useWeb3 훅은 'user' 및 'web3' 변수를 포함하는 개체를 반환하여, 사용자의 로그인 정보를 얻고, Ethereum 네트워크와의 추가적인 상호 작용을 위한 'web3' 인스턴스에 접근할 수 있다.
