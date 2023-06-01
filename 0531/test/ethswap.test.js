const IngToken = artifacts.require("ingToken")
const EthSwap = artifacts.require("EthSwap")

contract("EthSwap", ([deployed1, deployed2, account, account2]) => {
    //  현재 연결되어있는 account의 갯수
    describe("Account 확인", () => {
        it("deployer 확인하기", () => {
            console.log(deployed1)
            console.log(deployed2)
        })
        it("accounts 확인하기 ", () => {
            console.log(web3)
        })
    })
    describe("token deploy", () => {
        let token
        let swap
        it("배포 초기화", async () => {
            token = await IngToken.deployed()
            swap = await EthSwap.deployed()
            console.log(token, swap)
        })

        it("토큰 배포자(owner)의 balance 값 확인하기", async () => {
            const balance = await token.balanceOf(deployed1)
            console.log(balance.toString() / 10 ** 18) // 1000개
        })
        it("buyToken () 확인하기", async () => {
            const amount = await token.balanceOf(swap.address)
            assert.equal(amount.toString(), "0")

            const approve = await token.approve(swap.address, web3.utils.toWei("1000", "ether"))
            console.log(approve)

            //from : 사는 사람 /
            const a = await swap.buyToken({ from: account, to: swap.address, value: web3.utils.toWei("1", "ether") })

            console.log(await web3.eth.getBalance(account))
            console.log((await token.balanceOf(account)).toString()) // 실행할때 마다 ca가 바뀌기 때문에 100 만 찍힌다.
            console.log(await web3.eth.getBalance(swap.address))
        })
        it("sellToken () 확인하기", async () => {
            const balance = await token.balanceOf(account)
            console.log("token:", balance.toString())
            console.log("eth:", await web3.eth.getBalance(account))
            console.log("owner:", (await token.balanceOf(deployed1)).toString())

            await swap.sellToken(balance, {
                from: account,
            })
            console.log("token2:", (await token.balanceOf(account)).toString())
            console.log("eth2:", await web3.eth.getBalance(account))
            console.log("owner2:", (await token.balanceOf(deployed1)).toString())
        })
    })
})
