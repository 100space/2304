import Block from "./block/block"
import Chain from "./chain/chain"
import Transaction from "./transaction/transaction"
import { TransactionRow } from "./transaction/transaction.interface"
import Unspent from "./transaction/unspent"
import Wallet from "./wallet/wallet"
import { Receipt } from "./wallet/wallet.interface"

class Ingchain {
    constructor(
        private readonly chain: Chain,
        private readonly block: Block,
        private readonly transaction: Transaction,
        private readonly unspent: Unspent,
        public readonly accounts: Wallet
    ) {}

    public mineBlock(account: string) {
        const latestBlock = this.chain.latestBlock()
        const adjustmentBlock = this.chain.getAdjustmentBlock()

        const transaction = this.transaction.getPool()
        const coinbase = this.transaction.createCoinbase(account, latestBlock.height)
        const newBlock = this.block.createBlock(latestBlock, [coinbase, ...transaction], adjustmentBlock)
        this.chain.addToChain(newBlock) // [GENESIS, block#2]
        console.info(`블럭이 생성되었습니다.`)
        this.unspent.sync(newBlock.data)
        this.transaction.sync(newBlock.data)

        return this.chain.latestBlock()
    }
    public getBalance(account: string) {
        const myUnspentTxOuts = this.unspent.me(account)
        const balance = this.unspent.getAmount(myUnspentTxOuts)
        return balance
    }
    public sendTransaction(receipt: Receipt) {
        //영수증이 본인이 작성한 것이 맞는지 확인해야 한다.
        const isVerify = this.accounts.verify(receipt)
        if (!isVerify) throw new Error("올바르지 않은 영수증입니다.")

        //보내는 사람의 잔액을 확인한다.
        const myUnspentTxOuts = this.unspent.me(receipt.sender.account)
        const balance = this.unspent.getAmount(myUnspentTxOuts)
        if (balance < receipt.amount) throw new Error("잔액이 부족합니다.")
        const tx = this.transaction.create(receipt, myUnspentTxOuts)

        // this.unspent.update(tx)
        // this.transaction.update(tx)
    }
}
export default Ingchain
