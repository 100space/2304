const Lottery = artifacts.require("Lottery")
const { assert } = require("chai")
const assertRevert = require("./assertRevert")
const expectEvent = require("./expectEvent")
//계정 0,1,2순서대로 인자값에 들어간다.
contract("Lottery", ([deployer, user1, user2]) => {
    let lottery
    let betAmount = 5 * 10 ** 15
    let betAmountBN = new web3.utils.BN(betAmount)
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
    describe("Bet", () => {
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

    describe("Discribute", () => {
        describe("When the answer is checkable", () => {
            it.only("should give  the user the pot when the answer mathches", async () => {
                //두글자 다 맞췄을 때
                await lottery.setAnswerForTest("0xab67403e239f151a355d44c46ce82e24524f8b7da385a11bdb5baf188b83f752", {
                    from: deployer,
                })
                await lottery.betAndDistribute("0xab", { from: user1, value: betAmount }) // 3-> 6
                await lottery.betAndDistribute("0x12", { from: user2, value: betAmount }) // 1 -> 4
                await lottery.betAndDistribute("0x14", { from: user2, value: betAmount }) // 2 -> 5
                await lottery.betAndDistribute("0x11", { from: user2, value: betAmount }) // 4 -> 7
                // await lottery.betAndDistribute("0x12", { from: user4, value: betAmount }) // 5 -> 8
                // await lottery.betAndDistribute("0x11", { from: user3, value: betAmount }) // 6 -> 9

                let potBefore = await lottery.getPot() // 0.01ETH
                let user1BalanceBefore = await web3.eth.getBalance(user1)
                let receipt7 = await lottery.betAndDistribute("0x12", { from: user2, value: betAmount }) //7 ->10 //user1 에게 pot이 간다.

                let potAfter = await lottery.getPot() // 0
                let user1BalanceAfter = await web3.eth.getBalance(user1) //before + 0.015ETH
                // pot 의 변화
                assert.equal(potBefore.toString(), (betAmountBN * 2).toString())
                assert.equal(potAfter.toString(), 0)
                // user(winner)의 밸런스 확인
            })
            it("should give  the user the amount he or she bet when a single character matehes", async () => {
                //한글자 다 맞췄을 때
            })
            it("should get the eth of user when the answer does not natch at all", async () => {
                //두글자 다 틀렸을 때
            })
        })
        describe("When the answer is not revealed(not Mined)", () => {})
        describe("When the answer is not revealed(Block limit is passed)", () => {})
    })
    describe("isMatch", () => {
        let blockHash = "0xab67403e239f151a355d44c46ce82e24524f8b7da385a11bdb5baf188b83f752"
        it("should be BettingResult. Win when two charachters match", async () => {
            let matchingResult = await lottery.isMatch("0xab", blockHash)
            assert.equal(matchingResult, 1)
        })
        it("should be BettingResult. Draw when two charachters match", async () => {
            let matchingResult = await lottery.isMatch("0xa0", blockHash)
            assert.equal(matchingResult, 2)

            matchingResult = await lottery.isMatch("0x0b", blockHash)
            assert.equal(matchingResult, 2)
        })
        it("should be BettingResult. Fail when two charachters match", async () => {
            let matchingResult = await lottery.isMatch("0xcd", blockHash)
            assert.equal(matchingResult, 0)
        })
    })
})
