import Block from "./block/block"
import Chain from "./chain/chain"
import Transaction from "./transaction/transaction"
import Unspent from "./transaction/unspent"

// 만든 조각들을 모아주는
class Ingchain {
    constructor(
        private readonly chain: Chain,
        private readonly block: Block,
        private readonly transaction: Transaction,
        private readonly unspent: Unspent
    ) {}

    //블록을 생성하기 위한 메서드
    mineBlock(account: string) {
        //블록을 만들기 위한 3가지 인자값 ( 이전블록, 트랜잭션, 10번째블록)
        // chain을 의존성주입을 한다.
        const latestBlock = this.chain.latestBlock()
        const adjustmentBlock = this.chain.getAdjustmentBlock()

        const coinbase = this.transaction.createCoinbase(account, latestBlock.height)
        const newBlock = this.block.createBlock(latestBlock, [coinbase], adjustmentBlock)
        this.chain.addToChain(newBlock) // [GENESIS, block#2]
        console.info(`블럭이 생성되었습니다.`)
        this.unspent.sync(newBlock.data)
        console.log(this.unspent.getUnspentTxPool())
        return this.chain.latestBlock()
    }
    sendTransaction() {}
    getBalance(account: string) {
        const myUnpentTxOuts = this.unspent.me(account)
        const balance = this.unspent.getAmount(myUnpentTxOuts)
        return balance
    }
}
export default Ingchain
