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
