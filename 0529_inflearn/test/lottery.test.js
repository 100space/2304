const Lottery = artifacts.require("Lottery")
const assertRevert = require("./assertRevert")
const expectEvent = require("./expectEvent")
//계정 0,1,2순서대로 인자값에 들어간다.
contract("Lottery", ([deployer, user1, user2]) => {
    let lottery
    let betAmount = 5 * 10 ** 15
    let bet_block_interval = 3
    beforeEach(async () => {
        lottery = await Lottery.new()
    })
    // it("basic test", async () => {
    //     console.log("BASIC TEST")
    //     let owner = await lottery.owner()
    //     console.log(`owner : ${owner}`, `value : ${value}`)
    //     assert.equal(value, 5)
    // })
    it("현재 getPot ", async () => {
        let pot = await lottery.getPot()
        assert.equal(pot, 0)
    })
    describe.only("Bet", () => {
        it("should fail when the bet money is not 0.005 ETH", async () => {
            // fail transaction
            await assertRevert(lottery.bet("0xab", { from: user1, value: 4 * 10 ** 15 }))
            //transaction object {chainId, value, to, from, gas, gasPrice}
        })
        it("should put the bet to the bet queue with 1 bet", async () => {
            // bet
            let receipt = await lottery.bet("0xab", { from: user1, value: betAmount })
            let pot = await lottery.getPot()
            assert.equal(pot, 0)
            // check CA balance == 0.005
            let contractBalance = await web3.eth.getBalance(lottery.address)
            assert.equal(contractBalance, betAmount)
            // check bet info
            let currentBlockNumber = await web3.eth.getBlockNumber()
            let bet = await lottery.getBetInfo(0)
            assert.equal(bet.answerBlockNumber, currentBlockNumber + bet_block_interval)
            assert.equal(bet.bettor, user1)
            assert.equal(bet.challenges, "0xab")
            // check log
            await expectEvent.inLogs(receipt.logs, "BET")
        })
    })
})