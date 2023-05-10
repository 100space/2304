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
        public readonly transaction: Transaction,
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
        return tx
    }
    public addBlock(receviedBlock: IBlock) {
        // 받은 블록이 올바른지 검증
        this.block.isVaildBlock(receviedBlock)
        // 내 블록과 받은 블록의 내용이 올바른지
        // 1개차이로 바로 내 체인에 넣을 수 있는지 아닌지 판단
        const isValid = this.chain.isValidChain(receviedBlock, this.chain.latestBlock())
        if (!isValid) return false
        this.unspent.sync(receviedBlock.data)
        this.transaction.sync(receviedBlock.data)

        this.chain.addToChain(receviedBlock)
        console.log("블록 내용이 체인에 추가되었습니다.")
        return true
    }
    //네트워크에서 필요한 메서드로, 최신화가 되지않은 chain을 최신화를 하기위해서 만드는 메서드
    public replaceChain(receivedChain: IBlock[]): void {
        if (receivedChain.length === 1) return
        //긴체인이 이기지만, 긴체인이 제대로된 체인인지를 검증부터 해야한다.
        const isvalidChain = this.chain.isValidAllChain(receivedChain)
        if (!isvalidChain) return

        //상대방의 블록이 더 긴지 확인하는 과정
        //current chain latest block
        const cclb = this.chain.latestBlock()
        const rclb = receivedChain[receivedChain.length - 1]
        if (rclb.height <= cclb.height) {
            console.log(`자신의 블록이 길거나 같습니다.`)
            return
        }

        // 체인교체
        this.chain.clearChain()
        receivedChain.shift()
        receivedChain.forEach((block: IBlock) => {
            this.chain.addToChain(block)
            this.unspent.sync(block.data)
        })
        console.log(`체인이 변경되었습니다.`)
    }
    public replaceTransaction(receivedTransaction: TransactionRow) {
        // 받은 트랜잭션 내용의 검증이 필요하지만..일단은 넘어간다.
        //받은 트랜잭션이 나의 풀에 있는 것인가?  없다면 풀에 푸쉬하고 있다면 return
        const withTransaction = this.transaction.containsTransaction(receivedTransaction)
        if (withTransaction) return
        this.transaction.addPool(receivedTransaction)
        console.log(`transaction : ${receivedTransaction} 내용이 추가 되었습니다.`)
    }
}
export default Ingchain
