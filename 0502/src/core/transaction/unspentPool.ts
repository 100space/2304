import { TransactionRow, TxOut, UnspentTxOut, UnspentTxOutPool } from "./transaction.interface"

class Unspent {
    private readonly UnspentTxOuts: UnspentTxOutPool = []
    constructor() {}

    getUnspentTxPool() {
        return this.UnspentTxOuts
    }

    createUTXO(transaction: TransactionRow): void {
        const { txOuts, hash } = transaction
        if (!hash) throw new Error("hash값이 없습니다.")

        // txOuts를 이용해서 미사용 객체를 만드는데
        // txOuts의 갯수가 가변적이다.

        const newUnspentTxOut = txOuts.map((txout: TxOut, index: number) => {
            const unspentTxOut = new UnspentTxOut()
            unspentTxOut.txOutId = hash
            unspentTxOut.txOutIndex = index
            unspentTxOut.account = txout.account
            unspentTxOut.amount = txout.amount
            return unspentTxOut
        })

        this.UnspentTxOuts.push(...newUnspentTxOut)

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
        const myUnspentTxOuts = this.UnspentTxOuts.filter((utxo) => (utxo.account = account))
        return myUnspentTxOuts
    }
}
export default Unspent
