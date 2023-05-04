import { Receipt } from "@core/wallet/wallet.interface"
import { SignatureInput } from "elliptic"
import { TransactionData, TransactionRow, TxIn, TxOut, UnspentTxOut, UnspentTxOutPool } from "./transaction.interface"

class Unspent {
    private readonly unspentTxOuts: UnspentTxOutPool = []
    constructor() {}

    //getter
    getUnspentTxPool() {
        return this.unspentTxOuts
    }
    delete(txin: TxIn) {
        const { txOutId, txOutIndex } = txin
        const index = this.unspentTxOuts.findIndex((utxo: UnspentTxOut) => {
            return utxo.txOutId === txOutId && utxo.txOutIndex === txOutIndex
        })
        if (index !== -1) this.unspentTxOuts.splice(index, 1)
    }

    create(hash: string) {
        return (txout: TxOut, txOutIndex: number) => {
            const { amount, account } = txout
            this.unspentTxOuts.push({
                txOutId: hash,
                txOutIndex,
                account,
                amount,
            })
        }
    }

    //트랜잭션
    sync(transactions: TransactionData) {
        if (typeof transactions === "string") return
        transactions.forEach(this.update.bind(this))
    }

    update(transaction: TransactionRow): void {
        const { txIns, txOuts, hash } = transaction
        if (!hash) throw new Error("hash값이 없습니다.")
        txOuts.forEach(this.create(hash))
        txIns.forEach(this.delete.bind(this))
    }

    //내 UTXO만 뽑아오는 메서드
    me(account: string): UnspentTxOut[] {
        // const utxo = this.UnspentTxOuts
        const myUnspentTxOuts = this.unspentTxOuts.filter((utxo) => utxo.account === account)
        return myUnspentTxOuts
    }

    //amount 값구하기
    getAmount(myUnspentTxOuts: UnspentTxOut[]) {
        return myUnspentTxOuts.reduce((acc, utxo) => {
            return acc + utxo.amount
        }, 0)
    }

    isAmount(currentAmount: number, targetAmount: number) {
        if (currentAmount < targetAmount) return true
        return false
    }
    isAmount2(account: string, sendAmount: number) {
        const myUnspentTxOuts = this.me(account)
        const totalAmount = this.getAmount(myUnspentTxOuts)
        if (totalAmount < sendAmount) return true
        return false
    }

    getInput(myUnspentTxOuts: UnspentTxOut[], receiptAmount: number, signature: SignatureInput) {
        let targetAmount = 0 //

        const txins = myUnspentTxOuts.reduce((acc: TxIn[], unspentTxOut: UnspentTxOut) => {
            const { amount, txOutId, txOutIndex } = unspentTxOut
            if (targetAmount >= receiptAmount) return acc
            targetAmount += amount
            acc.push({ txOutIndex, txOutId, signature })
            return acc
        }, [] as TxIn[])

        return txins
    }

    getOutput(received: string, amount: number, sender: string, balance: number) {
        const txouts: TxOut[] = []
        txouts.push({ account: received, amount })
        if (balance > 0) {
            txouts.push({ account: sender, amount: balance })
        }
        return txouts
    }
}
export default Unspent
