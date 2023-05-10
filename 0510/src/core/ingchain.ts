import Block from "./block/block"
import { IBlock } from "./block/block.interface"
import Chain from "./chain/chain"
import Transaction from "./transaction/transaction"
import { TransactionRow } from "./transaction/transaction.interface"
import Unspent from "./transaction/unspent"
import Wallet from "./wallet/wallet"
import { Receipt } from "./wallet/wallet.interface"

class Ingchain {
    constructor(
        public readonly chain: Chain,
        public readonly block: Block,
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
        const isVerify = this.accounts.verify(receipt)
        if (!isVerify) throw new Error("올바르지 않은 영수증입니다.")

        const myUnspentTxOuts = this.unspent.me(receipt.sender.account)
        const balance = this.unspent.getAmount(myUnspentTxOuts)
        if (balance < receipt.amount) throw new Error("잔액이 부족합니다.")
        const tx = this.transaction.create(receipt, myUnspentTxOuts)
    }
    public addBlock(receviedBlock: IBlock) {
        // 받은 블록이 올바른지 검증
        this.block.isVaildBlock(receviedBlock)
        // 내 블록과 받은 블록의 내용이 올바른지
        // 1개차이로 바로 내 체인에 넣을 수 있는지 아닌지 판단
        const isValid = this.chain.isValidChain(receviedBlock, this.chain.latestBlock())
        if (!isValid) return false
        this.chain.addToChain(receviedBlock)
        return true
    }
}
export default Ingchain
