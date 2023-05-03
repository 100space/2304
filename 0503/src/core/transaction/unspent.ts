import { Receipt } from "@core/wallet/wallet.interface"
import Transaction from "./transaction"
import { TransactionRow, TxIn, TxOut, UnspentTxOut, UnspentTxOutPool } from "./transaction.interface"

class Unspent {
    private readonly unspentTxOuts: UnspentTxOutPool = []
    constructor(private readonly transaction: Transaction) {}

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
    getInput(receipt: Receipt) {
        const {
            sender: { account },
            amount,
        } = receipt
        const myUnspentTxOuts = this.me(account)

        //나의 관련 미사용 객체를  `receipt.amount` 보다 클 때 까지 뽑아와야 한다.
        let targetAmount = 0
        let txins = []
        for (const unspentTxOut of myUnspentTxOuts) {
            targetAmount += unspentTxOut.amount
            const txin = this.transaction.createTxIn(unspentTxOut.txOutIndex, unspentTxOut.txOutId, receipt.signature)
            txins.push(txin)
            if (targetAmount >= amount) break
        }
        return txins
    }
    getOutput(receipt: Receipt) {
        //output은 1~2개의 객체로 이루어져있다.

        const {
            sender: { account },
            received,
            amount,
        } = receipt
        const txOuts = []
        //받는 사람에 대한 txout
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
