const Lottery = artifacts.require("Lottery")

//계정 0,1,2순서대로 인자값에 들어간다.
contract("Lottery", ([deployer, user1, user2]) => {
    let lottery
    beforeEach(async () => {
        console.log("before Each")
        lottery = await Lottery.new()
    })
    it("basic test", async () => {
        console.log("BASIC TEST")
        let owner = await lottery.owner()
        let value = await lottery.getSomeValue()
        console.log(`owner : ${owner}`, `value : ${value}`)
        assert.equal(value, 5)
    })
    it.only("현재 getPot ", async () => {
        let pot = await lottery.getPot()
        assert.equal(pot, 0)
    })
})
