// Jest : Meta
//truffle에서는 JEST가 아닌 Mocha를 이용해서 단위테스트를 진행한다.

const Counter = artifacts.require("AppleShop")

// contract는 describe의 상위개념으로 알고 있으면 된다.
contract("Counter", (account) => {
    console.log(account)
    describe("Counter Contract", () => {
        it("instance 생성", async () => {
            instance = await Counter.deployed()
        })
        it("descrement", async () => {
            await instance.buy()
            await instance.buy()
            await instance.buy()
            const value = await instance.buy()
            console.log(value)
        })
        it("get Value", async () => {
            const value = await instance.get()
            console.log(value)
        })
        it("increment", async () => {
            await instance.increment()
            const value = await instance.sell()
            console.log(value)
        })
    })
})
// 테스트 진행할 때는, 배포를 한것을 가져오는 것이아닌 배포를 진행하고, 그 결과물로 테스트를 진행한다.
// 테스트 진행을 할 때마다 블럭이 추가적으로 생성 될것이다. 왜?
