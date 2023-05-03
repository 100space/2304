import { Receipt } from "@core/wallet/wallet.interface"
import { SignatureInput } from "elliptic"
import Transaction from "./transaction"
import { TransactionRow, TxIn, TxOut, UnspentTxOut, UnspentTxOutPool } from "./transaction.interface"

class Unspent {
    private readonly unspentTxOuts: UnspentTxOutPool = []
    constructor() {}

    //getter
    getUnspentTxPool() {
        return this.unspentTxOuts
    }
    delete(txin: TxIn) {
        const index = this.unspentTxOuts.findIndex((utxo) => {
            return utxo.txOutId === txin.txOutId && utxo.txOutIndex === txin.txOutIndex
        })
        this.unspentTxOuts.splice(index)
    }

    createUTXO(transaction: TransactionRow): void {
        const { txOuts, hash } = transaction
        if (!hash) throw new Error("hash값이 없습니다.")
        //transaction.txin 삭제하는 코드
        transaction.txIns.forEach((v) => this.delete(v))

        // txOuts를 이용해서 미사용 객체를 만드는데
        // txOuts의 갯수가 가변적이다.

        // transaction.txout 생성하는코드
        const newUnspentTxOut = txOuts.map((txout: TxOut, index: number) => {
            const unspentTxOut = new UnspentTxOut()
            unspentTxOut.txOutId = hash
            unspentTxOut.txOutIndex = index
            unspentTxOut.account = txout.account
            unspentTxOut.amount = txout.amount
            return unspentTxOut
        })

        this.unspentTxOuts.push(...newUnspentTxOut)

        // const index = 0
        // const utxo = new UnspentTxOut()
        // utxo.txOutId = hash
        // utxo.txOutIndex = index
        // utxo.account = txOuts[index].account
        // utxo.amount = txOuts[index].amount
        // return utxo
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

    //영수증의 정보를 가지고 미사용트랜잭션을 구해올 수 있다.
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
    getOutput(receipt: Receipt) {
        const {
            sender: { account },
            received,
            amount,
        } = receipt
        const txOuts = []
        const totalAmount = this.getAmount(this.me(account))
        const received_txout = this.transaction.createTxOut(received, amount)
        txOuts.push(received_txout)

        if (totalAmount - amount > 0) {
            const sender_txOut = this.transaction.createTxOut(account, totalAmount - amount)
            txOuts.push(sender_txOut)
        }
        return txOuts
    }
}
export default Unspent
