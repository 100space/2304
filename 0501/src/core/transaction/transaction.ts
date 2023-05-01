import { IBlock } from "@core/block/block.interface"
import { TransactionRow, TxIn, TxOut } from "./transaction.interface"

class Transaction {
    //마이닝을 하면 보상하는 (코인베이스)코드를 작성해야함
    private readonly REWARD = 50
    createTxOut(account: string, amount: number) {
        if (account.length !== 40) throw new Error("Account 형식이 올바르지 않다.")
        const txout = new TxOut()
        txout.account = account
        txout.amount = amount
        return txout
    }

    createTxIn(txOutIndex: number) {
        const txIn = new TxIn()
        txIn.txOutIndex = txOutIndex
        return txIn
    }

    createRow(txins: TxIn[], txOuts: TxOut[]) {
        const transactionRow = new TransactionRow()
        transactionRow.txIns = txins
        transactionRow.txOuts = txOuts
        return transactionRow
    }

    // 앞으로 생성되는 블록 전에 실행될 메서드이다.
    createCoinbase(account: string, lastestBlock: IBlock) {
        const txin = this.createTxIn(lastestBlock.height + 1)
        const txout = this.createTxOut(account, this.REWARD)
        return this.createRow([txin], [txout])
        //
    }
}

export default Transaction
