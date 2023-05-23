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
/*

커스텀 훅
함수형 컴포넌트로 만들어지면서 함수형 컴포넌트에서 상태를 관리할 수 있어야했따.
기본적으로 컴포넌트 형태이지만 리턴값이 컴포넌트가 아니다.

커스텀 hook은 내 마음대로 훅함수를 사용하지만, return이 JSX가 아닌것들을 말한다.
목적은 데이터를 반환한다. 하지만 데이터를 만들 때 hook함수를 활용한다. 

 */
